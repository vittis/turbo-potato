import { BattleUnit } from "./BattleUnit";

const SHOW_TEXT = true;
const HIDE_TEXT_IF_ZERO = true;
const BAR_WIDTH = 45;

export interface Bar {
  container: Phaser.GameObjects.Container;
  bar: Phaser.GameObjects.Rectangle;
  border?: Phaser.GameObjects.Rectangle;
  text: Phaser.GameObjects.Text;
}

export class BattleUnitBars extends Phaser.GameObjects.Container {
  public hp: Bar;
  public shield: Bar;

  public unit: BattleUnit;
  public dataUnit: any;

  constructor(unit: BattleUnit, scene: Phaser.Scene, dataUnit: any) {
    super(scene);

    this.unit = unit;
    this.dataUnit = dataUnit;

    this.hp = this.createBar("HP", unit, dataUnit);
    this.shield = this.createBar("SHIELD", unit, dataUnit);

    if (!SHOW_TEXT) {
      this.hp.text.alpha = 0;
      this.shield.text.alpha = 0;
    } else if (HIDE_TEXT_IF_ZERO) {
      this.shield.text.alpha = 0;
    }
  }

  createBar(barType: "HP" | "SHIELD", unit: BattleUnit, dataUnit: any) {
    const spriteOffsetX = unit.owner === 0 ? -4 : 4;

    const width =
      barType === "HP"
        ? BAR_WIDTH
        : Math.min((dataUnit.stats.shield / dataUnit.stats.maxHp) * BAR_WIDTH, BAR_WIDTH);
    const height = 7;
    const borderWidth = 3;
    const xOffset = (BAR_WIDTH - width) / 2;
    const yOffset = 70;

    const barColor = barType === "HP" ? 0xde3c45 : 0x3b72d9;
    const borderColor = 0x232422;
    const borderStrokeColor = 0x390908;
    const textColor = barType === "HP" ? "#ff121d" : "#1236ff";

    const container = this.scene.add.container(0, 0);

    let border;

    if (barType === "HP") {
      border = new Phaser.GameObjects.Rectangle(
        unit.scene,
        unit.sprite.x - width / 2 + spriteOffsetX - xOffset,
        unit.sprite.y + yOffset,
        width + borderWidth,
        height + borderWidth,
        borderColor,
        0.75
      );

      border.setStrokeStyle(borderWidth, borderStrokeColor, 1);
      border.setOrigin(0);
      border.setDepth(1);
      container.add(border);
    }

    const bar = new Phaser.GameObjects.Rectangle(
      unit.scene,
      unit.sprite.x + borderWidth / 2 - width / 2 + spriteOffsetX - xOffset,
      unit.sprite.y + yOffset + borderWidth / 2,
      width,
      height,
      barColor
    );

    bar.setOrigin(0);
    bar.setDepth(1);
    container.add(bar);

    const textHpOffsetX = unit.owner === 0 ? 64 : -20;
    const textShieldOffsetX = unit.owner === 0 ? -20 : 64;

    const text = unit.scene.add.text(
      barType === "HP" ? bar.x + textHpOffsetX : bar.x + textShieldOffsetX,
      bar.y,
      barType === "HP" ? dataUnit.stats.maxHp : dataUnit.stats.shield,
      {
        fontSize: "18px",
        color: textColor,
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
      }
    );

    text.setOrigin(0.5);
    container.add(text);

    unit.add(container);

    return {
      container,
      bar,
      border,
      text,
      damageText: undefined,
    };
  }

