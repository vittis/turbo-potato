import Phaser from "phaser";
import { BattleUnit } from "./battleUnit/BattleUnit";
import { queryClient } from "../../../services/api/queryClient";
import { useGameStore } from "../../../services/state/game";
import { preloadBattle, setupBattle } from "./BattleSetup";
import { setupUnitAnimations } from "./battleUnit/BattleUnitSetup";

// todo: reuse from server
enum EVENT_TYPE {
  USE_ABILITY = "USE_ABILITY",
  INSTANT_EFFECT = "INSTANT_EFFECT", // todo better event/subevent type organization
  FAINT = "FAINT",
  ATTACK = "ATTACK",
  IS_PREPARING_ATTACK = "IS_PREPARING_ATTACK",
  RECEIVED_DAMAGE = "RECEIVED_DAMAGE",
  HAS_DIED = "HAS_DIED",
  CAST_SKILL = "CAST_SKILL",
  RECEIVED_HEAL = "RECEIVED_HEAL",
}
export type SubStepEvent = Omit<StepEvent, "step" | "subEvents">;

export interface StepEvent {
  actorId: string;
  type: EVENT_TYPE;
  payload?: any;
  step: number;
  subEvents?: SubStepEvent[];
}

export async function fetchBattleSetup() {
  const response = await fetch("http://localhost:8787/game/battle/setup");
  const data = await response.json();
  return data;
}

export const GAME_LOOP_SPEED = 25;

export class Battle extends Phaser.Scene {
  text: any;
  firstStep: any;
  totalSteps = -1;
  board!: Phaser.GameObjects.Container;
  tiles!: Phaser.GameObjects.Sprite[];
  units: BattleUnit[] = [];
  eventHistory: StepEvent[] = [];
  timeEventsHistory: Phaser.Time.TimerEvent[] = [];

  isGamePaused = true;
  isPlayingEventAnimation = false;

  constructor() {
    super("GameScene");
  }

  preload() {
    preloadBattle(this);
  }

  create() {
    this.text = this.add.text(100, 50, "Move the mouse", {
      font: "16px Courier",
      color: "black",
    });
    this.text.setOrigin(0.5);
    // zuera de particula
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff);
    graphics.fillRect(0, 0, 10, 10);
    graphics.generateTexture("square", 10, 10);
    graphics.destroy();

    setupUnitAnimations(this);

    const { board, tiles } = setupBattle(this);
    this.board = board;
    this.tiles = tiles;
    // board.add(this.text);

    queryClient
      .fetchQuery({
        queryKey: ["game/battle/setup"],
        queryFn: fetchBattleSetup,
        staleTime: Infinity,
      })
      .then((data) => {
        this.firstStep = data.firstStep;
        this.totalSteps = data.totalSteps;
        this.eventHistory = data.eventHistory;
        this.initializeUnits(this.firstStep);
      });

    useGameStore.subscribe(
      (state) => state.selectedEntity,
      (selectedEntity) => {
        this.units.forEach((unit) => {
          if (unit.id === selectedEntity) {
            unit.onSelected();
          } else {
            unit.onDeselected();
          }
        });
      }
    );

