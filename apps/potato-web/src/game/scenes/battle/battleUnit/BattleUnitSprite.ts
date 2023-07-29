import { toCamelCase } from "../../../../utils/formatString";
import { showArms, showNeck } from "../../../data/equipment/armor/chest/chests";
import { showHead } from "../../../data/equipment/armor/head/heads";
import {
  addEquipBackSprite,
  addEquipChestSprite,
  addEquipHelmetSprite,
  addEquipOffhandSprite,
  addEquipWeaponSprite,
  addUnitSprite,
} from "../AddSpriteFromSpritesheet";

export class BattleUnitSprite extends Phaser.GameObjects.Container {
  weapon?: Phaser.GameObjects.Sprite | null;
  offhand?: Phaser.GameObjects.Sprite | null;
  helmet?: Phaser.GameObjects.Sprite | null;
  headLine?: Phaser.GameObjects.Sprite | null;
  headSkin?: Phaser.GameObjects.Sprite | null;
  neckLine?: Phaser.GameObjects.Sprite | null;
  neckSkin?: Phaser.GameObjects.Sprite | null;
  leftArmLine?: Phaser.GameObjects.Sprite | null;
  leftArmSkin?: Phaser.GameObjects.Sprite | null;
  chest?: Phaser.GameObjects.Sprite | null;
  bodyLine?: Phaser.GameObjects.Sprite | null;
  bodySkinTop?: Phaser.GameObjects.Sprite | null;
  bodyBot?: Phaser.GameObjects.Sprite | null;
  rightArmLine?: Phaser.GameObjects.Sprite | null;
  rightArmSkin?: Phaser.GameObjects.Sprite | null;
  back?: Phaser.GameObjects.Sprite | null;

  textureName!: string;

  constructor(scene: Phaser.Scene, x: number, y: number, dataUnit: any) {
    super(scene, x, y);

    this.setupBodyParts(dataUnit);

    this.setupEquipments(dataUnit);

    this.setupContainer();

    this.setupZIndex();

    this.createTexture(dataUnit);
  }

  setupContainer() {
    if (this.weapon) this.add(this.weapon);
    if (this.offhand) this.add(this.offhand);
    if (this.helmet) this.add(this.helmet);
    if (this.headLine) this.add(this.headLine);
    if (this.headSkin) this.add(this.headSkin);
    if (this.neckLine) this.add(this.neckLine);
    if (this.neckSkin) this.add(this.neckSkin);
    if (this.leftArmLine) this.add(this.leftArmLine);
    if (this.leftArmSkin) this.add(this.leftArmSkin);
    if (this.chest) this.add(this.chest);
    if (this.bodyLine) this.add(this.bodyLine);
    if (this.bodyBot) this.add(this.bodyBot);
    if (this.bodySkinTop) this.add(this.bodySkinTop);
    if (this.rightArmLine) this.add(this.rightArmLine);
    if (this.rightArmSkin) this.add(this.rightArmSkin);
    if (this.back) this.add(this.back);
  }

  setupZIndex() {
    if (this.back) this.bringToTop(this.back);
    if (this.rightArmSkin) this.bringToTop(this.rightArmSkin);
    if (this.rightArmLine) this.bringToTop(this.rightArmLine);
    if (this.bodyBot) this.bringToTop(this.bodyBot);
    if (this.bodySkinTop) this.bringToTop(this.bodySkinTop);
    if (this.bodyLine) this.bringToTop(this.bodyLine);
    if (this.chest) this.bringToTop(this.chest);
    if (this.leftArmSkin) this.bringToTop(this.leftArmSkin);
    if (this.leftArmLine) this.bringToTop(this.leftArmLine);
    if (this.neckSkin) this.bringToTop(this.neckSkin);
    if (this.neckLine) this.bringToTop(this.neckLine);
    if (this.headSkin) this.bringToTop(this.headSkin);
    if (this.headLine) this.bringToTop(this.headLine);
    if (this.helmet) this.bringToTop(this.helmet);
    if (this.offhand) this.bringToTop(this.offhand);
    if (this.weapon) this.bringToTop(this.weapon);
  }

