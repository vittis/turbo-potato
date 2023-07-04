import { BattleUnit } from "./BattleUnit";
import { BAR_WIDTH } from "./BattleUnitSetup";

export function onReceiveDamage(unit: BattleUnit, event: any) {
  const newHp = Math.max(0, event.payload.hp);
  const newArmorHp = Math.max(0, event.payload.armorHp);

  const hasTakenHpDamage = newHp < unit.stats.hp;
  const hasTakenArmorDamage = newArmorHp < unit.stats.armorHp;

  const textTargets = [] as Phaser.GameObjects.Text[];
  if (hasTakenArmorDamage) {
    textTargets.push(unit.armorText);
  }
  if (hasTakenHpDamage) {
    textTargets.push(unit.hpText);
  }

  unit.hpText.setText(`${newHp}`);
  unit.armorText.setText(`${newArmorHp}`);

  if (newArmorHp === 0) {
    unit.armorText.alpha = 0;
  }
  if (newHp === 0) {
    unit.hpText.alpha = 0;
    unit.hpBar.alpha = 0;
    unit.armorBar.alpha = 0;
    unit.spBar.alpha = 0;
    unit.apBar.alpha = 0;
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

  // todo: revisit this later: pushback is now on Attack animation instead of onReceiveDamage
  // pushback
  /* unit.scene.tweens.add({
    targets: unit,
    x: unit.owner === 0 ? unit.x - 15 : unit.x + 15,
    duration: 150,
    yoyo: true,
    ease: Phaser.Math.Easing.Bounce.InOut,
  }); */
  /* if (!unit.isSelected) {
    unit.sprite.setTint(0xde3c45);
  }
  unit.scene.time.addEvent({
    delay: 250,
    callback: () => {
      if (!unit.isSelected) {
        unit.sprite.clearTint();
      }
    },
  }); */

  const minDamage = 0;
  const maxDamage = 75;
  const minFontSize = 25;
  const maxFontSize = 70;

  const damage = event.payload.damage;
  const fontSize =
    ((damage - minDamage) / (maxDamage - minDamage)) *
      (maxFontSize - minFontSize) +
    minFontSize;
  const fontSizePx = `${fontSize.toFixed(0)}px`;

  const damageText = unit.scene.add.text(
    0,
    30,
    "-" + event.payload.damage.toString(),
    {
      /* fontSize:
        event.payload.damage > 50
          ? `${40 + Phaser.Math.Between(0, 15)}px`
          : `${25 + Phaser.Math.Between(3, 12)}px`, */
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
    }
  );
  damageText.setOrigin(0.5);

  // damage text going up
  unit.scene.tweens.add({
    targets: damageText,
    x: Phaser.Math.Between(-15, 15),
    y: damageText.y - 38 - Phaser.Math.Between(0, 10),
    alpha: 0,
    duration: event.payload.damage > 50 ? 1900 : 1200,
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

  const newArmorHpValue = (newArmorHp / unit.stats.maxArmorHp) * BAR_WIDTH;
  unit.scene.tweens.add({
    targets: unit.armorBar,
    width: newArmorHpValue <= 0 ? 0 : newArmorHpValue,
    duration: 80,
    ease: "Linear",
  });
}
