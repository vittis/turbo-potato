import Phaser from "phaser";
import { BattleUnit } from "./battleUnit/BattleUnit";
import { queryClient } from "../../../services/api/queryClient";
import { useGameState } from "../../../services/state/useGameState";
import { preloadBattle, setupBattle } from "./BattleSetup";
import {
  Ability,
  highlightAbility,
  restoreAbilities,
  unhighlightAbilities,
} from "./battleUnit/BattleUnitAbilities";
import { useSetupState } from "@/services/state/useSetupState";

// todo: reuse from server
enum EVENT_TYPE {
  USE_ABILITY = "USE_ABILITY",
  TRIGGER_EFFECT = "TRIGGER_EFFECT",
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
  trigger?: string;
  subEvents?: SubStepEvent[];
}

export async function fetchBattleSetup() {
  const gameFromLocalStorage = localStorage.getItem("game");

  if (gameFromLocalStorage) {
    return JSON.parse(gameFromLocalStorage);
  }

  const response = await fetch("http://localhost:8787/game/battle/setup");
  const data = await response.json();
  return data;
}

export const GAME_LOOP_SPEED = 20;

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
    super("BattleScene");
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

    useGameState.subscribe(
      (state) => state.isGameHidden,
      (isGameHidden) => {
        if (!isGameHidden) {
          const gameFromLocalStorage = localStorage.getItem("game");

          if (gameFromLocalStorage) {
            const game = JSON.parse(gameFromLocalStorage);
            this.firstStep = game.firstStep;
            this.totalSteps = game.totalSteps;
            this.eventHistory = game.eventHistory;
            this.initializeUnits(this.firstStep);
          }
        }
      }
    );

    useGameState.subscribe(
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

    useSetupState.subscribe(
      (state) => state.shouldStartGame,
      (shouldStartGame) => {
        if (shouldStartGame) {
          const gameFromLocalStorage = localStorage.getItem("game");
          const data = JSON.parse(gameFromLocalStorage as string);

          queryClient.invalidateQueries({ queryKey: ["game/battle/setup"] });
          this.firstStep = data.firstStep;
          this.totalSteps = data.totalSteps;
          this.eventHistory = data.eventHistory;
          this.initializeUnits(this.firstStep);
        }
      }
    );

    useGameState.subscribe(
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

    const eventPile: any[] = [];

    const onEndAnimation = () => {
      eventPile.shift();

      if (eventPile.length > 0 && eventPile.every((event) => event.event.type === "FAINT")) {
        eventPile.forEach((event) => {
          // todo better way to do this (maybe refactor this entire function)
          const onEnd = () => {
            if (event?.onEnd) {
              event.onEnd();
            }
            const isLastStep = step === this.totalSteps;
            if (isLastStep) {
              useGameState.getState().setIsGamePaused(true);
            }
          };
          event.unit.playEvent({ ...event, onEnd });
        });
        eventPile.splice(0, eventPile.length);
      } else {
        if (eventPile.length > 0) {
          eventPile[0].unit.playEvent(eventPile[0]);
        } else {
          this.resumeTimeEvents();

          const isLastStep = step === this.totalSteps;
          if (isLastStep) {
            useGameState.getState().setIsGamePaused(true);
          }
        }
      }
    };

    /* const hasFaintEvent = eventsOnThisStep.find(
      (event) => event.type === "TRIGGER_EFFECT" && event.trigger === "SELF_FAINT"
    ); */
    console.log(eventsOnThisStep);

    eventsOnThisStep.forEach((event) => {
      const unit = this.units.find((unit) => unit.id === event.actorId);
      if (!unit) {
        throw Error(`couldnt find unit id: ${event.actorId}`);
      }

      let targets;

      let onEnd;
      let onStart;

      if (event.type === "USE_ABILITY") {
        const useAbilityEventsOnThisStep = eventsOnThisStep.filter(
          (e) => e.step === step && e.type === "USE_ABILITY"
        );
        const allAbilitiesOfAllUnits = this.units.reduce((acc, unit) => {
          return [...acc, ...unit.abilitiesManager.abilities];
        }, [] as Ability[]);

        targets = this.units.filter((unit) => event.payload?.targetsId?.includes(unit.id));

        this.board.bringToTop(unit);

        this.isPlayingEventAnimation = true;
        this.pauseTimeEvents();
        onEnd = () => {
          if (useAbilityEventsOnThisStep.length === 1) {
            this.units.forEach((unit) => {
              unit.abilitiesManager.restoreAbilities();
            });
          } else {
            // more than one ability used in the step
            const abilityUsed = allAbilitiesOfAllUnits.find(
              (ability) => ability.id === event.payload.id
            ) as Ability;
            abilityUsed.hasUsed = true;
            unhighlightAbilities([abilityUsed], this);
            const allAbilitiesUsedIds = useAbilityEventsOnThisStep.map((e) => e.payload.id);
            const areAllAbilitiesUsed = allAbilitiesUsedIds.every((abilityId) => {
              const abilityUsed = allAbilitiesOfAllUnits.find(
                (ability) => ability.id === abilityId
              ) as Ability;
              return abilityUsed.hasUsed;
            });
            if (areAllAbilitiesUsed) {
              restoreAbilities(allAbilitiesOfAllUnits, this);
            }
          }

          onEndAnimation();
        };
        onStart = () => {
          if (useAbilityEventsOnThisStep.length === 1) {
            const abilityUsed = allAbilitiesOfAllUnits.find(
              (ability) => ability.id === event.payload.id
            ) as Ability;
            highlightAbility(abilityUsed, this);
            unhighlightAbilities(
              allAbilitiesOfAllUnits.filter((a) => a.id !== abilityUsed.id),
              this
            );

            this.units.forEach((unit) => {
              if (unit.id === event.actorId /* || event.payload?.targetsId?.includes(unit.id) */) {
                return;
              }
              unit.abilitiesManager.unhighlightAbilities();
            });
          } else {
            // more than one ability used in the step
            const allAbilitiesUsedIds = useAbilityEventsOnThisStep.map((e) => e.payload.id);

            allAbilitiesUsedIds.forEach((abilityId) => {
              const abilityUsed = allAbilitiesOfAllUnits.find(
                (ability) => ability.id === abilityId
              ) as Ability;

              if (!abilityUsed.hasUsed) {
                highlightAbility(abilityUsed, this);
              }
            });

            allAbilitiesOfAllUnits.forEach((ability) => {
              if (!allAbilitiesUsedIds.includes(ability.id)) {
                unhighlightAbilities([ability], this);
              }
            });
          }
        };
      }

      if (event.type === "TRIGGER_EFFECT") {
        targets = [unit];

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
    return (
      this.timeEventsHistory.length === 0 ||
      this.timeEventsHistory[lastTimeEventIndex].getRemaining() <= 0
    );
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
      unit.abilitiesManager.resumeSkillCooldown();
    });
    this.timeEventsHistory.forEach((event) => {
      event.paused = false;
    });
  }
  pauseTimeEvents() {
    this.units.forEach((unit) => {
      unit.abilitiesManager.pauseSkillCooldown();
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
