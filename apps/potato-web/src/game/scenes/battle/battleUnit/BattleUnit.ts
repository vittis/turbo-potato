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
  createWiggleAnimation,
} from "./BattleUnitAnimations";
import { BattleUnitSprite } from "./BattleUnitSprite";

interface Ability {
  name: string;
  container: Phaser.GameObjects.Container;
  icon: Phaser.GameObjects.Image;
  overlay: Phaser.GameObjects.Image;
  tween: Phaser.Tweens.Tween;
  border: Phaser.GameObjects.Image;
  shineFX: Phaser.FX.Shine | undefined;
}

export class BattleUnit extends Phaser.GameObjects.Container {
  public id: string;
  public battleUnitSprite!: BattleUnitSprite;
  public sprite!: Phaser.GameObjects.Image;
  public hpBar: Phaser.GameObjects.Rectangle;
  public shieldBar: Phaser.GameObjects.Rectangle;
  /* public apBar: Phaser.GameObjects.Rectangle;
  public spBar: Phaser.GameObjects.Rectangle; */
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

  public abilities = [] as Ability[];

  public isDead = false;
  public startingX;
  public startingY: number;
  public currentAnimation!: Phaser.Tweens.TweenChain | Phaser.Tweens.Tween;

  public glow: Phaser.FX.Glow | undefined;

  constructor(scene: Phaser.Scene, dataUnit: any) {
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
    /* this.apBar = apBar;
    this.spBar = spBar; */

    const { hpText, shieldText } = createTexts(this, hpBar.x, hpBar.y);
    this.hpText = hpText;
    this.shieldText = shieldText;
    this.hpText.setText(`${Math.max(0, dataUnit.stats.hp)}`);
    this.shieldText.setText(`${Math.max(0, dataUnit.stats.shield)}`);

    this.glow = this.sprite.preFX?.addGlow(0xeeee00, 4);
    this.glow?.setActive(false);

    this.add(this.sprite);

    createWiggleAnimation(this);

    this.abilities = dataUnit.abilities.map((ability: any, index: number) => {
      const abilityContainer = scene.add.container(0, 0);

      const icon = scene.add.image(0, 0, ability.data.name.toLowerCase().replace(/\s/g, "_"));

      const shineFX = icon.preFX?.addShine(2);
      shineFX?.setActive(false);

      abilityContainer.add(icon);

      const borderGraphics = scene.add.graphics();
      borderGraphics.lineStyle(3, 0xffffff); // You can customize the color and thickness of the border
      borderGraphics.strokeRoundedRect(0, 0, icon.width + 4, icon.height + 4, 8);
      borderGraphics.generateTexture("border_texture", icon.width + 4, icon.height + 4);
      borderGraphics.destroy();

      const iconBorder = scene.add.image(0, 0, "border_texture");
      iconBorder.setTint(0x232422);
      abilityContainer.add(iconBorder);

      const background = scene.add.graphics();
      background.fillStyle(0x1f1f1f, 1);
      background.fillRect(0, 0, 32, 32);
      background.generateTexture("ability_overlay", icon.width, icon.height);
      background.destroy();

      const overlay = scene.add
        .image((icon.width / 2) * -1, icon.height / 2, "ability_overlay")
        .setTint(0x000000)
        .setAlpha(0);
      overlay.setOrigin(0, 1);

      abilityContainer.add(overlay);
      abilityContainer.setDepth(1);
      abilityContainer.setPosition((icon.width + 10) * index, 102);

      this.add(abilityContainer);

      return {
        name: ability.data.name,
        icon,
        overlay,
        container: abilityContainer,
        border: iconBorder,
        shineFX,
      };
    });

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
  }: {
    event: StepEvent;
    targets?: BattleUnit[];
    onEnd?: Function;
    onAttack?: Function;
    onStart?: Function;
  }) {
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

    if (event.type === "USE_ABILITY") {
      const abilityUsed = this.abilities.find((ability) => ability.name === event.payload.name) as Ability;

      const target = targets?.[0];
      if (!target) {
        throw new Error("Attack target is undefined");
      }

      const onStartAnimation = () => {
        // this.glow?.setActive(true);
        this.highlightAbility(abilityUsed);
        this.unhighlightAbilities({ exclude: [abilityUsed] });
        if (onStart) onStart();
      };

      const onFinishAnimation = () => {
        // this.glow?.setActive(false);
        abilityUsed?.overlay?.setAlpha(0.6);
        this.restoreAbilities();
        if (onEnd) onEnd();
      };
      const onImpactPoint = () => {
        const receiveDamageEvent = event.payload.subEvents?.find(
          (e) => e.type === "INSTANT_EFFECT" && e.payload.type === "DAMAGE"
        ) as StepEvent;
        if (receiveDamageEvent) {
          target.playEvent({ event: receiveDamageEvent });
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

  public highlightAbility(abilityUsed: Ability) {
    if (!abilityUsed) return;
    abilityUsed.shineFX?.setActive(true);
    abilityUsed.overlay.setAlpha(0);
    this.scene.tweens.add({
      targets: abilityUsed?.container,
      scale: 1.2,
      duration: 200,
      ease: "Bounce.easeOut",
    });
  }

  public unhighlightAbilities({ exclude }: { exclude?: Ability[] } = {}) {
    this.abilities.forEach((ability) => {
      if (exclude?.includes(ability)) return;
      this.scene.tweens.add({
        targets: ability?.container,
        scale: 0.7,
        duration: 200,
        ease: "Bounce.easeOut",
      });
    });
  }

  public restoreAbilities() {
    this.abilities.forEach((ability) => {
      ability?.shineFX?.setActive(false);
      this.scene.tweens.add({
        targets: ability?.container,
        scale: 1,
        duration: 200,
        ease: "Bounce.easeOut",
      });
    });
  }

  public createAbilityOverlayTween() {
    this.abilities.forEach((ability, index: number) => {
      ability.overlay.setAlpha(0.6);

      ability.tween = this.scene.tweens.add({
        targets: ability.overlay,
        scaleY: { from: 1, to: 0 },
        duration: GAME_LOOP_SPEED * this.dataUnit.abilities[index].cooldown,
        ease: "Linear",
        repeat: -1,
      });
    });
  }

  public onStart() {
    this.createAbilityOverlayTween();
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
  public resumeSkillCooldown() {
    this.abilities.forEach((ability) => {
      if (ability.tween && ability.tween.isPaused()) {
        ability.tween.resume();
      }
    });
  }

  public pauseSkillCooldown() {
    this.abilities.forEach((ability) => {
      if (ability.tween && ability.tween.isPlaying()) {
        ability.tween.pause();
      }
    });
  }
}
