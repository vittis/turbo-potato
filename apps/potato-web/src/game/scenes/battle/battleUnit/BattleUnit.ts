import Phaser from "phaser";
import { GAME_LOOP_SPEED, StepEvent } from "../BattleScene";
import { BAR_WIDTH, createBars, createTexts, getUnitPos, setupUnitPointerEvents } from "./BattleUnitSetup";
import { onReceiveDamage } from "./BattleUnitEventHandler";
import {
  createAttackAnimation,
  createDeathAnimation,
  createHeadCrushAnimation,
  createHealingWordAnimation,
  createPowershotAnimation,
  createTriggerEffectAnimation,
  createWiggleAnimation,
} from "./BattleUnitAnimations";
import { BattleUnitSprite } from "./BattleUnitSprite";
import { Ability, BattleUnitAbilities } from "./BattleUnitAbilities";

interface StatusEffect {
  name: string;
  quantity: number;
  container: Phaser.GameObjects.Container;
  icon: Phaser.GameObjects.Image;
  text: Phaser.GameObjects.Text;
}

export class BattleUnit extends Phaser.GameObjects.Container {
  public id: string;
  public battleUnitSprite!: BattleUnitSprite;
  public sprite!: Phaser.GameObjects.Image;
  public hpBar: Phaser.GameObjects.Rectangle;
  public shieldBar: Phaser.GameObjects.Rectangle;
  public boardPosition: number;
  public owner: number;
  public hpText: Phaser.GameObjects.Text;
  public shieldText: Phaser.GameObjects.Text;

  public stats: any;
  public equipment: any;
  public unitName: string;

  public dataUnit: any;

  public isSelected = false;
  public spBarTween!: Phaser.Tweens.Tween;

  public abilitiesManager: BattleUnitAbilities;

  public statusEffects = [] as StatusEffect[];

  public isDead = false;
  public startingX;
  public startingY: number;
  public currentAnimation!: Phaser.Tweens.TweenChain | Phaser.Tweens.Tween;

  public glow: Phaser.FX.Glow | undefined;

