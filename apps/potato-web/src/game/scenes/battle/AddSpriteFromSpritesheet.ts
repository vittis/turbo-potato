export function addUnitSprite(scene: Phaser.Scene, x: number, y: number, keyword: string) {
  const sprite = scene.add.sprite(x, y, "unit");

  if (keyword === "bodyBot") sprite.setFrame(0);
  else if (keyword === "bodyLine") sprite.setFrame(1);
  else if (keyword === "bodyTopSkin") sprite.setFrame(2);
  else if (keyword === "leftArmLine") sprite.setFrame(3);
  else if (keyword === "headLineElf") sprite.setFrame(4);
  else if (keyword === "headLineHuman") sprite.setFrame(5);
  else if (keyword === "headLineOrc") sprite.setFrame(6);
  else if (keyword === "headLineDwarf") sprite.setFrame(6);
  else if (keyword === "leftArmSkin") sprite.setFrame(7);
  else if (keyword === "headSkinElf") sprite.setFrame(8);
  else if (keyword === "headSkinHuman") sprite.setFrame(9);
  else if (keyword === "headSkinOrc") sprite.setFrame(10);
  else if (keyword === "headSkinDwarf") sprite.setFrame(10);
  else if (keyword === "neckLine") sprite.setFrame(11);
  else if (keyword === "neckSkin") sprite.setFrame(12);
  else if (keyword === "rightArmLine") sprite.setFrame(13);
  else if (keyword === "rightArmSkin") sprite.setFrame(14);
  else throw Error(`addUnitSprite: ${keyword} not found`);

  return sprite;
}

export function addEquipBackSprite(scene: Phaser.Scene, x: number, y: number, keyword: string) {
  const sprite = scene.add.sprite(x, y, "equip_back");

  if (keyword === "backpack") sprite.setFrame(0);
  else if (keyword === "basket") sprite.setFrame(1);
  else if (keyword === "capeBlack") sprite.setFrame(2);
  else if (keyword === "capeGreen") sprite.setFrame(3);
  else if (keyword === "capeYellow") sprite.setFrame(4);
  else if (keyword === "corn") sprite.setFrame(5);
  else if (keyword === "goldBasket") sprite.setFrame(6);
  else if (keyword === "quiver") sprite.setFrame(6);
  else throw Error(`addEquipBackSprite: ${keyword} not found`);

  return sprite;
}

export function addEquipChestSprite(scene: Phaser.Scene, x: number, y: number, keyword: string) {
  const sprite = scene.add.sprite(x, y, "equip_chest");

  if (keyword === "clothMantle") sprite.setFrame(0);
  else if (keyword === "clothRobe") sprite.setFrame(1);
  else if (keyword === "leatherMantle") sprite.setFrame(2);
  else if (keyword === "reinforcedShirt") sprite.setFrame(3);
  else if (keyword === "leatherRobe") sprite.setFrame(4);
  else if (keyword === "leatherRobe2") sprite.setFrame(5);
  else if (keyword === "leatherShirt") sprite.setFrame(6);
  else if (keyword === "leatherShirt2") sprite.setFrame(8);
  else if (keyword === "plateMail") sprite.setFrame(9);
  else if (keyword === "plateMail2") sprite.setFrame(10);
  else throw Error(`addEquipChestSprite: ${keyword} not found`);

  return sprite;
}

export function addEquipHelmetSprite(scene: Phaser.Scene, x: number, y: number, keyword: string) {
  const sprite = scene.add.sprite(x, y, "equip_helmet");

  if (keyword === "cap") sprite.setFrame(0);
  else if (keyword === "crown") sprite.setFrame(1);
  else if (keyword === "leatherHat") sprite.setFrame(2);
  else if (keyword === "hair") sprite.setFrame(3);
  else if (keyword === "clothHat") sprite.setFrame(4);
  else if (keyword === "plagueMask") sprite.setFrame(5);
  else if (keyword === "plateHelmet") sprite.setFrame(6);
  else if (keyword === "plateHelmet2") sprite.setFrame(7);
  else if (keyword === "witchHat") sprite.setFrame(8);
  else throw Error(`addEquipHelmetSprite: ${keyword} not found`);

  return sprite;
}

export function addEquipOffhandSprite(scene: Phaser.Scene, x: number, y: number, keyword: string) {
  const sprite = scene.add.sprite(x, y, "equip_offhand");

  if (keyword === "arrow") sprite.setFrame(0);
  else if (keyword === "book") sprite.setFrame(1);
  else if (keyword === "ironShield") sprite.setFrame(2);
  else if (keyword === "dagger") sprite.setFrame(3);
  else if (keyword === "herbs") sprite.setFrame(4);
  else if (keyword === "map") sprite.setFrame(5);
  else if (keyword === "woodenShield") sprite.setFrame(6);
  else throw Error(`addEquipOffhandSprite: ${keyword} not found`);

  return sprite;
}

export function addEquipWeaponSprite(scene: Phaser.Scene, x: number, y: number, keyword: string) {
  const sprite = scene.add.sprite(x, y, "equip_weapon");

  if (keyword === "axe") sprite.setFrame(0);
  else if (keyword === "bow") sprite.setFrame(1);
  else if (keyword === "club") sprite.setFrame(2);
  else if (keyword === "dagger") sprite.setFrame(3);
  else if (keyword === "trident") sprite.setFrame(4);
  else if (keyword === "hammer") sprite.setFrame(5);
  else if (keyword === "mageStaff") sprite.setFrame(6);
  else if (keyword === "pickaxe") sprite.setFrame(7);
  else if (keyword === "pike") sprite.setFrame(8);
  else if (keyword === "pitchfork") sprite.setFrame(10);
  else if (keyword === "plagueStaff") sprite.setFrame(11);
  else if (keyword === "pouch") sprite.setFrame(12);
  else if (keyword === "scepter") sprite.setFrame(13);
  else if (keyword === "wand") sprite.setFrame(13);
  else if (keyword === "shovel") sprite.setFrame(15);
  else if (keyword === "sickle") sprite.setFrame(16);
  else if (keyword === "staff") sprite.setFrame(17);
  else if (keyword === "sword") sprite.setFrame(18);
  else if (keyword === "greatsword") sprite.setFrame(18);
  else throw Error(`addEquipWeaponSprite: ${keyword} not found`);

  return sprite;
}
