import Phaser from "phaser";
import { BattleUnit } from "./battleUnit/BattleUnit";
import { queryClient } from "../../../services/api/queryClient";
import { useGameStore } from "../../../services/state/game";
import { preloadBattle, setupBattle } from "./BattleSetup";
import { setupUnitAnimations } from "./battleUnit/BattleUnitSetup";

// todo: reuse from server
enum EVENT_TYPE {
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
    // zuera de particula
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff);
    graphics.fillRect(0, 0, 10, 10);
    graphics.generateTexture("square", 10, 10);
    graphics.destroy();

    setupUnitAnimations(this);

    const { board } = setupBattle(this);
    this.board = board;

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

    const orderedEvents = eventsOnThisStep.sort((a, b) => {
      const typeOrder = {
        ATTACK: 0,
        CAST_SKILL: 1,
        HAS_DIED: 2,
      };
      return typeOrder[a.type] - typeOrder[b.type];
    });

    const eventPile: any[] = [];

    const onEndAnimation = () => {
      eventPile.shift();
      if (eventPile.length > 0) {
        eventPile[0].unit.playEvent(eventPile[0]);
      } else {
        this.resumeTimeEvents();
      }
    };

    orderedEvents.forEach((event) => {
      const unit = this.units.find((unit) => unit.id === event.actorId);
      if (!unit) {
        throw Error(`couldnt find unit id: ${event.actorId}`);
      }

      const targets = this.units.filter((unit) => event.payload?.targetsId.includes(unit.id));

      let onEnd;
      if (event.type === "ATTACK") {
        this.board.bringToTop(unit);

        this.isPlayingEventAnimation = true;
        this.pauseTimeEvents();
        onEnd = () => {
          onEndAnimation();
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
      eventPile.push({ unit, event, targets, onEnd });

      // unit.playEvent({ event, targets, onEnd });
    });

    const unit = eventPile[0].unit;
    unit.playEvent(eventPile[0]);

    const isLastStep = step === this.totalSteps;
    if (isLastStep) {
      this.time.addEvent({
        delay: Math.min(GAME_LOOP_SPEED, 100),
        callback: () => {
          useGameStore.getState().setIsGamePaused(true);
        },
      });
    }
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
      const unit = new BattleUnit(this, dataUnit.class.name.toLowerCase(), dataUnit);
      this.units.push(unit);
      this.board.add(unit);
    });
  }

  resumeUnitsAnimations() {
    this.units.forEach((unit) => {
      unit.resumeAnimations();
    });
  }
  pauseUnitsAnimations() {
    this.units.forEach((unit) => {
      unit.pauseAnimations();
    });
  }
  resumeTimeEvents() {
    this.isPlayingEventAnimation = false;
    this.units.forEach((unit) => {
      unit.resumeApBar();
    });
    this.timeEventsHistory.forEach((event) => {
      event.paused = false;
    });
  }
  pauseTimeEvents() {
    this.units.forEach((unit) => {
      unit.pauseApBar();
    });
    this.timeEventsHistory.forEach((event) => {
      event.paused = true;
    });
  }

  startFromBeggining() {
    const stepsThatHaveEvents = [...new Set(this.eventHistory.map((event) => event.step))];

    this.units.forEach((unit) => {
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
}
