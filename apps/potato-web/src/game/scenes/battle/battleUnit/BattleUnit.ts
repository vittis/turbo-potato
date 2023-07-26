import Phaser from "phaser";
import { GAME_LOOP_SPEED, StepEvent, SubStepEvent } from "../BattleScene";
import { BAR_WIDTH, createBars, createTexts, getUnitPos, setupUnitPointerEvents } from "./BattleUnitSetup";
import { onReceiveDamage } from "./BattleUnitEventHandler";
import {
  createAttackAnimation,
  createHeadCrushAnimation,
  createHealingWordAnimation,
  createPowershotAnimation,
} from "./BattleUnitAnimations";
import { BattleUnitSprite } from "./BattleUnitSprite";

export class BattleUnit extends Phaser.GameObjects.Container {
  public id: string;
  public sprite!: BattleUnitSprite;
  public hpBar: Phaser.GameObjects.Rectangle;
  public shieldBar: Phaser.GameObjects.Rectangle;
  public apBar: Phaser.GameObjects.Rectangle;
  public spBar: Phaser.GameObjects.Rectangle;
  public boardPosition: number;
  public owner: number;
  public hpText: Phaser.GameObjects.Text;
  public shieldText: Phaser.GameObjects.Text;

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
  public currentAnimation!: Phaser.Tweens.TweenChain;

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

    /* this.sprite = scene.add.sprite(0, 0, texture); */
    // this.sprite.setScale(0.5, 0.5);
    /* if (dataUnit.owner === 0) {
      this.sprite.setFlipX(true);
    }
 */
    // const quadrado = scene.add.sprite(x, y, "cleric");
    // this.add(quadrado);
    this.sprite = new BattleUnitSprite(scene, x, y, dataUnit);

    if (dataUnit.owner === 0) {
      this.sprite.flipSpritesInContainer();
    }
    this.sprite.setScale(0.79);

    const spriteOffsetX = this.owner === 0 ? -4 : 4;

    const shadowContainer = scene.add.container();
    const shadowColor = 0x000000;
    const shadowAlpha = 0.4;
    const shadowWidth = 65;
    const shadowHeight = 25;
    const shadowCircle = scene.add.graphics();
    shadowCircle.fillStyle(shadowColor, shadowAlpha);
    shadowCircle.fillEllipse(0, 0, shadowWidth, shadowHeight);
    shadowContainer.add(shadowCircle);
    shadowContainer.setPosition(this.sprite.x + spriteOffsetX, this.sprite.y + 63);
    this.add(shadowContainer);
    this.add(this.sprite);
    //this.add(this.sprite);

    // idle animation, tween scale
    /* scene.tweens.add({
      targets: this.sprite,
      scaleY: this.sprite.scaleY * 0.995,
      scaleX: this.sprite.scaleX * 0.97,
      ease: Phaser.Math.Easing.Sine.InOut,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    }); */

    setupUnitPointerEvents(this);

    const { hpBar, shieldBar, apBar, spBar } = createBars(this);
    this.hpBar = hpBar;
    this.shieldBar = shieldBar;
    this.apBar = apBar;
    this.spBar = spBar;

    const { hpText, shieldText } = createTexts(this, hpBar.x, hpBar.y);
    this.hpText = hpText;
    this.shieldText = shieldText;
    this.hpText.setText(`${Math.max(0, dataUnit.stats.hp)}`);
    this.shieldText.setText(`${Math.max(0, dataUnit.stats.shield)}`);

