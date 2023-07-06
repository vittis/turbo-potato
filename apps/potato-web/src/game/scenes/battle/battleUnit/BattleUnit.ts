import Phaser from "phaser";
import { GAME_LOOP_SPEED, StepEvent } from "../BattleScene";
import { BAR_WIDTH, createBars, createTexts, getUnitPos, setupUnitPointerEvents } from "./BattleUnitSetup";
import { onReceiveDamage } from "./BattleUnitEventHandler";
import { createAttackAnimation } from "./BattleUnitAnimations";

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
  public startingX;
  public startingY: number;
  public attackTweenChain!: Phaser.Tweens.TweenChain;

  constructor(scene: Phaser.Scene, texture: string, dataUnit: any) {
    const { x, y } = getUnitPos(dataUnit.position, dataUnit.owner);
    super(scene, x, y);
    this.startingX = x;
    this.startingY = y;
    this.setDepth(1);
    this.id = dataUnit.id;
    this.boardPosition = dataUnit.position;
    this.dataUnit = dataUnit;
    this.unitName = dataUnit.name;
    this.stats = dataUnit.stats;
    this.equipment = dataUnit.equipment;
    this.owner = dataUnit.owner;

    this.sprite = scene.add.sprite(0, 0, texture);
    this.sprite.setScale(0.5, 0.5);
    if (dataUnit.owner === 0) {
      this.sprite.setFlipX(true);
    }

    const shadowContainer = scene.add.container();
    const shadowColor = 0x000000;
    const shadowAlpha = 0.4;
    const shadowWidth = 65;
    const shadowHeight = 25;
    const shadowCircle = scene.add.graphics();
    shadowCircle.fillStyle(shadowColor, shadowAlpha);
    shadowCircle.fillEllipse(0, 0, shadowWidth, shadowHeight);
    shadowContainer.add(shadowCircle);
    shadowContainer.setPosition(this.sprite.x, this.sprite.y + 50);
    this.add(shadowContainer);
    this.add(this.sprite);

    // idle animation, tween scale
    scene.tweens.add({
      targets: this.sprite,
      scaleY: this.sprite.scaleY * 0.995,
      scaleX: this.sprite.scaleX * 0.97,
      ease: Phaser.Math.Easing.Sine.InOut,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

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
      console.log("has died event");
      this.onDeath();
    }

    if (event.type === "ATTACK") {
      if (!target) {
        throw new Error("Attack target is undefined");
      }

      const onFinishAnimation = () => {
        if (onEnd) onEnd();
        this.fillApBar(event.payload.currentAp);
        this.fillSpBar(event.payload.sp);
      };

      const { attackTweenChain } = createAttackAnimation({
        unit: this,
        target,
        onFinishAnimation,
      });

      this.attackTweenChain = attackTweenChain;
    }

    if (event.type === "RECEIVED_DAMAGE") {
      onReceiveDamage(this, event);
      // temporary
      if (event.payload.sp < 1000) {
        this.fillSpBar(event.payload.sp);
      }
    }

    if (event.type === "CAST_SKILL") {
      this.fillSpBar(0);
    }

    // todo: combine logic of receive damage and heal
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
        x: Phaser.Math.Between(-15, 15),
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

  public fillApBar(currentAp: number, fromResume?: boolean) {
    const stepsToAttackFromZeroAP = Math.ceil(1000 / this.stats.attackSpeed);

    const willNeedOneLessStep = (stepsToAttackFromZeroAP - 1) * this.stats.attackSpeed + currentAp >= 1000;

    const stepsToAttack = stepsToAttackFromZeroAP - (willNeedOneLessStep ? 1 : 0);

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

  public fillSpBar(currentSp: number) {
    const newSpBarWidth = Math.min((currentSp * BAR_WIDTH) / 1000, BAR_WIDTH);

    this.spBar.width = newSpBarWidth;

    /* this.spBarTween = this.scene.tweens.add({
      targets: this.spBar,
      width: newSpBarWidth,
      duration: 50,
      ease: "Linear",
      onComplete: () => {
        this.spBarTween = null as any;
      },
    }); */
  }

  public onStart() {
    this.fillApBar(0);
  }

  public resumeAnimations() {
    if (this.attackTweenChain?.isPaused()) {
      this.attackTweenChain.resume();
    }
  }
  public pauseAnimations() {
    if (this.attackTweenChain?.isPlaying()) {
      this.attackTweenChain.pause();
    }
  }
  public resumeApBar() {
    if (this.apBarTween && this.apBarTween.isPaused()) {
      this.apBarTween.resume();
    }
  }

  public pauseApBar() {
    if (this.apBarTween && this.apBarTween.isPlaying()) {
      this.apBarTween.pause();
    }
  }

  private onDeath() {
    console.log("onDeath");

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
        console.log("onComplete");
        this.setVisible(false);
        this.isDead = true;
      },
    });
  }
}
