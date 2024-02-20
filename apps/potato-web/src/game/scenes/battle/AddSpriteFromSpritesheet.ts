import Outfits from "../../data/classes/outfits/outfits";

export function addUnitSprite(scene: Phaser.Scene, x: number, y: number, keyword: string) {
  const sprite = scene.add.sprite(x, y, "unit");

  if (keyword === "headLineElf") sprite.setFrame(0);
  else if (keyword === "headLineHuman") sprite.setFrame(1);
  else if (keyword === "headSkinHuman") sprite.setFrame(2);
  else if (keyword === "neckSkin") sprite.setFrame(3);
  else if (keyword === "headLineOrc") sprite.setFrame(4);
  else if (keyword === "headLineDwarf") sprite.setFrame(4);
  else if (keyword === "headSkinElf") sprite.setFrame(5);
  else if (keyword === "headSkinOrc") sprite.setFrame(6);
  else if (keyword === "headSkinDwarf") sprite.setFrame(6);
  else if (keyword === "rightArmLine") sprite.setFrame(7);
  else if (keyword === "leftArmLine") sprite.setFrame(8);
  else if (keyword === "leftArmSkin") sprite.setFrame(9);
  else if (keyword === "neckLine") sprite.setFrame(10);
  else if (keyword === "rightArmSkin") sprite.setFrame(11);
  else if (keyword === "bodyBot") sprite.setFrame(12);
  else if (keyword === "bodyLine") sprite.setFrame(13);
  else if (keyword === "bodyTopSkin") sprite.setFrame(14);
  else throw Error(`addUnitSprite: ${keyword} not found`);

  return sprite;
}

export function addEquipBackSprite(scene: Phaser.Scene, x: number, y: number, keyword: string) {
  const sprite = scene.add.sprite(x, y, "equip_back");

  if (keyword === "capeGreen") sprite.setFrame(0);
  else if (keyword === "capeYellow") sprite.setFrame(1);
  else if (keyword === "quiver") sprite.setFrame(2);
  else if (keyword === "corn") sprite.setFrame(3);
  else if (keyword === "goldBasket") sprite.setFrame(4);
  else if (keyword === "backpack") sprite.setFrame(5);
  else if (keyword === "basket") sprite.setFrame(6);
  else if (keyword === "capeBlack") sprite.setFrame(6);
  else throw Error(`addEquipBackSprite: ${keyword} not found`);

  return sprite;
}

export function addEquipChestSprite(scene: Phaser.Scene, x: number, y: number, keyword: string) {
  const sprite = scene.add.sprite(x, y, "equip_chest");

  if (keyword === "leatherRobe") sprite.setFrame(0);
  else if (keyword === "leatherRobe2") sprite.setFrame(1);
  else if (keyword === "plateMail") sprite.setFrame(2);
  else if (keyword === "leatherMantle") sprite.setFrame(3);
  else if (keyword === "leatherShirt") sprite.setFrame(4);
  else if (keyword === "leatherShirt2") sprite.setFrame(5);
  else if (keyword === "plateMail2") sprite.setFrame(6);
  else if (keyword === "reinforcedShirt") sprite.setFrame(8);
  else if (keyword === "clothMantle") sprite.setFrame(9);
  else if (keyword === "clothRobe") sprite.setFrame(10);
  else throw Error(`addEquipChestSprite: ${keyword} not found`);

  return sprite;
}

export function addEquipHelmetSprite(scene: Phaser.Scene, x: number, y: number, keyword: string) {
  const sprite = scene.add.sprite(x, y, "equip_helmet");

  if (keyword === "leatherHat") sprite.setFrame(0);
  else if (keyword === "hair") sprite.setFrame(1);
  else if (keyword === "plateHelmet") sprite.setFrame(2);
  else if (keyword === "clothHat") sprite.setFrame(3);
  else if (keyword === "plagueMask") sprite.setFrame(4);
  else if (keyword === "plateHelmet2") sprite.setFrame(5);
  else if (keyword === "witchHat") sprite.setFrame(6);
  else if (keyword === "cap") sprite.setFrame(7);
  else if (keyword === "crown") sprite.setFrame(8);
  else throw Error(`addEquipHelmetSprite: ${keyword} not found`);

  return sprite;
}

export function addEquipOffhandSprite(scene: Phaser.Scene, x: number, y: number, keyword: string) {
  const sprite = scene.add.sprite(x, y, "equip_offhand");

  if (keyword === "herbs") sprite.setFrame(0);
  else if (keyword === "ironShield") sprite.setFrame(1);
  else if (keyword === "arrow") sprite.setFrame(2);
  else if (keyword === "map") sprite.setFrame(3);
  else if (keyword === "woodenShield") sprite.setFrame(4);
  else if (keyword === "book") sprite.setFrame(5);
  else if (keyword === "dagger") sprite.setFrame(6);
  else throw Error(`addEquipOffhandSprite: ${keyword} not found`);

  return sprite;
}

export function addEquipWeaponSprite(scene: Phaser.Scene, x: number, y: number, keyword: string) {
  const sprite = scene.add.sprite(x, y, "equip_weapon");

  if (keyword === "mageStaff") sprite.setFrame(0);
  else if (keyword === "pickaxe") sprite.setFrame(1);
  else if (keyword === "plagueStaff") sprite.setFrame(2);
  else if (keyword === "staff") sprite.setFrame(3);
  else if (keyword === "hammer") sprite.setFrame(4);
  else if (keyword === "shortSpear") sprite.setFrame(5);
  else if (keyword === "trident") sprite.setFrame(6);
  else if (keyword === "pouch") sprite.setFrame(7);
  else if (keyword === "sword") sprite.setFrame(8);
  else if (keyword === "greatsword") sprite.setFrame(8);
  else if (keyword === "scepter") sprite.setFrame(10);
  else if (keyword === "wand") sprite.setFrame(10);
  else if (keyword === "shovel") sprite.setFrame(11);
  else if (keyword === "sickle") sprite.setFrame(12);
  else if (keyword === "pitchfork") sprite.setFrame(13);
  else if (keyword === "axe") sprite.setFrame(15);
  else if (keyword === "shortbow") sprite.setFrame(16);
  else if (keyword === "dagger") sprite.setFrame(17);
  else if (keyword === "club") sprite.setFrame(18);
  else throw Error(`addEquipWeaponSprite: ${keyword} not found`);

  return sprite;
}

export function getOutfitFromClass(unitClass: string) {
  if (unitClass === "blacksmith") return Outfits.Blacksmith;
  else if (unitClass === "cleric") return Outfits.Cleric;
  else if (unitClass === "mage") return Outfits.Mage;
  else if (unitClass === "paladin") return Outfits.Paladin;
  else if (unitClass === "ranger") return Outfits.Ranger;
  else if (unitClass === "rogue") return Outfits.Rogue;
  else if (unitClass === "warlock") return Outfits.Warlock;
  else if (unitClass === "warrior") return Outfits.Warrior;
  else return Outfits.Default;
}
