import { GAME_LOOP_SPEED } from "../BattleScene";
import { BattleUnit } from "./BattleUnit";

const ABILITY_ICON_SIZE = 28;

export interface Ability {
  id: string;
  name: string;
  container: Phaser.GameObjects.Container;
  icon: Phaser.GameObjects.Image;
  overlay: Phaser.GameObjects.Image;
  tween: Phaser.Tweens.Tween;
  border: Phaser.GameObjects.Image;
  shineFX: Phaser.FX.Shine | undefined;
  hasUsed: boolean;
}

export class BattleUnitAbilities extends Phaser.GameObjects.Container {
  public abilities: Ability[] = [];

  public battleUnit: BattleUnit;
  public dataUnit: any;

  constructor(battleUnit: BattleUnit, scene: Phaser.Scene, dataUnit: any) {
    super(scene);

    this.battleUnit = battleUnit;
    this.dataUnit = dataUnit;

    this.abilities = dataUnit.abilities.map((ability: any) => {
      const abilityContainer = scene.add.container(0, 0);

      const texture = `ability_${ability.data.name.toLowerCase().replace(/\s/g, "_")}`;

      const icon = scene.add.image(0, 0, scene.textures.exists(texture) ? texture : "paul");
      icon.setSize(ABILITY_ICON_SIZE, ABILITY_ICON_SIZE);

      const shineFX = icon.preFX?.addShine(2);
      shineFX?.setActive(false);

      abilityContainer.add(icon);

      const borderGraphics = scene.add.graphics();
      borderGraphics.lineStyle(3, 0xffffff);
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
      abilityContainer.setPosition(0, 0);

      battleUnit.add(abilityContainer);

      return {
        id: ability.id,
        name: ability.data.name,
        icon,
        overlay,
        container: abilityContainer,
        border: iconBorder,
        shineFX,
      };
    });

    this.positionAbilities();
  }

  positionAbilities() {
    const breakRowThreshold = 4;
    const heightOffset = this.battleUnit.sprite.height / 2 + 12;
    const abilityWidth = this.abilities[0].icon.width;
    const spaceBetween = 10;

    const breakRow = this.abilities.length >= breakRowThreshold;
    const topRowAmount = breakRow ? Math.round(this.abilities.length / 2) : this.abilities.length;
    const botRowAmount = this.abilities.length - topRowAmount;

    this.abilities.forEach((ability: any, index: number) => {
      const isOnTopRow = topRowAmount - 1 >= index;
      const rowAmount = isOnTopRow ? topRowAmount : botRowAmount;
      const rowWidth = rowAmount * abilityWidth + (rowAmount - 1) * spaceBetween;

      const x =
        (isOnTopRow ? index : index - topRowAmount) * (abilityWidth + spaceBetween) -
        rowWidth / 2 +
        abilityWidth / 2;

      const y = heightOffset + (isOnTopRow ? 0 : abilityWidth + spaceBetween);

      ability.container.setPosition(x, y);
    });
  }

  createAbilityOverlayTween() {
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

  highlightAbility(abilityUsed: Ability) {
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

  unhighlightAbilities({ exclude }: { exclude?: Ability[] } = {}) {
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

  restoreAbilities() {
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

  resumeSkillCooldown() {
    this.abilities.forEach((ability) => {
      if (ability.tween && ability.tween.isPaused()) {
        ability.tween.resume();
      }
    });
  }

  pauseSkillCooldown() {
    this.abilities.forEach((ability) => {
      if (ability.tween && ability.tween.isPlaying()) {
        ability.tween.pause();
      }
    });
  }
}

// not using this yet
export function highlightAbility(ability: Ability, scene: Phaser.Scene) {
  if (!ability) {
    throw Error("Couldnt find ability");
  }
  ability.shineFX?.setActive(true);
  ability.overlay.setAlpha(0);
  scene.tweens.add({
    targets: ability?.container,
    scale: 1.2,
    duration: 200,
    ease: "Bounce.easeOut",
  });
}

// not using this yet
export function unhighlightAbilities(abilities: Ability[], scene: Phaser.Scene) {
  abilities.forEach((ability) => {
    if (ability.hasUsed) {
      ability.overlay.scaleY = 1;
    }
    ability?.shineFX?.setActive(false);
    scene.tweens.add({
      targets: ability?.container,
      scale: 0.7,
      duration: 200,
      ease: "Bounce.easeOut",
    });
  });
}

// not using this yet
export function restoreAbilities(abilities: Ability[], scene: Phaser.Scene) {
  abilities.forEach((ability) => {
    ability.hasUsed = false;
    ability?.shineFX?.setActive(false);
    scene.tweens.add({
      targets: ability?.container,
      scale: 1,
      duration: 200,
      ease: "Bounce.easeOut",
    });
  });
}
