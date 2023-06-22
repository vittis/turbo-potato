import Phaser from "phaser";
import { Unit } from "./Unit";
import { queryClient } from "../../services/api/queryClient";
import { useGameStore } from "../../services/state/game";

export async function fetchUnits() {
  console.log("fetching");
  const response = await fetch("http://localhost:8787/game/karpov");
  const data = await response.json();
  return data;
}

export const GAME_LOOP_SPEED = 100;

export class Battle extends Phaser.Scene {
  text: any;
  history: any[] = [];
  currentStep = 0;
  board!: Phaser.GameObjects.Container;
  units: Unit[] = [];
  mainLoop!: Phaser.Time.TimerEvent;

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

  /* addWarriorRunner() {
      const warrior = this.add.sprite(-300, -100, "warrior");
      warrior.play("idle");

      const goTweenConfig = {
         targets: warrior,
         x: 310,
         duration: 3400,
         ease: Phaser.Math.Easing.Linear,
         delay: 5000,
         onStart: () => {
            warrior.play("walk");
            warrior.setFlipX(false);
         },
         onComplete: () => {
            warrior.play("attack");
            this.time.addEvent({
               callback: () => {
                  warrior.play("idle");
                  this.add.tween(backTweenConfig);
               },
               delay: 2000,
            });
         },
      } as Phaser.Types.Tweens.TweenBuilderConfig;

      const backTweenConfig = {
         targets: warrior,
         x: -300,
         duration: 3500,
         ease: Phaser.Math.Easing.Linear,
         delay: 5000,
         onStart: () => {
            warrior.play("walk");
            warrior.setFlipX(true);
         },
         onComplete: () => {
            warrior.play("attack");
            this.time.addEvent({
               callback: () => {
                  warrior.play("idle");
                  this.add.tween(goTweenConfig);
               },
               delay: 2000,
            });
         },
      } as Phaser.Types.Tweens.TweenBuilderConfig;

      warrior.play("idle");
      this.tweens.add(goTweenConfig);

      return [warrior];
   } */

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
      duration: 1100,
      ease: Phaser.Math.Easing.Cubic.Out,
    });

    queryClient
      .fetchQuery({
        queryKey: ["game/units"],
        queryFn: fetchUnits,
        staleTime: Infinity,
      })
      .then((data) => {
        this.history = data;
        this.initializeBattle(this.history);
      });

    useGameStore.subscribe(
      (state) => state.selectedEntity,
      (selectedEntity) => {
        this.units.forEach((unit) => {
          if (`${unit.owner}${unit.boardPosition}` === selectedEntity) {
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
          if (this.currentStep === this.history.length - 1) {
            this.initializeBattle(this.history);
            this.currentStep = 0;
          }
          this.startLoop();
        } else {
          this.stopLoop();
        }
      }
    );
  }

  initializeBattle(data: any[]) {
    this.units.forEach((unit) => unit.destroy());
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

    data[0].units.forEach((dataUnit: any) => {
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

    console.log("end initialize");
    // this.startLoop();
  }

  startLoop() {
    console.log("start loop");
    this.units.forEach((unit) => unit.onStartBattle());

    this.mainLoop = this.time.addEvent({
      delay: GAME_LOOP_SPEED,
      callback: this.loopStep,
      callbackScope: this,
      repeat: this.history.length - 1 - this.currentStep,
    });
  }

  stopLoop() {
    if (this.mainLoop) {
      this.mainLoop.remove();
    }
  }

  loopStep() {
    this.history[this.currentStep].units.forEach((dataUnit: any) => {
      const unit = this.units.find(
        (unit) =>
          unit.boardPosition === dataUnit.position &&
          unit.owner === dataUnit.owner
      );
      if (unit) {
        unit.updateUnit(dataUnit);
        if (unit.stats.hp <= 0) {
          this.units = this.units.filter(
            (u) => u.owner !== unit.owner || u.position !== unit.position
          );
        }
      }
    });
    if (this.currentStep === this.history.length - 1) {
      useGameStore.getState().setIsGameRunning(false);
    } else {
      this.currentStep++;
    }
  }

  update(time: number, delta: number): void {
    /* const pointer = this.input.activePointer;
       this.text.setText([
         "mouse: " + Math.ceil(pointer.x) + "," + Math.ceil(pointer.y),
         "warrior: " +
            Math.ceil(this.warrior.parentContainer.x + this.warrior.x) +
            "," +
            Math.ceil(this.warrior.parentContainer.y + this.warrior.y),
      ]); */
  }
}