    useGameStore.subscribe(
      (state) => state.isGamePaused,
      (isGamePaused) => {
        this.isGamePaused = isGamePaused;

        if (isGamePaused) {
          if (this.isPlayingEventAnimation) {
            console.log("kk?");
            this.pauseUnitsAnimations();
          } else {
            this.pauseTimeEvents();
          }
          return;
        }

        if (this.shouldStartFromBeginning()) {
          this.initializeUnits(this.firstStep);
          this.startFromBeggining();
          return;
        }

        if (this.isPlayingEventAnimation) {
          this.resumeUnitsAnimations();
          return;
        }
        this.resumeTimeEvents();
      }
    );
  }

  playEvents(step: number) {
    const eventsOnThisStep = this.eventHistory.filter((e) => e.step === step);

    const eventPile: any[] = [];

    const onEndAnimation = () => {
      eventPile.shift();
      if (eventPile.length > 0) {
        eventPile[0].unit.playEvent(eventPile[0]);
      } else {
        this.resumeTimeEvents();

        const isLastStep = step === this.totalSteps;
        if (isLastStep) {
          useGameStore.getState().setIsGamePaused(true);
        }
      }
    };

    eventsOnThisStep.forEach((event) => {
      const unit = this.units.find((unit) => unit.id === event.actorId);
      if (!unit) {
        throw Error(`couldnt find unit id: ${event.actorId}`);
      }

      const targets = this.units.filter((unit) => event.payload?.targetsId?.includes(unit.id));

      let onEnd;
      let onStart;
      if (event.type === "USE_ABILITY") {
        this.board.bringToTop(unit);

        this.isPlayingEventAnimation = true;
        this.pauseTimeEvents();
        onEnd = () => {
          this.units.forEach((unit) => {
            unit.restoreAbilities();
          });
          onEndAnimation();
        };
        onStart = () => {
          this.units.forEach((unit) => {
            if (unit.id === event.actorId /* || event.payload?.targetsId?.includes(unit.id) */) return;
            unit.unhighlightAbilities();
          });
        };
      }

      if (event.type === "CAST_SKILL") {
        this.board.bringToTop(unit);

        this.isPlayingEventAnimation = true;
        this.pauseTimeEvents();
        onEnd = () => {
          onEndAnimation();
        };
      }

      // todo is this necessary: test with more than one death
      if (event.type === "FAINT") {
        this.board.bringToTop(unit);

        this.isPlayingEventAnimation = true;
        this.pauseTimeEvents();
        onEnd = () => {
          onEndAnimation();
        };
      }

      //  "allUnits" is a hack to access all units from the event, need to think a better way in the future
      eventPile.push({ unit, event, targets, onEnd, onStart, allUnits: this.units });
    });
    const unit: BattleUnit = eventPile[0].unit;
    unit.playEvent(eventPile[0]);
  }

  shouldStartFromBeginning() {
    const lastTimeEventIndex = this.timeEventsHistory.length - 1;
    return this.timeEventsHistory.length === 0 || this.timeEventsHistory[lastTimeEventIndex].getRemaining() <= 0;
  }

  initializeUnits(firstFrame: any) {
    this.units.forEach((unit) => {
      unit.destroy();
    });
    this.units = [];

    firstFrame.units.forEach((dataUnit: any) => {
      const unit = new BattleUnit(this, dataUnit);
      this.units.push(unit);
      this.board.add(unit);
    });
  }

  resumeUnitsAnimations() {
    console.log("resumeUnitsAnimations");
    this.units.forEach((unit) => {
      unit.resumeAnimations();
    });
  }
  pauseUnitsAnimations() {
    console.log("pauseUnitsAnimations");
    this.units.forEach((unit) => {
      unit.pauseAnimations();
    });
  }
  resumeTimeEvents() {
    this.isPlayingEventAnimation = false;
    this.units.forEach((unit) => {
      unit.resumeSkillCooldown();
    });
    this.timeEventsHistory.forEach((event) => {
      event.paused = false;
    });
  }
  pauseTimeEvents() {
    this.units.forEach((unit) => {
      unit.pauseSkillCooldown();
    });
    this.timeEventsHistory.forEach((event) => {
      event.paused = true;
    });
  }

  startFromBeggining() {
    const stepsThatHaveEvents = [...new Set(this.eventHistory.map((event) => event.step))];

    this.units.forEach((unit) => {
      // todo initialize abilities?
      unit.onStart();
    });

    stepsThatHaveEvents.forEach((step) => {
      const delay = step * GAME_LOOP_SPEED;

      const timeEvent = this.time.addEvent({
        delay: delay,
        callback: () => {
          this.playEvents(step);
        },
        callbackScope: this,
      });

      this.timeEventsHistory.push(timeEvent);
    });
  }

  update(/* time: number, delta: number */): void {
    if (this.units.length === 0) return;
    const pointer = this.input.activePointer;
    this.text.setText([
      "mouse: " + Math.ceil(pointer.x) + "," + Math.ceil(pointer.y),
      /* "warrior: " +
            Math.ceil(this.warrior.parentContainer.x + this.warrior.x) +
            "," +
            Math.ceil(this.warrior.parentContainer.y + this.warrior.y), */
      "board: " + Math.ceil(this.board.x) + "," + Math.ceil(this.board.y),
      "guy: " + Math.ceil(this.units[0].x) + "," + Math.ceil(this.units[0].y),
    ]);
  }
}
