import { toCamelCase } from "../../../../utils/formatString";
import { showArms, showNeck } from "../../../data/equipment/armor/chest/chests";
import { showHead } from "../../../data/equipment/armor/head/heads";

export class BattleUnitSpriteContainer {
  public scene: Phaser.Scene;
  public x: number;
  public y: number;
  public dataUnit: any;

  public weapon?: Phaser.GameObjects.Sprite | null;
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
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.dataUnit = dataUnit;

    //this = {};

    this.setupBodyParts();

    this.setupEquipments();

    this.setupZIndex();

    console.log(dataUnit);
  }

  getContainer(container: Phaser.GameObjects.Container) {
    if (this.weapon) container.add(this.weapon);
    if (this.offhand) container.add(this.offhand);
    if (this.helmet) container.add(this.helmet);
    if (this.headLine) container.add(this.headLine);
    if (this.headSkin) container.add(this.headSkin);
    if (this.neckLine) container.add(this.neckLine);
    if (this.neckSkin) container.add(this.neckSkin);
    if (this.leftArmLine) container.add(this.leftArmLine);
    if (this.leftArmSkin) container.add(this.leftArmSkin);
    if (this.chest) container.add(this.chest);
    if (this.bodyLine) container.add(this.bodyLine);
    if (this.bodySkinTop) container.add(this.bodySkinTop);
    if (this.bodyBot) container.add(this.bodyBot);
    if (this.rightArmLine) container.add(this.rightArmLine);
    if (this.rightArmSkin) container.add(this.rightArmSkin);
    if (this.back) container.add(this.back);

    console.log("getContainer", container);

    //return container;
  }

  setupZIndex() {
    if (this.weapon) {
      this.weapon.setDepth(16);
      this.weapon.setOrigin(0.5);
    }
    if (this.offhand) {
      this.offhand.setDepth(15);
      this.offhand.setOrigin(0.5);
    }
    if (this.helmet) {
      this.helmet.setDepth(14);
      this.helmet.setOrigin(0.5);
    }
    if (this.headLine) {
      this.headLine.setDepth(13);
      this.headLine.setOrigin(0.5);
    }
    if (this.headSkin) {
      this.headSkin.setDepth(12);
      this.headSkin.setOrigin(0.5);
    }
    if (this.neckLine) {
      this.neckLine.setDepth(11);
      this.neckLine.setOrigin(0.5);
    }
    if (this.neckSkin) {
      this.neckSkin.setDepth(10);
      this.neckSkin.setOrigin(0.5);
    }
    if (this.leftArmLine) {
      this.leftArmLine.setDepth(9);
      this.leftArmLine.setOrigin(0.5);
    }
    if (this.leftArmSkin) {
      this.leftArmSkin.setDepth(8);
      this.leftArmSkin.setOrigin(0.5);
    }
    if (this.chest) {
      this.chest.setDepth(7);
      this.chest.setOrigin(0.5);
    }
    if (this.bodyLine) {
      this.bodyLine.setDepth(6);
      this.bodyLine.setOrigin(0.5);
    }
    if (this.bodySkinTop) {
      this.bodySkinTop.setDepth(5);
      this.bodySkinTop.setOrigin(0.5);
    }
    if (this.bodyBot) {
      this.bodyBot.setDepth(4);
      this.bodyBot.setOrigin(0.5);
    }
    if (this.rightArmLine) {
      this.rightArmLine.setDepth(3);
      this.rightArmLine.setOrigin(0.5);
    }
    if (this.rightArmSkin) {
      this.rightArmSkin.setDepth(2);
      this.rightArmSkin.setOrigin(0.5);
    }
    if (this.back) {
      this.back.setDepth(1);
      this.back.setOrigin(0.5);
    }
  }

  setupBodyParts() {
    this.bodySkinTop = this.scene.add.sprite(this.x, this.y, "races_parts_bodyTopSkin");
    this.bodyLine = this.scene.add.sprite(this.x, this.y, "races_parts_bodyLine");
    this.bodyBot = this.scene.add.sprite(this.x, this.y, "races_parts_bodyBot");

    if (this.showHead()) {
      this.headLine = this.scene.add.sprite(this.x, this.y, `races_parts_headLine${this.getRace()}`);
      this.headSkin = this.scene.add.sprite(this.x, this.y, `races_parts_headSkin${this.getRace()}`);
    }

    if (this.showNeck()) {
      this.neckLine = null;
      this.neckSkin = null;
    }

    if (this.showArms()) {
      this.leftArmLine = this.scene.add.sprite(this.x, this.y, "races_parts_leftArmLine");
      this.leftArmSkin = this.scene.add.sprite(this.x, this.y, "races_parts_leftArmSkin");
      this.rightArmLine = this.scene.add.sprite(this.x, this.y, "races_parts_rightArmLine");
      this.rightArmSkin = this.scene.add.sprite(this.x, this.y, "races_parts_rightArmSkin");
    }

    const skinColor = this.getRaceColor();

    if (this.headSkin) this.headSkin.setTint(skinColor);
    if (this.neckSkin) this.neckSkin.setTint(skinColor);
    if (this.leftArmSkin) this.leftArmSkin.setTint(skinColor);
    if (this.bodySkinTop) this.bodySkinTop.setTint(skinColor);
    if (this.rightArmSkin) this.rightArmSkin.setTint(skinColor);
  }

  setupEquipments() {
    const equips = this.getEquips();

    if (equips.weapon) {
      this.weapon = this.scene.add.sprite(this.x, this.y, `equip_weapon_${toCamelCase(equips.weapon)}`);
    }

    if (equips.offhand) {
      this.offhand = this.scene.add.sprite(this.x, this.y, `equip_offhand_${toCamelCase(equips.offhand)}`);
    } else {
      if (equips?.weapon?.includes("bow")) {
        this.offhand = this.scene.add.sprite(this.x, this.y, "equip_offhand_arrow");
      }
    }

    if (equips.helmet) {
      this.helmet = this.scene.add.sprite(this.x, this.y, `equip_head_${toCamelCase(equips.helmet)}`);
    }

    if (equips.chest) {
      this.chest = this.scene.add.sprite(this.x, this.y, `equip_body_${toCamelCase(equips.chest)}`);
    }

    this.back = this.getEquipBack();
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

  flipSpritesInContainer(container: Phaser.GameObjects.Container) {
    container.iterate((child) => {
      if (child instanceof Phaser.GameObjects.Sprite) {
        child.flipX = !child.flipX; // Flip the horizontal state
      }
    });
  }
}
