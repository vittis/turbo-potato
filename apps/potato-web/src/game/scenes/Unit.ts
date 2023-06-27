import Phaser from "phaser";
import { useGameStore } from "../../services/state/game";
import { GAME_LOOP_SPEED } from "./Battle";

const BAR_WIDTH = 50;

export class Unit extends Phaser.GameObjects.Container {
  public id: string;
  public sprite: Phaser.GameObjects.Sprite;
  public hpBar: Phaser.GameObjects.Rectangle;
  public armorBar: Phaser.GameObjects.Rectangle;
  public apBar: Phaser.GameObjects.Rectangle;
  public spBar: Phaser.GameObjects.Rectangle;
  public boardPosition: number;
  public owner: number;
  public hpText: Phaser.GameObjects.Text;
  public armorText: Phaser.GameObjects.Text;

  public stats: any;
  public equipment: any;
  public unitName: string;

  public dataUnit: any;

  public isSelected = false;
  public apBarTween!: Phaser.Tweens.Tween;
  public spBarTween!: Phaser.Tweens.Tween;

  isDead = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    dataUnit: any
  ) {
    super(scene, x, y);
    this.id = dataUnit.id;
    this.boardPosition = dataUnit.position;
    this.dataUnit = dataUnit;

    this.unitName = dataUnit.name;
    this.stats = dataUnit.stats;
    this.equipment = dataUnit.equipment;
    this.owner = dataUnit.owner;

    this.sprite = scene.add.sprite(0, 0, texture);
    this.initializeAnimations();

    const width = BAR_WIDTH;
    const height = 7;
    const borderWidth = 3;
    const yOffset = 50;
    const spBarHeight = 5;
    const spBarYOffset = 9;
    const apBarHeight = 5;
    const apBarYOffset = 18;

    const hpRect = new Phaser.GameObjects.Rectangle(
      scene,
      this.sprite.x + borderWidth / 2 - width / 2,
      this.sprite.y + yOffset + borderWidth / 2,
      width,
      height,
      0xde3c45
    );
    this.hpBar = hpRect;

    const armorRect = new Phaser.GameObjects.Rectangle(
      scene,
      this.sprite.x + borderWidth / 2 - width / 2,
      this.sprite.y + yOffset + borderWidth / 2,
      width,
      height,
      0xa7a7a7
    );
    this.armorBar = armorRect;

    const hpRectBorder = new Phaser.GameObjects.Rectangle(
      scene,
      this.sprite.x - width / 2,
      this.sprite.y + yOffset,
      width + borderWidth,
      height + borderWidth,
      0x232422,
      0.75
    );
    hpRectBorder.setStrokeStyle(borderWidth, 0x390908, 1);

    const spBar = new Phaser.GameObjects.Rectangle(
      scene,
      this.sprite.x + borderWidth / 2 - width / 2,
      this.sprite.y + yOffset + borderWidth / 2 + spBarYOffset,
      0,
      spBarHeight,
      0x3679d8
    );
    this.spBar = spBar;

    const spRectBorder = new Phaser.GameObjects.Rectangle(
      scene,
      this.sprite.x - width / 2,
      this.sprite.y + yOffset + spBarYOffset,
      width + borderWidth,
      spBarHeight + borderWidth,
      0x232422,
      0.75
    );
    spRectBorder.setStrokeStyle(borderWidth, 0x390908, 1);

    const apBar = new Phaser.GameObjects.Rectangle(
      scene,
      this.sprite.x + borderWidth / 2 - width / 2,
      this.sprite.y + yOffset + borderWidth / 2 + apBarYOffset,
      0,
      apBarHeight,
      0xd4b320
    );
    this.apBar = apBar;

    const apRectBorder = new Phaser.GameObjects.Rectangle(
      scene,
      this.sprite.x - width / 2,
      this.sprite.y + yOffset + apBarYOffset,
      width + borderWidth,
      apBarHeight + borderWidth,
      0x232422,
      0.75
    );
    apRectBorder.setStrokeStyle(borderWidth, 0x390908, 1);

    hpRect.setOrigin(0);
    hpRect.setDepth(1);
    armorRect.setOrigin(0);
    armorRect.setDepth(1);
    hpRectBorder.setOrigin(0);
    hpRectBorder.setDepth(1);
    spBar.setOrigin(0);
    spBar.setDepth(1);
    spRectBorder.setOrigin(0);
    spRectBorder.setDepth(1);
    apBar.setOrigin(0);
    apBar.setDepth(1);
    apRectBorder.setOrigin(0);
    apRectBorder.setDepth(1);

    this.add(this.sprite);
    this.add(hpRectBorder);
    this.add(hpRect);
    this.add(armorRect);
    this.add(spRectBorder);
    this.add(spBar);
    this.add(apRectBorder);
    this.add(apBar);

    const hpText = this.scene.add.text(hpRect.x + 12, hpRect.y + 36, "0", {
      fontSize: "18px",
      color: "#ff121d",
      fontFamily: "IM Fell DW Pica",
      stroke: "#000000",
      strokeThickness: 2,
      fontStyle: "bold",
      shadow: {
        offsetX: 0,
        offsetY: 1,
        color: "#000",
        blur: 0,
        stroke: true,
      },
    });
    const armorText = this.scene.add.text(hpRect.x + 42, hpRect.y + 36, "0", {
      fontSize: "18px",
      color: "#a7a7a7",
      fontFamily: "IM Fell DW Pica",
      stroke: "#000000",
      strokeThickness: 2,
      fontStyle: "bold",
      shadow: {
        offsetX: 0,
        offsetY: 1,
        color: "#000",
        blur: 0,
        stroke: true,
      },
    });
    this.armorText = armorText;
    this.hpText = hpText;
    this.hpText.setOrigin(0.5);
    this.armorText.setOrigin(0.5);

    this.add(hpText);
    this.add(armorText);
    scene.add.existing(this);
  }

  public onSelected() {
    this.isSelected = true;
    this.sprite.setTint(0xffff44);
  }

  public onDeselected() {
    this.isSelected = false;
    this.sprite.clearTint();
  }

  public initalizeUnit(dataUnit: any) {
    const newHp = Math.max(0, dataUnit.stats.hp);
    const newArmorHp = Math.max(0, dataUnit.stats.armorHp);
    this.hpText.setText(`${newHp}`);
    this.armorText.setText(`${newArmorHp}`);

    const stepsInAttackAnimation = Math.ceil(
      dataUnit.stats.attackDelay / (10 + dataUnit.stats.attackSpeed / 10)
    );
    const timeInAttackAnimation = stepsInAttackAnimation * GAME_LOOP_SPEED;

    // create local animation
    this.sprite.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNumbers("warrior", {
        start: 12,
        end: 17,
      }),
      duration: timeInAttackAnimation,
    });
  }

  public playEvent(event: any) {
    if (event.type === "HAS_DIED") {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        angle: 180,
        duration: 1400,
        delay: Math.min(250, GAME_LOOP_SPEED * 1.5),
        ease: "Sine.easeInOut",
        onComplete: () => {
          this.setVisible(false);
          this.isDead = true;
        },
      });
    }
    if (event.type === "IS_PREPARING_ATTACK") {
      this.sprite.play("attack", true).chain("idle");
    }

    if (event.type === "ATTACK") {
      const currentAp = event.payload.currentAp;
      this.fillApBar(currentAp);
    }

    if (event.type === "RECEIVED_DAMAGE") {
      const newHp = Math.max(0, event.payload.hp);
      const newArmorHp = Math.max(0, event.payload.armorHp);

      const hasTakenHpDamage = newHp < this.stats.hp;
      const hasTakenArmorDamage = newArmorHp < this.stats.armorHp;

      const textTargets = [] as any[];
      if (hasTakenArmorDamage) textTargets.push(this.armorText);
      if (hasTakenHpDamage) textTargets.push(this.hpText);

      this.hpText.setText(`${newHp}`);
      this.armorText.setText(`${newArmorHp}`);

      if (newArmorHp === 0) {
        this.armorText.alpha = 0;
      }
      if (newHp === 0) {
        this.hpText.alpha = 0;
        this.hpBar.alpha = 0;
        this.armorBar.alpha = 0;
        this.spBar.alpha = 0;
        this.apBar.alpha = 0;
      }

      this.scene.tweens.add({
        targets: textTargets,
        scaleX: 1.25,
        scaleY: 1.25,
        duration: 150,
        ease: "Bounce.easeOut",
        onComplete: () => {
          this.scene.tweens.add({
            targets: textTargets,
            scaleX: 1,
            scaleY: 1,
            duration: 150,
            ease: "Bounce.easeOut",
          });
        },
      });

      this.scene.tweens.add({
        targets: this,
        x: this.owner === 0 ? this.x - 5 : this.x + 5,
        duration: 150,
        yoyo: true,
        ease: "Bounce.easeOut",
      });

      if (!this.isSelected) {
        this.sprite.setTint(0xde3c45);
      }

      this.scene.time.addEvent({
        delay: 150,
        callback: () => {
          if (!this.isSelected) {
            this.sprite.clearTint();
          }
        },
      });

      const damageText = this.scene.add.text(
        0,
        30,
        "-" + event.payload.damage.toString(),
        {
          fontSize: event.payload.damage > 50 ? "40px" : "30px",
          color: "#ff121d",
          fontFamily: "IM Fell DW Pica",
          stroke: "#000000",
          strokeThickness: 2,
          fontStyle: "bold",
          shadow: {
            offsetX: 0,
            offsetY: 3,
            color: "#000",
            blur: 0,
            stroke: true,
            fill: false,
          },
        }
      );
      damageText.setOrigin(0.5);

      this.scene.tweens.add({
        targets: damageText,
        y: damageText.y - 40,
        alpha: 0,
        duration: event.payload.damage > 50 ? 1900 : 1200,
        ease: "Linear",
        onComplete: () => {
          damageText.destroy();
        },
      });

      this.add(damageText);

      const newHpBarValue = (newHp / this.stats.maxHp) * BAR_WIDTH;
      this.scene.tweens.add({
        targets: this.hpBar,
        width: newHpBarValue <= 0 ? 0 : newHpBarValue,
        duration: 80,
        ease: "Linear",
      });

      const newArmorHpValue = (newArmorHp / this.stats.maxArmorHp) * BAR_WIDTH;
      this.scene.tweens.add({
        targets: this.armorBar,
        width: newArmorHpValue <= 0 ? 0 : newArmorHpValue,
        duration: 80,
        ease: "Linear",
      });
    }
  }

  private fillApBar(currentAp: number, fromResume?: boolean) {
    const stepsToAttackFromZeroAP = Math.ceil(1000 / this.stats.attackSpeed);

    const willNeedOneLessStep =
      (stepsToAttackFromZeroAP - 1) * this.stats.attackSpeed + currentAp >=
      1000;

    const stepsToAttack =
      stepsToAttackFromZeroAP - (willNeedOneLessStep ? 1 : 0);

    const timeToAttack = stepsToAttack * GAME_LOOP_SPEED;

    let duration = 0;
    if (fromResume) {
      if (this.apBarTween) {
        duration = this.apBarTween.duration - this.apBarTween.elapsed;
      }
    } else {
      duration = timeToAttack;
    }

    this.apBarTween = this.scene.tweens.add({
      targets: this.apBar,
      width: { from: fromResume ? this.apBar.width : 0, to: BAR_WIDTH },
      duration: duration,
      ease: "Linear",
      onComplete: () => {
        this.apBarTween = null as any;
      },
    });
  }

  public onStartBattle({ fromResume = false }) {
    this.fillApBar(0, fromResume);
    this.sprite.anims.resume();
  }

  public initializeAnimations() {
    this.sprite.play("idle");

    this.sprite.setInteractive();

    this.sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      if (!this.isSelected) {
        useGameStore
          .getState()
          .setSelectedEntity(`${this.owner}${this.boardPosition}`);
      } else {
        useGameStore.getState().setSelectedEntity(null);
      }
      /* this.sprite
        .play("attack", true)
        .on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          if (!this.isSelected) {
            this.sprite.clearTint();
          }
        })
        .chain("idle"); */
    });

    this.sprite.on("pointerup", () => {
      if (!this.isSelected) {
        this.sprite.clearTint();
      }
    });

    this.sprite.on("pointerover", () => {
      this.sprite.setTint(0xdddd44);
      this.scene.game.canvas.style.cursor = "pointer";
    });

    this.sprite.on("pointerout", () => {
      if (!this.isSelected) {
        this.sprite.clearTint();
      } else {
        this.sprite.setTint(0xffff44);
      }
      this.scene.game.canvas.style.cursor = "default";
    });
  }

  public static setupAnimations(scene: Phaser.Scene) {
    scene.anims.create({
      key: "walk",
      frames: scene.anims.generateFrameNumbers("warrior", {
        start: 6,
        end: 11,
      }),
      frameRate: 10,
    });

    scene.anims.create({
      key: "idle",
      frames: scene.anims.generateFrameNumbers("warrior", {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "skill",
      frames: scene.anims.generateFrameNumbers("warrior", {
        start: 12,
        end: 13,
      }),
      duration: 1000,
      //repeat: 1,
      // repeatDelay: 2000
    });
  }
}
