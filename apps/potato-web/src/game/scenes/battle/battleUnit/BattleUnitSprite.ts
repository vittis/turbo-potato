import { toCamelCase } from "../../../../utils/formatString";
import { showArms, showNeck } from "../../../data/equipment/armor/chest/chests";
import { showHead } from "../../../data/equipment/armor/head/heads";

export class BattleUnitSprite extends Phaser.GameObjects.Container {
  public weapon?: Phaser.GameObjects.Sprite;
  public offhand?: Phaser.GameObjects.Sprite | null;
  public helmet?: Phaser.GameObjects.Sprite | null;
  public headLine?: Phaser.GameObjects.Sprite | null;
  public headSkin?: Phaser.GameObjects.Sprite | null;
  public neckLine?: Phaser.GameObjects.Sprite | null;
  public neckSkin?: Phaser.GameObjects.Sprite | null;
  public leftArmLine?: Phaser.GameObjects.Sprite | null;
  public leftArmSkin?: Phaser.GameObjects.Sprite | null;
  public chest?: Phaser.GameObjects.Sprite | null;
  public bodyLine?: Phaser.GameObjects.Sprite | null;
  public bodySkinTop?: Phaser.GameObjects.Sprite | null;
  public bodyBot?: Phaser.GameObjects.Sprite | null;
  public rightArmLine?: Phaser.GameObjects.Sprite | null;
  public rightArmSkin?: Phaser.GameObjects.Sprite | null;
  public back?: Phaser.GameObjects.Sprite | null;

  constructor(scene: Phaser.Scene, x: number, y: number, dataUnit: any) {
    super(scene, x, y);

    //this = {};

    this.setupBodyParts(dataUnit);

    this.setupEquipments(dataUnit);

    this.setupContainer();

    this.setupZIndex();
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
    this.bringToTop(this.back);
    this.bringToTop(this.rightArmSkin);
    this.bringToTop(this.rightArmLine);
    this.bringToTop(this.bodyBot);
    this.bringToTop(this.bodySkinTop);
    this.bringToTop(this.bodyLine);
    this.bringToTop(this.chest);
    this.bringToTop(this.leftArmSkin);
    this.bringToTop(this.leftArmLine);
    this.bringToTop(this.neckSkin);
    this.bringToTop(this.neckLine);
    this.bringToTop(this.headSkin);
    this.bringToTop(this.headLine);
    this.bringToTop(this.helmet);
    this.bringToTop(this.offhand);
    this.bringToTop(this.weapon);
  }

  setupBodyParts(dataUnit: any) {
    this.bodySkinTop = this.scene.add.sprite(0, 0, "races_parts_bodyTopSkin");
    this.bodyLine = this.scene.add.sprite(0, 0, "races_parts_bodyLine");
    this.bodyBot = this.scene.add.sprite(0, 0, "races_parts_bodyBot");

    if (this.showHead(dataUnit)) {
      this.headLine = this.scene.add.sprite(0, 0, `races_parts_headLine${this.getRace(dataUnit)}`);
      this.headSkin = this.scene.add.sprite(0, 0, `races_parts_headSkin${this.getRace(dataUnit)}`);
    }

    if (this.showNeck(dataUnit)) {
      this.neckLine = this.scene.add.sprite(0, 0, `races_parts_neckLine`);
      this.neckSkin = this.scene.add.sprite(0, 0, `races_parts_neckSkin`);
    }

    if (this.showArms(dataUnit)) {
      this.leftArmLine = this.scene.add.sprite(0, 0, "races_parts_leftArmLine");
      this.leftArmSkin = this.scene.add.sprite(0, 0, "races_parts_leftArmSkin");
      this.rightArmLine = this.scene.add.sprite(0, 0, "races_parts_rightArmLine");
      this.rightArmSkin = this.scene.add.sprite(0, 0, "races_parts_rightArmSkin");
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
      this.weapon = this.scene.add.sprite(0, 0, `equip_weapon_${toCamelCase(equips.weapon)}`);
    }

    if (equips.offhand) {
      this.offhand = this.scene.add.sprite(0, 0, `equip_offhand_${toCamelCase(equips.offhand)}`);
    } else {
      if (equips?.weapon?.includes("bow")) {
        this.offhand = this.scene.add.sprite(0, 0, "equip_offhand_arrow");
      }
    }

    if (equips.helmet) {
      console.log(`equip_head_${toCamelCase(equips.helmet)}`);
      this.helmet = this.scene.add.sprite(0, 0, `equip_head_${toCamelCase(equips.helmet)}`);
    }

    if (equips.chest) {
      this.chest = this.scene.add.sprite(0, 0, `equip_body_${toCamelCase(equips.chest)}`);
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
      return this.scene.add.sprite(0, 0, "equip_back_quiver");
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

  flipSpritesInContainer() {
    this.iterate((child) => {
      if (child instanceof Phaser.GameObjects.Sprite) {
        child.flipX = !child.flipX; // Flip the horizontal state
      }
    });
  }
}
