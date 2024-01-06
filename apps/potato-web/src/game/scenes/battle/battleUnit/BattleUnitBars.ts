import { BattleUnit } from "./BattleUnit";

export const BAR_WIDTH = 45;

export interface Bar {
  container: Phaser.GameObjects.Container;
  bar: Phaser.GameObjects.Rectangle;
  border?: Phaser.GameObjects.Rectangle;
  text: Phaser.GameObjects.Text;
}

export class BattleUnitBars extends Phaser.GameObjects.Container {
  public hp: Bar;
  //public shield: Bar;

  public battleUnit: BattleUnit;
  public dataUnit: any;

  constructor(battleUnit: BattleUnit, scene: Phaser.Scene, dataUnit: any) {
    super(scene);

    this.battleUnit = battleUnit;
    this.dataUnit = dataUnit;

    this.hp = this.createBar(battleUnit, dataUnit);
  }

  createBar(unit: BattleUnit, dataUnit: any) {
    const spriteOffsetX = unit.owner === 0 ? -4 : 4;

    const width = BAR_WIDTH;
    const height = 7;
    const borderWidth = 3;
    const yOffset = 50 + 10 + 10;

    const hpContainer = this.scene.add.container(0, 0);

    const hpBar = new Phaser.GameObjects.Rectangle(
      unit.scene,
      unit.sprite.x + borderWidth / 2 - width / 2 + spriteOffsetX,
      unit.sprite.y + yOffset + borderWidth / 2,
      width,
      height,
      0xde3c45
    );

    const hpBorder = new Phaser.GameObjects.Rectangle(
      unit.scene,
      unit.sprite.x - width / 2 + spriteOffsetX,
      unit.sprite.y + yOffset,
      width + borderWidth,
      height + borderWidth,
      0x232422,
      0.75
    );

    hpBorder.setStrokeStyle(borderWidth, 0x390908, 1);

    hpBar.setOrigin(0);
    hpBar.setDepth(1);
    hpBorder.setOrigin(0);
    hpBorder.setDepth(1);

    const hpText = unit.scene.add.text(hpBar.x + 12, hpBar.y + 55, dataUnit.stats.maxHp, {
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

    hpText.setOrigin(0.5);

    hpContainer.add(hpBorder);
    hpContainer.add(hpBar);
    hpContainer.add(hpText);

    unit.add(hpContainer);

    return {
      container: hpContainer,
      bar: hpBar,
      border: hpBorder,
      text: hpText,
      damageText: undefined,
    };
  }

  onReceiveDamage(unit: BattleUnit, event: any) {
    const damageReceived = event.payload.payload.value;

    const newHp = Math.max(0, unit.stats.hp - damageReceived);

    const hasTakenHpDamage = newHp < unit.stats.hp;

    console.log({ newHp, hasTakenHpDamage });

    const textTargets = [] as Phaser.GameObjects.Text[];

    if (hasTakenHpDamage) {
      textTargets.push(this.hp.text);
    }

    this.hp.text.setText(`${newHp}`);

    if (newHp === 0) {
      //this.hp.text.alpha = 0;
      this.hp.bar.alpha = 0;
    }

    // hp and armor text POP animation
    unit.scene.tweens.add({
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
    const fontSize = ((damage - minDamage) / (maxDamage - minDamage)) * (maxFontSize - minFontSize) + minFontSize;
    const fontSizePx = `${fontSize.toFixed(0)}px`;

    const damageText = this.scene.add.text(0, 30, "-" + damage, {
      fontSize: fontSizePx,
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
    });

    damageText.setOrigin(0.5);

    this.hp.container.add(damageText);

    // damage text going up
    unit.scene.tweens.add({
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

    const newHpBarValue = (newHp / unit.stats.maxHp) * BAR_WIDTH;

    unit.scene.tweens.add({
      targets: this.hp.bar,
      width: newHpBarValue <= 0 ? 0 : newHpBarValue,
      duration: 80,
      ease: "Linear",
    });

    unit.stats = { ...unit.stats, hp: newHp }; //todo better stat tracking
  }
}
