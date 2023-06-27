import Phaser from "phaser";
import { Unit } from "./Unit";
import { queryClient } from "../../services/api/queryClient";
import { useGameStore } from "../../services/state/game";

export async function fetchBattleSetup() {
  const response = await fetch("http://localhost:8787/game/battle/setup");
  const data = await response.json();
  return data;
}

export const GAME_LOOP_SPEED = 100;

export class Battle extends Phaser.Scene {
  text: any;
  firstStep: any;
  totalSteps = -1;
  board!: Phaser.GameObjects.Container;
  units: Unit[] = [];
  eventHistory: any[] = [];
  timeEventsHistory: Phaser.Time.TimerEvent[] = [];

  totalBattleDuration = 0;
  timeLoopStarted = 0;
  timeInBattle = 0;

  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("board", "assets/board3.png");
    this.load.image("castle", "assets/castle.png");

    this.load.spritesheet("warrior", "assets/Warrior.png", {
      frameWidth: 192,
      frameHeight: 192,
    });

    this.load.spritesheet("tree", "assets/tree.png", {
      frameWidth: 192,
      frameHeight: 192,
    });
  }

  addTrees() {
    const tree = this.add.sprite(295, -200, "tree");
    const tree2 = this.add.sprite(350, -180, "tree");
    const tree3 = this.add.sprite(-295, -200, "tree");
    const tree4 = this.add.sprite(-350, -180, "tree");

    this.anims.create({
      key: "tree_idle",
      frames: this.anims.generateFrameNumbers("tree", {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.play("tree_idle", [tree, tree2, tree3, tree4]);

    tree.on(Phaser.Animations.Events.ANIMATION_REPEAT, () => {
      tree.anims.repeatDelay = Math.ceil(Phaser.Math.Between(1500, 7000));
      tree2.anims.repeatDelay = Math.ceil(Phaser.Math.Between(1500, 7000));
      tree3.anims.repeatDelay = Math.ceil(Phaser.Math.Between(1500, 7000));
      tree4.anims.repeatDelay = Math.ceil(Phaser.Math.Between(1500, 7000));
    });

    return [tree, tree2, tree3, tree4];
  }

  create() {
    Unit.setupAnimations(this);
    const boardImage = this.add.image(0, 0, "board");
    const castle = this.add.image(0, -215, "castle");

    const trees = this.addTrees();

    const board = this.add.container(
      this.cameras.main.centerX,
      // this.cameras.main.centerY
      -280
    );

    board.add([boardImage, castle, ...trees]);
    this.board = board;

    this.tweens.add({
      targets: board,
      y: this.cameras.main.centerY,
      duration: 800,
      ease: Phaser.Math.Easing.Cubic.Out,
    });

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

    const unitOffset = {
      x: 82,
      y: 60,
      tile: 108,
    };

    const getUnitPosX = (pos: number, team: number) => {
      let tileOffset;

      if (pos === 0 || pos === 3) tileOffset = 0;
      else if (pos === 1 || pos === 4) tileOffset = 1;
      else tileOffset = 2;

      return (unitOffset.x + unitOffset.tile * tileOffset) * (team ? 1 : -1);
    };

    const getUnitPosY = (pos: number) => {
      const isTop = pos === 0 || pos === 1 || pos === 2 ? true : false;

      return unitOffset.y * (isTop ? -1 : 1) - 10;
    };

    firstFrame.units.forEach((dataUnit: any) => {
      const unit = new Unit(
        this,
        getUnitPosX(dataUnit.position, dataUnit.owner),
        getUnitPosY(dataUnit.position),
        "warrior",
        dataUnit
      );
      this.units.push(unit);
      unit.setDepth(1);
      if (dataUnit.owner === 1) {
        unit.sprite.setFlipX(true);
      }
      unit.initalizeUnit(dataUnit);
      this.board.add(unit);
    });
  }

  startLoop() {
    const fromResume = this.timeLoopStarted !== 0;
    this.units.forEach((unit) => {
      if (unit.isDead) return;
      unit.onStartBattle({ fromResume });
    });

    if (fromResume) {
      const stepsPassed = Math.floor(this.timeInBattle / GAME_LOOP_SPEED);

      const timeRemainingToNextStep =
        (stepsPassed + 1) * GAME_LOOP_SPEED - this.timeInBattle;

      this.eventHistory.forEach((event: any) => {
        // event already happened
        if (event.step <= stepsPassed) {
          return;
        }
        const delay =
          timeRemainingToNextStep +
          (event.step - (stepsPassed + 1)) * GAME_LOOP_SPEED;

        const timeEvent = this.time.addEvent({
          delay: delay,
          callback: () => {
            this.playEvent(event);
          },
          callbackScope: this,
        });

        this.timeEventsHistory.push(timeEvent);
      });
    } else {
      this.eventHistory.forEach((event: any) => {
        const delay = event.step * GAME_LOOP_SPEED;

        const timeEvent = this.time.addEvent({
          delay: delay,
          callback: () => {
            this.playEvent(event);
          },
          callbackScope: this,
        });

        this.timeEventsHistory.push(timeEvent);
      });
    }

    this.timeLoopStarted = this.time.now;
  }

  playEvent(event) {
    const unit = this.units.find((unit) => unit.id === event.id);
    if (!unit) {
      throw Error("couldnt find unit id: ", event.id);
    }

    const isLastStep = event.step === this.totalSteps;

    unit.playEvent(event);

    if (isLastStep) {
      this.time.addEvent({
        delay: Math.min(GAME_LOOP_SPEED, 100),
        callback: () => {
          useGameStore.getState().setIsGameRunning(false);
        },
      });
    }
  }

  stopLoop() {
    this.timeInBattle += this.time.now - this.timeLoopStarted;

    this.timeEventsHistory.forEach((event) => {
      event.remove();
    });
    this.units.forEach((unit) => {
      if (unit.isDead) return;
      if (unit.apBarTween) {
        unit.apBarTween.pause();
      }

      // if (unit.sprite.anims.getName() !== "idle") {
      unit.sprite.anims.pause();
      // }
    });
  }

  // update(time: number, delta: number): void {}
}
