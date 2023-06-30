import Phaser from "phaser";
import { GAME_LOOP_SPEED, StepEvent } from "../BattleScene";
import {
  BAR_WIDTH,
  createBars,
  createTexts,
  getUnitPos,
  setupUnitPointerEvents,
} from "./BattleUnitSetup";
import { onReceiveDamage } from "./BattleUnitEventHandler";

export class BattleUnit extends Phaser.GameObjects.Container {
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

  public isDead = false;

  constructor(scene: Phaser.Scene, texture: string, dataUnit: any) {
    const { x, y } = getUnitPos(dataUnit.position, dataUnit.owner);
    super(scene, x, y);
    this.setDepth(1);
    this.id = dataUnit.id;
    this.boardPosition = dataUnit.position;
    this.dataUnit = dataUnit;
    this.unitName = dataUnit.name;
    this.stats = dataUnit.stats;
    this.equipment = dataUnit.equipment;
    this.owner = dataUnit.owner;

    this.sprite = scene.add.sprite(0, 0, texture);
    this.sprite.play("idle");
    if (dataUnit.owner === 1) {
      this.sprite.setFlipX(true);
    }
    this.add(this.sprite);

    setupUnitPointerEvents(this);

    const { hpBar, armorBar, apBar, spBar } = createBars(this);
    this.hpBar = hpBar;
    this.armorBar = armorBar;
    this.apBar = apBar;
    this.spBar = spBar;

    const { hpText, armorText } = createTexts(this, hpBar.x, hpBar.y);
    this.hpText = hpText;
    this.armorText = armorText;
    this.hpText.setText(`${Math.max(0, dataUnit.stats.hp)}`);
    this.armorText.setText(`${Math.max(0, dataUnit.stats.armorHp)}`);

    scene.add.existing(this);

    this.sprite.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNumbers("warrior", {
        start: 12,
        end: 17,
      }),
      duration: 650,
    });

    this.sprite.anims.create({
      key: "skill",
      frames: this.scene.anims.generateFrameNumbers("warrior", {
        start: 12,
        end: 13,
      }),
      duration: 350,
    });
  }

  public onSelected() {
    this.isSelected = true;
    this.sprite.setTint(0xffff44);
  }

  public onDeselected() {
    this.isSelected = false;
    this.sprite.clearTint();
  }

  public playEvent({
    event,
    target,
    onEnd,
    onAttack,
  }: {
    event: StepEvent;
    target?: BattleUnit;
    onEnd?: Function;
    onAttack?: Function;
  }) {
    if (event.type === "HAS_DIED") {
      this.onDeath();
    }
    /* if (event.type === "IS_PREPARING_ATTACK") {
      this.sprite.play("attack", true).chain("idle");
    } */

    if (event.type === "ATTACK") {
      if (!target) {
        throw new Error("Attack target is undefined");
      }

      this.sprite.play("walk", true);
      // tween to target unit position
      const walkTween = this.scene.tweens.add({
        targets: this,
        x: target.x - (this.owner === 0 ? 90 : -90),
        y: target.y,
        duration: 300,
        ease: "Linear",
        yoyo: true,
        onYoyo: () => {
          walkTween.pause();
          if (this.sprite.anims.getName() !== "attack") {
            this.sprite
              .play("attack", true)
              .once("animationcomplete", () => {
                walkTween.resume();
                this.sprite.setFlipX(!this.sprite.flipX);
              })
              .chain("walk");

            this.scene.time.delayedCall(
              // sync with impact point
              this.sprite.anims.get("attack").duration / 1.5,
              () => {
                if (onAttack) onAttack();
                this.fillSpBar(event.payload.sp);
              }
            );
          }
        },
        onComplete: () => {
          this.sprite.setFlipX(!this.sprite.flipX);
          this.sprite.play("idle");
          if (onEnd) {
            onEnd();
          }

          this.fillApBar(event.payload.currentAp);
        },
      });
    }

    if (event.type === "RECEIVED_DAMAGE") {
      onReceiveDamage(this, event);
      // temporary
      if (event.payload.sp < 1000) {
        this.fillSpBar(event.payload.sp);
      }
    }

    if (event.type === "CAST_SKILL") {
      this.sprite.play("skill", true).chain("idle");

      this.fillSpBar(0);
    }

    if (event.type === "RECEIVED_HEAL") {
      const newHp = event.payload.hp;
      const hpHealed = event.payload.hpHealed;
      this.hpText.setText(`${newHp}`);

      this.scene.tweens.add({
        targets: this.hpText,
        scaleX: 1.25,
        scaleY: 1.25,
        duration: 150,
        ease: "Bounce.easeOut",
        onComplete: () => {
          this.scene.tweens.add({
            targets: this.hpText,
            scaleX: 1,
            scaleY: 1,
            duration: 150,
            ease: "Bounce.easeOut",
          });
        },
      });

      if (!this.isSelected) {
        this.sprite.setTint(0x1dad2e);
      }

      this.scene.time.addEvent({
        delay: 150,
        callback: () => {
          if (!this.isSelected) {
            this.sprite.clearTint();
          }
        },
      });

      const healText = this.scene.add.text(0, 30, "+" + hpHealed.toString(), {
        fontSize: hpHealed > 50 ? "40px" : "30px",
        color: "#1dad2e",
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
      });
      healText.setOrigin(0.5);

      this.scene.tweens.add({
        targets: healText,
        y: healText.y - 40,
        alpha: 0,
        duration: hpHealed > 50 ? 1900 : 1200,
        ease: "Linear",
        onComplete: () => {
          healText.destroy();
        },
      });

      this.add(healText);

      const newHpBarValue = (newHp / this.stats.maxHp) * BAR_WIDTH;
      this.scene.tweens.add({
        targets: this.hpBar,
        width: newHpBarValue <= 0 ? 0 : newHpBarValue,
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

    const duration = timeToAttack;
    /* if (fromResume) {
      if (this.apBarTween) {
        duration = this.apBarTween.duration - this.apBarTween.elapsed;
      }
    } else {
      duration = timeToAttack;
    } */

    this.apBarTween = this.scene.tweens.add({
      targets: this.apBar,
      width: { from: 0, to: BAR_WIDTH },
      duration: duration,
      ease: "Linear",
    });
  }

  private fillSpBar(currentSp: number) {
    const newSpBarWidth = Math.min((currentSp * BAR_WIDTH) / 1000, BAR_WIDTH);

    this.spBarTween = this.scene.tweens.add({
      targets: this.spBar,
      width: newSpBarWidth,
      duration: 50,
      ease: "Linear",
      onComplete: () => {
        this.spBarTween = null as any;
      },
    });
  }

  public onStartBattle({ fromResume = false }) {
    if (this.apBarTween && this.apBarTween.isPaused() && fromResume) {
      this.apBarTween.resume();
    } else {
      this.fillApBar(0, fromResume);
    }
    this.sprite.anims.resume();
  }

  private onDeath() {
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
}
