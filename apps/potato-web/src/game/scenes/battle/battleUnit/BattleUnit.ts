import Phaser from "phaser";
import { StepEvent } from "../BattleScene";
import { getUnitPos, setupUnitPointerEvents } from "./BattleUnitSetup";
import {
  createAttackAnimation,
  createDeathAnimation,
  createTriggerEffectAnimation,
  createWiggleAnimation,
} from "./BattleUnitAnimations";
import { BattleUnitSprite } from "./BattleUnitSprite";
import { Ability, BattleUnitAbilities } from "./BattleUnitAbilities";
import { BattleUnitStatusEffects } from "./BattleUnitStatusEffects";
import { BattleUnitBars } from "./BattleUnitBars";

export class BattleUnit extends Phaser.GameObjects.Container {
  public id: string;
  public battleUnitSprite!: BattleUnitSprite;
  public sprite!: Phaser.GameObjects.Image;
  public boardPosition: number;
  public owner: number;

  public stats: any;
  public equipment: any;
  public unitName: string;

  public dataUnit: any;

  public isSelected = false;
  public spBarTween!: Phaser.Tweens.Tween;

  public abilitiesManager: BattleUnitAbilities;
  public statusEffectsManager: BattleUnitStatusEffects;
  public barsManager: BattleUnitBars;

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

    this.glow = this.sprite.preFX?.addGlow(0xeeee00, 4);
    this.glow?.setActive(false);

    this.add(this.sprite);

    createWiggleAnimation(this);

    this.abilitiesManager = new BattleUnitAbilities(this, scene, dataUnit);
    this.add(this.abilitiesManager);

    this.statusEffectsManager = new BattleUnitStatusEffects(scene, dataUnit);
    this.add(this.statusEffectsManager);

    this.barsManager = new BattleUnitBars(this, scene, dataUnit);
    this.add(this.barsManager);

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
      this.barsManager.onReceiveDamage(event);
    }

    if (event.type === "INSTANT_EFFECT" && event.payload.type === "STATUS_EFFECT") {
      event.payload.payload.forEach((statusEffect) => {
        if (statusEffect.quantity < 0) {
          this.statusEffectsManager.removeStatusEffect({
            name: statusEffect.name,
            quantity: statusEffect.quantity * -1,
          });
        } else {
          this.statusEffectsManager.addStatusEffect({ name: statusEffect.name, quantity: statusEffect.quantity });
        }
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
}
