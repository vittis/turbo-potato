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
export interface StepEvent {
  type: EVENT_TYPE;
  id: string;
  payload?: any;
  step: number;
}

export async function fetchBattleSetup() {
  const response = await fetch("http://localhost:8787/game/battle/setup");
  const data = await response.json();
  return data;
}

export const GAME_LOOP_SPEED = 50;

export class Battle extends Phaser.Scene {
  text: any;
  firstStep: any;
  totalSteps = -1;
  board!: Phaser.GameObjects.Container;
  units: BattleUnit[] = [];
  eventHistory: StepEvent[] = [];
  timeEventsHistory: Phaser.Time.TimerEvent[] = [];

  totalBattleDuration = 0;
  timeLoopStarted = 0;
  timeInBattle = 0;

  externalPaused = true;
  inGamePaused = false;

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
        this.totalBattleDuration =
          this.eventHistory[this.eventHistory.length - 1].step *
            GAME_LOOP_SPEED +
          Math.min(GAME_LOOP_SPEED, 100);

        this.initializeBattle(this.firstStep);
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
      (state) => state.isGameRunning,
      (isGameRunning) => {
        if (isGameRunning) {
          if (
            this.timeInBattle > this.totalBattleDuration ||
            this.timeLoopStarted === 0
          ) {
            this.initializeBattle(this.firstStep);
          }

          this.startLoop();
        } else {
          this.stopLoop();
        }
      }
    );
  }

  initializeBattle(firstFrame: any) {
    this.timeLoopStarted = 0;
    this.timeInBattle = 0;
    this.units.forEach((unit) => {
      unit.destroy();
    });
    this.units = [];

    firstFrame.units.forEach((dataUnit: any) => {
      const unit = new BattleUnit(
        this,
        dataUnit.class.name.toLowerCase(),
        dataUnit
      );
      this.units.push(unit);
      this.board.add(unit);
    });
  }

  playEvents(step: number) {
    const eventsOnThisStep = this.eventHistory.filter((e) => e.step === step);

    const orderedEvents = eventsOnThisStep.sort((a, b) => {
      const typeOrder = {
        RECEIVED_DAMAGE: 0,
        CAST_SKILL: 1,
        HAS_DIED: 2,
        ATTACK: 3,
      };

      return typeOrder[a.type] - typeOrder[b.type];
    });

    orderedEvents.forEach((event) => {
      const unit = this.units.find((unit) => unit.id === event.id);
      if (!unit) {
        throw Error(`couldnt find unit id: ${event.id}`);
      }

      const target = this.units.find(
        (unit) => unit.id === event.payload?.target
      );

      let onEnd;
      if (event.type === "ATTACK") {
        console.log("PLAY ATTACK STEP: ", event.step);
        this.board.bringToTop(unit);
        this.stopLoop({ fromInGame: true });
        onEnd = () => {
          this.startLoop({ fromInGame: true });
        };
      }

      unit.playEvent({ event, target, onEnd });
    });

    const isLastStep = step === this.totalSteps;
    if (isLastStep) {
      this.time.addEvent({
        delay: Math.min(GAME_LOOP_SPEED, 100),
        callback: () => {
          useGameStore.getState().setIsGameRunning(false);
        },
      });
    }
  }

  resumeFromPause() {
    if (this.inGamePaused) return;
    this.timeEventsHistory.forEach((event) => {
      event.paused = false;
    });
  }

  startFromBeggining() {
    const stepsThatHaveEvents = [
      ...new Set(this.eventHistory.map((event) => event.step)),
    ];

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

  startLoop({ fromInGame = false }: { fromInGame?: boolean } = {}) {
    this.externalPaused = false;
    this.inGamePaused = fromInGame ? false : this.inGamePaused;

    const fromResume = this.timeLoopStarted !== 0;
    this.units.forEach((unit) => {
      if (unit.isDead) return;
      unit.onStartBattle({ fromResume, inGamePaused: this.inGamePaused });
    });

    if (fromResume) {
      this.resumeFromPause();
    } else {
      this.startFromBeggining();
    }

    this.timeLoopStarted = this.time.now;
  }

  stopLoop({ fromInGame = false }: { fromInGame?: boolean } = {}) {
    this.externalPaused = !fromInGame;
    this.inGamePaused = fromInGame ? fromInGame : this.inGamePaused;

    this.timeEventsHistory.forEach((event) => {
      event.paused = true;
    });

    this.units.forEach((unit) => {
      if (unit.isDead) return;
      if (unit.apBarTween.isActive()) {
        unit.apBarTween.pause();
      }

      if (unit?.attackTweenChain?.isPlaying()) {
        unit.attackTweenChain.pause();
      }

      if (unit.sprite.anims.getName() !== "idle") {
        unit.sprite.anims.pause();
      }
    });
  }

  update(time: number, delta: number): void {
    // .log(stepsPassed);
    if (this.externalPaused) return;
    if (this.inGamePaused) return;
    this.timeInBattle += delta;
  }
}
