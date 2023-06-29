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

  // pushback
  unit.scene.tweens.add({
    targets: unit,
    x: unit.owner === 0 ? unit.x - 10 : unit.x + 10,
    duration: 150,
    yoyo: true,
    ease: "Bounce.easeOut",
  });

  if (!unit.isSelected) {
    unit.sprite.setTint(0xde3c45);
  }

  unit.scene.time.addEvent({
    delay: 250,
    callback: () => {
      if (!unit.isSelected) {
        unit.sprite.clearTint();
      }
    },
  });

  const damageText = unit.scene.add.text(
    0,
    30,
    "-" + event.payload.damage.toString(),
    {
      fontSize: event.payload.damage > 50 ? "40px" : "30px",
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

  unit.scene.tweens.add({
    targets: damageText,
    y: damageText.y - 40,
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