    scene.add.existing(this);
  }

  public onSelected() {
    this.isSelected = true;
  }

  public onDeselected() {
    this.isSelected = false;
  }

  public playEvent({
    event,
    targets,
    onEnd,
  }: {
    event: StepEvent;
    targets?: BattleUnit[];
    onEnd?: Function;
    onAttack?: Function;
  }) {
    if (event.type === "HAS_DIED") {
      console.log("has died event");
      this.onDeath();
    }

    if (event.type === "ATTACK") {
      const target = targets?.[0];

      if (!target) {
        throw new Error("Attack target is undefined");
      }

      const onFinishAnimation = () => {
        this.fillApBar(event.payload.stats.ap);
        if (onEnd) onEnd();
      };
      const onImpactPoint = () => {
        const receiveDamageEvent = event.subEvents?.find((e) => e.type === "RECEIVED_DAMAGE") as StepEvent;
        this.fillSpBar(event.payload.stats.sp);
        target.playEvent({ event: receiveDamageEvent });
      };

      const { attackTweenChain } = createAttackAnimation({
        unit: this,
        target,
        onImpactPoint,
        onFinishAnimation,
      });

      this.currentAnimation = attackTweenChain;
    }

    if (event.type === "RECEIVED_DAMAGE") {
      onReceiveDamage(this, event);
      // temporary

      this.fillSpBar(Math.min(event.payload.stats.sp, 1000));
    }

    if (event.type === "CAST_SKILL") {
      if (event.payload.skillName === "Healing Word") {
        const target = targets?.[0];

        const onFinishAnimation = () => {
          if (onEnd) onEnd();
        };
        const onImpactPoint = () => {
          this.fillSpBar(0);
          const receiveHealEvent = event.subEvents?.find((e) => e.type === "RECEIVED_HEAL") as StepEvent;
          target?.playEvent({ event: receiveHealEvent });
        };

        const { healingWordTween } = createHealingWordAnimation({
          unit: this,
          onImpactPoint,
          onFinishAnimation,
        });

        this.currentAnimation = healingWordTween;
      }

      if (event.payload.skillName === "Powershot") {
        const target = targets?.[0];

        if (!target) {
          throw new Error("Attack target is undefined");
        }

        const onFinishAnimation = () => {
          if (onEnd) onEnd();
        };
        const onImpactPoint = () => {
          this.fillSpBar(0);
          const receiveDamageEvents = targets?.map(
            (target) =>
              event.subEvents?.find((e) => e.type === "RECEIVED_DAMAGE" && e.actorId === target.id) as StepEvent
          );

          if (receiveDamageEvents) {
            receiveDamageEvents.forEach((e) => {
              const target = targets?.find((target) => target.id === e.actorId);
              if (target) target.playEvent({ event: e });
            });
          }
        };

        const { powershotAnimation } = createPowershotAnimation({
          unit: this,
          target,
          onImpactPoint,
          onFinishAnimation,
        });

        this.currentAnimation = powershotAnimation;
      }

      if (event.payload.skillName === "Head Crush") {
        const target = targets?.[0];

        if (!target) {
          throw new Error("Attack target is undefined");
        }

        const onFinishAnimation = () => {
          if (onEnd) onEnd();
        };
        const onImpactPoint = () => {
          this.fillSpBar(0);
          const receiveDamageEvent = event.subEvents?.find((e) => e.type === "RECEIVED_DAMAGE") as StepEvent;
          target?.playEvent({ event: receiveDamageEvent });
        };

        const { headCrushAnimation } = createHeadCrushAnimation({
          unit: this,
          target,
          onImpactPoint,
          onFinishAnimation,
        });

        this.currentAnimation = headCrushAnimation;
      }

      this.fillSpBar(0);
    }

    // todo: combine logic of receive damage and heal
    if (event.type === "RECEIVED_HEAL") {
      const newHp = event.payload.stats.hp;
      const hpHealed = event.payload.modifiers.hp;
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
        // this.sprite.setTint(0x1dad2e);
      }

      this.scene.time.addEvent({
        delay: 150,
        callback: () => {
          if (!this.isSelected) {
            // this.sprite.clearTint();
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
    if (this.currentAnimation?.isPaused()) {
      this.currentAnimation.resume();
    }
  }
  public pauseAnimations() {
    if (this.currentAnimation?.isPlaying()) {
      this.currentAnimation.pause();
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
