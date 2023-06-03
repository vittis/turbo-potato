import Phaser from "phaser";
import { useGameStore } from "../../services/state/game";
import { GAME_LOOP_SPEED } from "./Battle";

const BAR_WIDTH = 50;

export class Unit extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite;
  public hpBar: Phaser.GameObjects.Rectangle;
  public armorBar: Phaser.GameObjects.Rectangle;
  public apBar: Phaser.GameObjects.Rectangle;
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

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    dataUnit: any
  ) {
    super(scene, x, y);
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
    const apBarHeight = 5;
    const apBarYOffset = 9;

    const rect = new Phaser.GameObjects.Rectangle(
      scene,
      this.sprite.x + borderWidth / 2 - width / 2,
      this.sprite.y + yOffset + borderWidth / 2,
      width,
      height,
      0xde3c45
    );
    this.hpBar = rect;

    const armorRect = new Phaser.GameObjects.Rectangle(
      scene,
      this.sprite.x + borderWidth / 2 - width / 2,
      this.sprite.y + yOffset + borderWidth / 2,
      width,
      height,
      0xa7a7a7
    );
    this.armorBar = armorRect;

    const apBar = new Phaser.GameObjects.Rectangle(
      scene,
      this.sprite.x + borderWidth / 2 - width / 2,
      this.sprite.y + yOffset + borderWidth / 2 + apBarYOffset,
      0,
      apBarHeight,
      0x3679d8
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

    const rectBorder = new Phaser.GameObjects.Rectangle(
      scene,
      this.sprite.x - width / 2,
      this.sprite.y + yOffset,
      width + borderWidth,
      height + borderWidth,
      0x232422,
      0.75
    );
    rectBorder.setStrokeStyle(borderWidth, 0x390908, 1);

    rect.setOrigin(0);
    rect.setDepth(1);
    rectBorder.setOrigin(0);
    rectBorder.setDepth(1);
    armorRect.setOrigin(0);
    armorRect.setDepth(1);
    apBar.setOrigin(0);
    apBar.setDepth(1);
    apRectBorder.setOrigin(0);
    apRectBorder.setDepth(1);

    this.add(this.sprite);
    this.add(rectBorder);
    this.add(rect);
    this.add(armorRect);
    this.add(apRectBorder);
    this.add(apBar);

    const hpText = this.scene.add.text(rect.x + 12, rect.y + 27, "0", {
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
    const armorText = this.scene.add.text(rect.x + 42, rect.y + 27, "0", {
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
  }

  public updateUnit(dataUnit: any) {
    const damageTaken =
      this.stats.hp -
      dataUnit.stats.hp +
      this.stats.armorHp -
      dataUnit.stats.armorHp;
    const hasTakenHpDamage = this.stats.hp - dataUnit.stats.hp > 0;
    const hasTakenArmorDamage = this.stats.armorHp - dataUnit.stats.armorHp > 0;

    const hasTakenDamage = damageTaken > 0;

    if (hasTakenDamage) {
      this.scene.time.addEvent({
        delay: 250,
        callbackScope: this,
        callback: () => {
          const newHp = Math.max(0, dataUnit.stats.hp);
          const newArmorHp = Math.max(0, dataUnit.stats.armorHp);
          this.hpText.setText(`${newHp}`);
          this.armorText.setText(`${newArmorHp}`);
          if (newArmorHp === 0) {
            this.armorText.alpha = 0;
          }
          if (newHp === 0) {
            this.hpText.alpha = 0;
            this.hpBar.alpha = 0;
            this.apBar.alpha = 0;
            this.armorBar.alpha = 0;
          }

          this.scene.tweens.add({
            targets: hasTakenHpDamage ? this.hpText : this.armorText,
            scaleX: 1.25,
            scaleY: 1.25,
            duration: 150,
            ease: "Bounce.easeOut",
            onComplete: () => {
              this.hpText.setText(newHp.toString());
              this.armorText.setText(newArmorHp.toString());
              this.scene.tweens.add({
                targets: hasTakenHpDamage ? this.hpText : this.armorText,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: "Bounce.easeOut",
              });
            },
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
            "-" + damageTaken.toString(),
            {
              fontSize: damageTaken > 50 ? "40px" : "30px",
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
            duration: damageTaken > 50 ? 1900 : 1200,
            ease: "Linear",
            onComplete: () => {
              damageText.destroy();
            },
          });

          this.add(damageText);

          const newHpBarValue =
            (dataUnit.stats.hp / dataUnit.stats.maxHp) * BAR_WIDTH;
          this.scene.tweens.add({
            targets: this.hpBar,
            width: newHpBarValue <= 0 ? 0 : newHpBarValue,
            duration: 80,
            ease: "Linear",
          });

          const newArmorHpValue =
            (dataUnit.stats.armorHp / dataUnit.stats.maxArmorHp) * BAR_WIDTH;
          this.scene.tweens.add({
            targets: this.armorBar,
            width: newArmorHpValue <= 0 ? 0 : newArmorHpValue,
            duration: 80,
            ease: "Linear",
          });
        },
      });
    }

    const newApBarWidth = (dataUnit.stats.ap / 1000) * BAR_WIDTH;
    if (dataUnit.stats.ap < this.stats.ap) {
      // did action
      if (this.apBarTween) {
        this.apBarTween.stop();
      }
      this.apBar.width = 0;
      this.sprite.play("attack", true).chain("idle");
    } else {
      this.apBarTween = this.scene.tweens.add({
        targets: this.apBar,
        width: newApBarWidth <= 0 ? 0 : newApBarWidth,
        duration: GAME_LOOP_SPEED, // has to be lower than game loop speed to be smooth (need confirmation)
        ease: "Linear",
      });
    }

    this.stats = dataUnit.stats;
    if (this.stats.hp <= 0) {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        angle: 180,
        duration: 1400,
        delay: 250,
        ease: "Sine.easeInOut",
        onComplete: () => {
          this.sprite.setTint(0xde3c45);
          // Destroy the unit after the death animation is complete
          this.destroy();
        },
      });
    }
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
      key: "attack",
      frames: scene.anims.generateFrameNumbers("warrior", {
        start: 12,
        end: 17,
      }),
      frameRate: 9,
      //repeat: 1,
      // repeatDelay: 2000
    });

    scene.anims.create({
      key: "walk",
      frames: scene.anims.generateFrameNumbers("warrior", {
        start: 6,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
      // repeatDelay: 2000
    });

    scene.anims.create({
      key: "idle",
      frames: scene.anims.generateFrameNumbers("warrior", {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
      repeat: -1,
      // repeatDelay: 2000
    });
  }
}
