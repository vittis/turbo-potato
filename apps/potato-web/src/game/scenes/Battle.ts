import Phaser from "phaser";
import { Unit } from "./Unit";

export class Battle extends Phaser.Scene {
  text: any;
  history: any[] = [];
  currentStep = 0;
  board!: Phaser.GameObjects.Container;
  units: Unit[] = [];

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
      duration: 1900,
      ease: Phaser.Math.Easing.Cubic.Out,
    });

    /* this.text = this.add.text(0, 0, "Move the mouse", {
      font: "16px Courier",
      color: "black",
    });
    this.text.setOrigin(0.5);
    board.add(this.text); */

    fetch("http://localhost:8787/game/karpov")
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => {
        this.initializeBattle(data);
      });
  }

  initializeBattle(data: any[]) {
    this.history = data;
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

    this.time.addEvent({
      delay: 30,
      callback: this.loopStep,
      callbackScope: this,
      repeat: this.history.length - 1,
    });
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
    this.currentStep++;
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