  constructor(scene: Phaser.Scene, dataUnit: any) {
    const { x, y } = getUnitPos(dataUnit.position, dataUnit.owner, scene["tiles"]);

    super(scene, x, y);

    this.startingX = x;
    this.startingY = y;
    this.setDepth(1);
    this.id = dataUnit.id;
    this.boardPosition = dataUnit.position;
    this.dataUnit = dataUnit;
    this.unitName = dataUnit.name;
    this.stats = dataUnit.stats;
    // this.equipment = dataUnit.equipment;
    this.owner = dataUnit.owner;

    this.battleUnitSprite = new BattleUnitSprite(scene, x, y, dataUnit);

    this.sprite = scene.add.image(0, 0, this.battleUnitSprite.textureName);

    if (dataUnit.owner === 0) {
      this.sprite.flipX = true;
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

    setupUnitPointerEvents(this);

    const { hpBar, shieldBar } = createBars(this);
    this.hpBar = hpBar;
    this.shieldBar = shieldBar;

    const { hpText, shieldText } = createTexts(this, hpBar.x, hpBar.y);
    this.hpText = hpText;
    this.shieldText = shieldText;
    this.hpText.setText(`${Math.max(0, dataUnit.stats.hp)}`);
    this.shieldText.setText(`${Math.max(0, dataUnit.stats.shield)}`);

    this.glow = this.sprite.preFX?.addGlow(0xeeee00, 4);
    this.glow?.setActive(false);

    this.add(this.sprite);

    createWiggleAnimation(this);

    /* this.addStatusEffect({ name: "vulnerable", quantity: 10 });
    this.removeStatusEffect({ name: "fast", quantity: 10 }); */

    this.abilitiesManager = new BattleUnitAbilities(this, scene, dataUnit);
    this.add(this.abilitiesManager);

    scene.add.existing(this);
  }

  public onSelected() {
    this.isSelected = true;
    this.glow?.setActive(true);
  }

  public onDeselected() {
    this.isSelected = false;
    this.glow?.setActive(false);
  }

  public playEvent({
    event,
    targets,
    onEnd,
    onStart,
    allUnits,
  }: {
    event: StepEvent;
    targets?: BattleUnit[];
    onEnd?: Function;
    onAttack?: Function;
    onStart?: Function;
    allUnits?: BattleUnit[];
  }) {
    console.log("playing ", event.type, event.trigger);
    if (event.type === "FAINT") {
      const onFinishAnimation = () => {
        this.setVisible(false);
        this.isDead = true;
        if (onEnd) onEnd();
      };

      const { deathTween } = createDeathAnimation({
        unit: this,
        onFinishAnimation,
      });

      this.currentAnimation = deathTween;
    }

    if (event.type === "TRIGGER_EFFECT") {
      const target = targets?.[0];
      if (!target) {
        throw new Error("Trigger Effect target is undefined");
      }

      const onImpactPoint = () => {
        const receiveDamageEvent = event.subEvents?.find(
          (e) => e.type === "INSTANT_EFFECT" && e.payload.type === "DAMAGE"
        ) as StepEvent;
        if (receiveDamageEvent) {
          target.playEvent({ event: receiveDamageEvent });
        }

        const statusEffectEvents = event.subEvents?.filter(
          (e) => e.type === "INSTANT_EFFECT" && e.payload.type === "STATUS_EFFECT"
        ) as StepEvent[];
        if (statusEffectEvents.length > 0) {
          statusEffectEvents.forEach((statusEffectEvent) => {
            const targetIds = statusEffectEvent.payload.targetsId as string[];

            targetIds.forEach((targetId) => {
              const target = allUnits?.find((unit) => unit.id === targetId);
              if (!target) {
                throw Error(`Trying to apply status effect: cCouldnt find target with id: ${targetId}`);
              }
              target.playEvent({ event: statusEffectEvent });
            });
          });
        }
      };

      const onFinishAnimation = () => {
        if (onEnd) onEnd();
      };

      const { triggerEffectTweenChain } = createTriggerEffectAnimation({
        unit: this,
        target,
        trigger: event?.trigger || "",
        onImpactPoint,
        onFinishAnimation,
      });

      this.currentAnimation = triggerEffectTweenChain;
    }

    if (event.type === "USE_ABILITY") {
      const abilityUsed = this.abilitiesManager.abilities.find((ability) => ability.id === event.payload.id) as Ability;

      const target = targets?.[0];
      if (!target) {
        throw new Error("Attack target is undefined");
      }

      const onStartAnimation = () => {
        if (onStart) onStart();
      };

      const onFinishAnimation = () => {
        abilityUsed?.overlay?.setAlpha(0.6);
        if (onEnd) onEnd();
      };

      const onImpactPoint = () => {
        const receiveDamageEvent = event.payload.subEvents?.find(
          (e) => e.type === "INSTANT_EFFECT" && e.payload.type === "DAMAGE"
        ) as StepEvent;
        if (receiveDamageEvent) {
          target.playEvent({ event: receiveDamageEvent });
        }

        const statusEffectEvents = event.payload.subEvents?.filter(
          (e) => e.type === "INSTANT_EFFECT" && e.payload.type === "STATUS_EFFECT"
        ) as StepEvent[];
        if (statusEffectEvents.length > 0) {
          statusEffectEvents.forEach((statusEffectEvent) => {
            const targetIds = statusEffectEvent.payload.targetsId as string[];

            targetIds.forEach((targetId) => {
              const target = allUnits?.find((unit) => unit.id === targetId);
              if (!target) {
                throw Error(`Trying to apply status effect: cCouldnt find target with id: ${targetId}`);
              }
              target.playEvent({ event: statusEffectEvent });
            });
          });
        }
      };

      onStartAnimation();
      const { attackTweenChain } = createAttackAnimation({
        unit: this,
        target,
        onImpactPoint,
        onFinishAnimation,
      });

      this.currentAnimation = attackTweenChain;
    }

    if (event.type === "INSTANT_EFFECT" && event.payload.type === "DAMAGE") {
      onReceiveDamage(this, event);
      // temporary

      // this.fillSpBar(Math.min(event.payload.stats.sp, 1000));
    }

    if (event.type === "INSTANT_EFFECT" && event.payload.type === "STATUS_EFFECT") {
      event.payload.payload.forEach((statusEffect) => {
        if (statusEffect.quantity < 0) {
          this.removeStatusEffect({ name: statusEffect.name, quantity: statusEffect.quantity * -1 });
        } else {
          this.addStatusEffect({ name: statusEffect.name, quantity: statusEffect.quantity });
        }
      });
    }

    if (event.type === "CAST_SKILL") {
      if (event.payload.skillName === "Healing Word") {
        const target = targets?.[0];

        const onFinishAnimation = () => {
          if (onEnd) onEnd();
        };
        const onImpactPoint = () => {
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

  public onStart() {
    this.abilitiesManager.createAbilityOverlayTween();
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

  public addStatusEffect({ name, quantity }: any) {
    const statusEffectAlreadyExists = this.statusEffects.find((statusEffect) => statusEffect.name === name);

    if (statusEffectAlreadyExists) {
      statusEffectAlreadyExists.quantity += quantity;
      statusEffectAlreadyExists.text.setText(`${statusEffectAlreadyExists.quantity}`);
      return;
    }

    const statusEffectContainer = this.scene.add.container(
      this.dataUnit.owner === 0 ? -60 : 44,
      -10 + this.statusEffects.length * 25
    );

    const statusEffect = this.scene.add.image(0, 0, name.toLowerCase().replace(/\s/g, "_"));

    statusEffect.scale = 0.3;

    statusEffectContainer.add(statusEffect);

    const statusEffectText = this.scene.add.text(10, -13, quantity, {
      fontSize: "18px",
      color: "#fff",
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

    statusEffectContainer.add(statusEffectText);

    this.add(statusEffectContainer);

    this.statusEffects.push({
      name,
      quantity,
      container: statusEffectContainer,
      icon: statusEffect,
      text: statusEffectText,
    });
  }

  public removeStatusEffect({ name, quantity }: any) {
    const statusEffectToRemove = this.statusEffects.find((statusEffect) => statusEffect.name === name);

    if (!statusEffectToRemove) return;

    statusEffectToRemove.quantity -= quantity;

    if (statusEffectToRemove.quantity <= 0) {
      statusEffectToRemove.container.destroy();
      this.statusEffects = this.statusEffects.filter((statusEffect) => statusEffect.name !== name);
      this.repositionStatusEffect();
    } else {
      statusEffectToRemove.text.setText(`${statusEffectToRemove.quantity}`);
    }
  }

  public repositionStatusEffect() {
    this.statusEffects.forEach((statusEffect, index) => {
      statusEffect.container.setPosition(this.dataUnit.owner === 0 ? -60 : 44, -10 + index * 25);
    });
  }
}
