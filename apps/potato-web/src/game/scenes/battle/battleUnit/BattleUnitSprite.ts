import { toCamelCase } from "../../../../utils/formatString";
import { showArms, showNeck } from "../../../data/equipment/armor/chest/chests";
import { showHead } from "../../../data/equipment/armor/head/heads";

interface UnitSpriteContainer {
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
}

export class BattleUnitSprite {
  public scene: Phaser.Scene;
  public x: number;
  public y: number;
  public dataUnit: any;

  public container: UnitSpriteContainer;

  constructor(scene: Phaser.Scene, x: number, y: number, dataUnit: any) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.dataUnit = dataUnit;

    this.container = {};

    this.setupBodyParts();

    this.setupEquipments();

    this.setupZIndex();

    console.log(dataUnit);
    console.log(this.container);
  }

  /* getContainer(scene: Phaser.Scene) {
    const newContainer = [];

    const spriteContainerKeys = Object.keys(this.container);

    for (const prop of spriteContainerKeys) {
      console.log("aprop", prop);
      if (this.container[prop]) {
        console.log("athis.container[prop]", this.container[prop]);
        //this.container[prop].setDepth(rs);
        scene.add(this.container[prop]);
        //rs--;
      }
    }
  } */

  setupZIndex() {
    if (this.container.weapon) this.container.weapon.setDepth(16);
    if (this.container.offhand) this.container.offhand.setDepth(15);
    if (this.container.helmet) this.container.helmet.setDepth(30);
    if (this.container.headLine) this.container.headLine.setDepth(13);
    if (this.container.headSkin) this.container.headSkin.setDepth(12);
    if (this.container.neckLine) this.container.neckLine.setDepth(11);
    if (this.container.neckSkin) this.container.neckSkin.setDepth(10);
    if (this.container.leftArmLine) this.container.leftArmLine.setDepth(9);
    if (this.container.leftArmSkin) this.container.leftArmSkin.setDepth(8);
    if (this.container.chest) this.container.chest.setDepth(7);
    if (this.container.bodyLine) this.container.bodyLine.setDepth(6);
    if (this.container.bodySkinTop) this.container.bodySkinTop.setDepth(5);
    if (this.container.bodyBot) this.container.bodyBot.setDepth(4);
    if (this.container.rightArmLine) this.container.rightArmLine.setDepth(3);
    if (this.container.rightArmSkin) this.container.rightArmSkin.setDepth(2);
    if (this.container.back) this.container.back.setDepth(1);
  }

  setupBodyParts() {
    this.container.bodySkinTop = this.scene.add.sprite(this.x, this.y, "races_parts_bodyTopSkin");
    this.container.bodyLine = this.scene.add.sprite(this.x, this.y, "races_parts_bodyLine");
    this.container.bodyBot = this.scene.add.sprite(this.x, this.y, "races_parts_bodyBot");

    if (this.showHead()) {
      this.container.headLine = this.scene.add.sprite(this.x, this.y, `races_parts_headLine${this.getRace()}`);
      this.container.headSkin = this.scene.add.sprite(this.x, this.y, `races_parts_headSkin${this.getRace()}`);
    }

    if (this.showNeck()) {
      this.container.neckLine = null;
      this.container.neckSkin = null;
    }

    if (this.showArms()) {
      this.container.leftArmLine = this.scene.add.sprite(this.x, this.y, "races_parts_leftArmLine");
      this.container.leftArmSkin = this.scene.add.sprite(this.x, this.y, "races_parts_leftArmSkin");
      this.container.rightArmLine = this.scene.add.sprite(this.x, this.y, "races_parts_rightArmLine");
      this.container.rightArmSkin = this.scene.add.sprite(this.x, this.y, "races_parts_rightArmSkin");
    }

    const skinColor = this.getRaceColor();

    if (this.container.headSkin) this.container.headSkin.setTint(skinColor);
    if (this.container.neckSkin) this.container.neckSkin.setTint(skinColor);
    if (this.container.leftArmSkin) this.container.leftArmSkin.setTint(skinColor);
    if (this.container.bodySkinTop) this.container.bodySkinTop.setTint(skinColor);
    if (this.container.rightArmSkin) this.container.rightArmSkin.setTint(skinColor);
  }

  setupEquipments() {
    const equips = this.getEquips();

    if (equips.weapon) {
      this.container.weapon = this.scene.add.sprite(this.x, this.y, `equip_weapon_${toCamelCase(equips.weapon)}`);
    }

    if (equips.offhand) {
      this.container.offhand = this.scene.add.sprite(this.x, this.y, `equip_offhand_${toCamelCase(equips.offhand)}`);
    } else {
      if (equips?.weapon?.includes("bow")) {
        this.container.offhand = this.scene.add.sprite(this.x, this.y, "equip_offhand_arrow");
      }
    }

    if (equips.helmet) {
      this.container.helmet = this.scene.add.sprite(this.x, this.y, `equip_head_${toCamelCase(equips.helmet)}`);
    }

    if (equips.chest) {
      this.container.chest = this.scene.add.sprite(this.x, this.y, `equip_body_${toCamelCase(equips.chest)}`);
    }

    this.container.back = this.getEquipBack();
  }

  showHead() {
    return showHead(this.dataUnit.equipment.head.name);
  }

  showNeck() {
    return showNeck(this.dataUnit.equipment.chest.name);
  }

  showArms() {
    return showArms(this.dataUnit.equipment.chest.name);
  }

  getEquipBack() {
    if (this.dataUnit.equipment?.mainHandWeapon?.name.includes("bow")) {
      return this.scene.add.sprite(this.x, this.y, "equip_back_quiver");
    }

    return null;
  }

  getEquips() {
    return {
      weapon: this.dataUnit.equipment?.mainHandWeapon?.name,
      offhand: this.dataUnit.equipment?.offHandWeapon?.name,
      helmet: this.dataUnit.equipment?.head?.name,
      chest: this.dataUnit.equipment?.chest?.name,
    };
  }

  getRace() {
    return this.dataUnit.race.name;
  }

  getRaceColor() {
    switch (this.getRace()) {
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
}