  onReceiveDamage(event: any) {
    const damageTextColor = "#ff121d";

    const damageReceived = event.payload.payload.value;

    let newHp = this.unit.stats.hp;
    let newShield = this.unit.stats.shield;

    if (newShield > 0) {
      newShield -= damageReceived;
      if (newShield < 0) {
        newHp += newShield;
        newShield = 0;
      }
    } else {
      newHp = Math.max(newHp - damageReceived, 0);
    }

    const hasTakenShieldDamage = newShield < this.unit.stats.shield;
    const hasTakenHpDamage = newHp < this.unit.stats.hp;

    const textTargets = [] as Phaser.GameObjects.Text[];

    if (hasTakenShieldDamage) {
      textTargets.push(this.shield.text);
      this.shield.text.setText(`${newShield}`);

      if (newShield === 0) {
        this.shield.bar.alpha = 0;
      } else {
        const newShieldBarValue = Math.min(
          (newShield / this.unit.stats.maxHp) * BAR_WIDTH,
          BAR_WIDTH
        );

        this.unit.scene.tweens.add({
          targets: this.shield.bar,
          width: newShieldBarValue <= 0 ? 0 : newShieldBarValue,
          duration: 80,
          ease: "Linear",
        });
      }
    }

    if (hasTakenHpDamage) {
      textTargets.push(this.hp.text);
      this.hp.text.setText(`${newHp}`);

      if (newHp === 0) {
        this.hp.bar.alpha = 0;
      } else {
        const newHpBarValue = (newHp / this.unit.stats.maxHp) * BAR_WIDTH;

        this.unit.scene.tweens.add({
          targets: this.hp.bar,
          width: newHpBarValue <= 0 ? 0 : newHpBarValue,
          duration: 80,
          ease: "Linear",
        });
      }
    }

    // hp and shield text POP animation
    this.unit.scene.tweens.add({
      targets: textTargets,
      scaleX: 1.25,
      scaleY: 1.25,
      duration: 150,
      ease: "Bounce.easeOut",
      yoyo: true,
    });

    const minDamage = 0;
    const maxDamage = 75;
    const minFontSize = 25;
    const maxFontSize = 70;

    const damage = damageReceived;
    const fontSize =
      ((damage - minDamage) / (maxDamage - minDamage)) * (maxFontSize - minFontSize) + minFontSize;
    const fontSizePx = `${fontSize.toFixed(0)}px`;

    const damageText = this.scene.add.text(0, 30, "-" + damage, {
      fontSize: fontSizePx,
      color: damageTextColor,
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

    damageText.setOrigin(0.5);

    this.hp.container.add(damageText);

    // damage text going up
    this.unit.scene.tweens.add({
      targets: damageText,
      x: Phaser.Math.Between(-15, 15),
      y: damageText.y - 38 - Phaser.Math.Between(0, 10),
      alpha: 0,
      duration: damage > 50 ? 1900 : 1200,
      ease: "Linear",
      onComplete: () => {
        damageText?.destroy();
      },
    });

    if (HIDE_TEXT_IF_ZERO && newShield <= 0) this.shield.text.alpha = 0;

    this.unit.stats = { ...this.unit.stats, hp: newHp, shield: newShield }; //todo better stat tracking
  }

  onReceiveShield(event: any) {
    const shieldTextColor = "#155BC4";

    const shieldReceived = event.payload.payload.value;

    const newShield = this.unit.stats.shield + shieldReceived;

    this.shield.text.setText(`${newShield}`);

    const newShieldBarValue = Math.min((newShield / this.unit.stats.maxHp) * BAR_WIDTH, BAR_WIDTH);

    this.unit.scene.tweens.add({
      targets: this.shield.bar,
      width: newShieldBarValue,
      duration: 80,
      ease: "Linear",
    });

    this.unit.scene.tweens.add({
      targets: this.shield.text,
      scaleX: 1.25,
      scaleY: 1.25,
      duration: 150,
      ease: "Bounce.easeOut",
      yoyo: true,
    });

    const minShield = 0;
    const maxShield = 75;
    const minFontSize = 25;
    const maxFontSize = 70;

    const shield = shieldReceived;
    const fontSize =
      ((shield - minShield) / (maxShield - minShield)) * (maxFontSize - minFontSize) + minFontSize;
    const fontSizePx = `${fontSize.toFixed(0)}px`;

    const shieldText = this.scene.add.text(0, 30, "+" + shield, {
      fontSize: fontSizePx,
      color: shieldTextColor,
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

    shieldText.setOrigin(0.5);

    this.shield.container.add(shieldText);

    // shield text going up
    this.unit.scene.tweens.add({
      targets: shieldText,
      x: Phaser.Math.Between(-15, 15),
      y: shieldText.y - 38 - Phaser.Math.Between(0, 10),
      alpha: 0,
      duration: shield > 50 ? 1900 : 1200,
      ease: "Linear",
      onComplete: () => {
        shieldText?.destroy();
      },
    });

    if (this.unit.stats.shield === 0 && SHOW_TEXT) this.shield.bar.alpha = 1;

    this.unit.stats = { ...this.unit.stats, shield: newShield }; //todo better stat tracking
  }

  onReceiveHeal(event: any) {
    const healTextColor = "#1BB623";

    const healReceived = Math.min(
      event.payload.payload.value,
      this.unit.stats.maxHp - this.unit.stats.hp
    );

    const newHp = Math.min(this.unit.stats.hp + healReceived, this.unit.stats.maxHp);

    this.hp.text.setText(`${newHp}`);

    const newHpBarValue = Math.min((newHp / this.unit.stats.maxHp) * BAR_WIDTH, BAR_WIDTH);

    this.unit.scene.tweens.add({
      targets: this.hp.bar,
      width: newHpBarValue,
      duration: 80,
      ease: "Linear",
    });

    this.unit.scene.tweens.add({
      targets: this.hp.text,
      scaleX: 1.25,
      scaleY: 1.25,
      duration: 150,
      ease: "Bounce.easeOut",
      yoyo: true,
    });

    const minHeal = 0;
    const maxHeal = 75;
    const minFontSize = 25;
    const maxFontSize = 70;

    const heal = healReceived;
    const fontSize =
      ((heal - minHeal) / (maxHeal - minHeal)) * (maxFontSize - minFontSize) + minFontSize;
    const fontSizePx = `${fontSize.toFixed(0)}px`;

    const healText = this.scene.add.text(0, 30, "+" + heal, {
      fontSize: fontSizePx,
      color: healTextColor,
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

    this.hp.container.add(healText);

    // heal text going up
    this.unit.scene.tweens.add({
      targets: healText,
      x: Phaser.Math.Between(-15, 15),
      y: healText.y - 38 - Phaser.Math.Between(0, 10),
      alpha: 0,
      duration: heal > 50 ? 1900 : 1200,
      ease: "Linear",
      onComplete: () => {
        healText?.destroy();
      },
    });

    this.unit.stats = { ...this.unit.stats, hp: newHp }; //todo better stat tracking
  }
}