  setupBodyParts(dataUnit: any) {
    this.bodySkinTop = addUnitSprite(this.scene, 0, 0, "bodyTopSkin");
    this.bodyLine = addUnitSprite(this.scene, 0, 0, "bodyLine");
    this.bodyBot = addUnitSprite(this.scene, 0, 0, "bodyBot");

    if (this.showHead(dataUnit)) {
      this.headLine = addUnitSprite(this.scene, 0, 0, `headLine${this.getRace(dataUnit)}`);
      this.headSkin = addUnitSprite(this.scene, 0, 0, `headSkin${this.getRace(dataUnit)}`);
    }

    if (this.showNeck(dataUnit)) {
      this.neckLine = addUnitSprite(this.scene, 0, 0, `neckLine`);
      this.neckSkin = addUnitSprite(this.scene, 0, 0, `neckSkin`);
    }

    if (this.showArms(dataUnit)) {
      this.leftArmLine = addUnitSprite(this.scene, 0, 0, "leftArmLine");
      this.leftArmSkin = addUnitSprite(this.scene, 0, 0, "leftArmSkin");
      this.rightArmLine = addUnitSprite(this.scene, 0, 0, "rightArmLine");
      this.rightArmSkin = addUnitSprite(this.scene, 0, 0, "rightArmSkin");
    }

    const skinColor = this.getRaceColor(dataUnit);

    if (this.headSkin) this.headSkin.setTint(skinColor);
    if (this.neckSkin) this.neckSkin.setTint(skinColor);
    if (this.leftArmSkin) this.leftArmSkin.setTint(skinColor);
    if (this.bodySkinTop) this.bodySkinTop.setTint(skinColor);
    if (this.rightArmSkin) this.rightArmSkin.setTint(skinColor);
  }

  setupEquipments(dataUnit) {
    const equips = this.getEquips(dataUnit);

    if (equips.weapon) {
      this.weapon = addEquipWeaponSprite(this.scene, 0, 0, toCamelCase(equips.weapon));
    }

    if (equips.offhand) {
      this.offhand = addEquipOffhandSprite(this.scene, 0, 0, toCamelCase(equips.offhand));
    } else {
      if (equips?.weapon?.includes("bow")) {
        this.offhand = addEquipOffhandSprite(this.scene, 0, 0, "arrow");
      }
    }

    if (equips.helmet) {
      this.helmet = addEquipHelmetSprite(this.scene, 0, 0, toCamelCase(equips.helmet));
    }

    if (equips.chest) {
      this.chest = addEquipChestSprite(this.scene, 0, 0, toCamelCase(equips.chest));
    }

    this.back = this.getEquipBack(dataUnit);
  }

  showHead(dataUnit) {
    return showHead(dataUnit.equipment.head.name);
  }

  showNeck(dataUnit) {
    return showNeck(dataUnit.equipment.chest.name);
  }

  showArms(dataUnit) {
    return showArms(dataUnit.equipment.chest.name);
  }

  getEquipBack(dataUnit) {
    if (dataUnit.equipment?.mainHandWeapon?.name.includes("bow")) {
      return addEquipBackSprite(this.scene, 0, 0, "quiver");
    }

    return null;
  }

  getEquips(dataUnit) {
    return {
      weapon: dataUnit.equipment?.mainHandWeapon?.name,
      offhand: dataUnit.equipment?.offHandWeapon?.name,
      helmet: dataUnit.equipment?.head?.name,
      chest: dataUnit.equipment?.chest?.name,
    };
  }

  getRace(dataUnit) {
    return dataUnit.race.name;
  }

  getRaceColor(dataUnit) {
    switch (this.getRace(dataUnit)) {
      case "Human":
        return 0xebbc9e;
      case "Elf":
        return 0xf4dbcb;
      case "Orc":
        return 0x82883e;
      default:
        return 0xebbc9e;
    }
  }

  createTexture(dataUnit) {
    const texture = this.scene.make.renderTexture({ width: 180, height: 180 }, false);
    texture.draw(this, 90, 90);

    this.textureName = `unitTexture${dataUnit.id}`;

    texture.saveTexture(this.textureName);
  }
}
