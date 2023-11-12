import { BattleUnit } from "./BattleUnit";
import { BAR_WIDTH } from "./BattleUnitSetup";

export function onReceiveDamage(unit: BattleUnit, event: any) {
  const damageReceived = event.payload.payload.value;

  const newHp = Math.max(0, unit.stats.hp - damageReceived);
  const newShield = Math.max(0, 0);

  const hasTakenHpDamage = newHp < unit.stats.hp;
  const hasTakenShieldDamage = newShield < unit.stats.shield;

  const textTargets = [] as Phaser.GameObjects.Text[];
  if (hasTakenShieldDamage) {
    textTargets.push(unit.shieldText);
  }
  if (hasTakenHpDamage) {
    textTargets.push(unit.hpText);
  }

  unit.hpText.setText(`${newHp}`);
  unit.shieldText.setText(`${newShield}`);

  if (newShield === 0) {
    unit.shieldText.alpha = 0;
  }
  if (newHp === 0) {
    unit.hpText.alpha = 0;
    unit.hpBar.alpha = 0;
    unit.shieldBar.alpha = 0;
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

  const damageText = unit.scene.add.text(0, 30, "-" + damage, {
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

  // damage text going up
  unit.scene.tweens.add({
    targets: damageText,
    x: Phaser.Math.Between(-15, 15),
    y: damageText.y - 38 - Phaser.Math.Between(0, 10),
    alpha: 0,
    duration: damage > 50 ? 1900 : 1200,
    ease: "Linear",
    onComplete: () => {
      damageText.destroy();
    },
  });

  unit.add(damageText);

  const newHpBarValue = (newHp / unit.stats.maxHp) * BAR_WIDTH;
  unit.scene.tweens.add({
    targets: unit.hpBar,
    width: newHpBarValue <= 0 ? 0 : newHpBarValue,
    duration: 80,
    ease: "Linear",
  });

  const newShieldValue = (newShield / unit.stats.maxHp) * BAR_WIDTH;
  unit.scene.tweens.add({
    targets: unit.shieldBar,
    width: newShieldValue <= 0 ? 0 : newShieldValue,
    duration: 80,
    ease: "Linear",
  });

  unit.stats = { ...unit.stats, hp: newHp }; //todo better stat tracking
}
