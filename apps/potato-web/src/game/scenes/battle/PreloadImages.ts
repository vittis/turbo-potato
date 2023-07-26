export function loadCurrentAssets(scene: Phaser.Scene) {
  scene.load.image("board", "assets/board3.png");
  scene.load.image("castle", "assets/castle.png");

  scene.load.spritesheet("warrior", "assets/Warrior.png", {
    frameWidth: 192,
    frameHeight: 192,
  });

  //scene.load.image("ranger", "assets/units/archer.png");
  scene.load.image("ranger", "assets/premade_characters/archer.svg");

  scene.load.image("cleric", "assets/units/cleric.png");

  scene.load.image("knight", "assets/units/knight.png");

  scene.load.spritesheet("tree", "assets/tree.png", {
    frameWidth: 192,
    frameHeight: 192,
  });
}

export function loadCharacterAssets(scene: Phaser.Scene) {
  // Races
  scene.load.image("races_parts_bodyBot", "assets/races/parts/body_bot.svg");
  scene.load.image("races_parts_bodyLine", "assets/races/parts/body_line.svg");
  scene.load.image("races_parts_bodyTopSkin", "assets/races/parts/body_top_skin.svg");
  scene.load.image("races_parts_headLineElf", "assets/races/parts/head_line_elf.svg");
  scene.load.image("races_parts_headLineHuman", "assets/races/parts/head_line_human.svg");
  scene.load.image("races_parts_headLineOrc", "assets/races/parts/head_line_orc.svg");
  scene.load.image("races_parts_headSkinElf", "assets/races/parts/head_skin_elf.svg");
  scene.load.image("races_parts_headSkinHuman", "assets/races/parts/head_skin_human.svg");
  scene.load.image("races_parts_headSkinOrc", "assets/races/parts/head_skin_orc.svg");
  scene.load.image("races_parts_leftArmLine", "assets/races/parts/left_arm_line.svg");
  scene.load.image("races_parts_leftArmSkin", "assets/races/parts/left_arm_skin.svg");
  scene.load.image("races_parts_neckLine", "assets/races/parts/neck_line.svg");
  scene.load.image("races_parts_neckSkin", "assets/races/parts/neck_skin.svg");
  scene.load.image("races_parts_rightArmLine", "assets/races/parts/right_arm_line.svg");
  scene.load.image("races_parts_rightArmSkin", "assets/races/parts/right_arm_skin.svg");

  // Equipment - Back
  scene.load.image("equip_back_backpack", "assets/equipment/back/backpack.svg");
  scene.load.image("equip_back_basket", "assets/equipment/back/basket.svg");
  scene.load.image("equip_back_capeBlack", "assets/equipment/back/cape_black.svg");
  scene.load.image("equip_back_capeGreen", "assets/equipment/back/cape_green.svg");
  scene.load.image("equip_back_capeYellow", "assets/equipment/back/cape_yellow.svg");
  scene.load.image("equip_back_corn", "assets/equipment/back/corn.svg");
  scene.load.image("equip_back_goldBasket", "assets/equipment/back/gold_basket.svg");
  scene.load.image("equip_back_quiver", "assets/equipment/back/quiver.svg");

  //Equipment - Chest
  scene.load.image("equip_body_clothMantle", "assets/equipment/body/cloth_mantle.svg");
  scene.load.image("equip_body_clothRobe", "assets/equipment/body/cloth_robe.svg");
  scene.load.image("equip_body_leatherMantle", "assets/equipment/body/leather_mantle.svg");
  scene.load.image("equip_body_leatherRobe", "assets/equipment/body/leather_robe.svg");
  scene.load.image("equip_body_leatherRobe2", "assets/equipment/body/leather_robe_2.svg");
  scene.load.image("equip_body_leatherShirt", "assets/equipment/body/leather_shirt.svg");
  scene.load.image("equip_body_leatherShirt2", "assets/equipment/body/leather_shirt_2.svg");
  scene.load.image("equip_body_plateMail", "assets/equipment/body/plate_mail.svg");
  scene.load.image("equip_body_plateMail2", "assets/equipment/body/plate_mail_2.svg");
  scene.load.image("equip_body_reinforcedShirt", "assets/equipment/body/reinforced_shirt.svg");

  //Equipment - Head
  scene.load.image("equip_head_cap", "assets/equipment/head/cap.svg");
  scene.load.image("equip_head_clothHat", "assets/equipment/head/cloth_hat.svg");
  scene.load.image("equip_head_crown", "assets/equipment/head/crown.svg");
  scene.load.image("equip_head_farmerHat", "assets/equipment/head/farmer_hat.svg");
  scene.load.image("equip_head_hair", "assets/equipment/head/hair.svg");
  scene.load.image("equip_head_hood", "assets/equipment/head/hood.svg");
  scene.load.image("equip_head_plagueMask", "assets/equipment/head/plague_mask.svg");
  scene.load.image("equip_head_plateHelmet", "assets/equipment/head/plate_helmet.svg");
  scene.load.image("equip_head_plateHelmetPaladin", "assets/equipment/head/plate_helmet_paladin.svg");
  scene.load.image("equip_head_witchHat", "assets/equipment/head/witch_hat.svg");

  //Equipment - Offhand
  scene.load.image("equip_offhand_arrow", "assets/equipment/offhand/arrow.svg");
  scene.load.image("equip_offhand_book", "assets/equipment/offhand/book.svg");
  scene.load.image("equip_offhand_dagger", "assets/equipment/offhand/dagger.svg");
  scene.load.image("equip_offhand_herbs", "assets/equipment/offhand/herbs.svg");
  scene.load.image("equip_offhand_ironShield", "assets/equipment/offhand/iron_shield.svg");
  scene.load.image("equip_offhand_map", "assets/equipment/offhand/map.svg");
  scene.load.image("equip_offhand_woodenShield", "assets/equipment/offhand/wooden_shield.svg");

  //Equipment - Weapon
  scene.load.image("equip_weapon_axe", "assets/equipment/weapon/axe.svg");
  scene.load.image("equip_weapon_bow", "assets/equipment/weapon/bow.svg");
  scene.load.image("equip_weapon_club", "assets/equipment/weapon/club.svg");
  scene.load.image("equip_weapon_dagger", "assets/equipment/weapon/dagger.svg");
  scene.load.image("equip_weapon_greatsword", "assets/equipment/weapon/greatsword.svg");
  scene.load.image("equip_weapon_hammer", "assets/equipment/weapon/hammer.svg");
  scene.load.image("equip_weapon_longsword", "assets/equipment/weapon/longsword.svg");
  scene.load.image("equip_weapon_mageStaff", "assets/equipment/weapon/mage_staff.svg");
  scene.load.image("equip_weapon_pickaxe", "assets/equipment/weapon/pickaxe.svg");
  scene.load.image("equip_weapon_pike", "assets/equipment/weapon/pike.svg");
  scene.load.image("equip_weapon_pitchfork", "assets/equipment/weapon/pitchfork.svg");
  scene.load.image("equip_weapon_plagueStaff", "assets/equipment/weapon/plague_staff.svg");
  scene.load.image("equip_weapon_pouch", "assets/equipment/weapon/pouch.svg");
  scene.load.image("equip_weapon_scepter", "assets/equipment/weapon/scepter.svg");
  scene.load.image("equip_weapon_shovel", "assets/equipment/weapon/shovel.svg");
  scene.load.image("equip_weapon_sickle", "assets/equipment/weapon/sickle.svg");
  scene.load.image("equip_weapon_staff", "assets/equipment/weapon/staff.svg");
  scene.load.image("equip_weapon_sword", "assets/equipment/weapon/sword.svg");
  scene.load.image("equip_weapon_trident", "assets/equipment/weapon/trident.svg");
  scene.load.image("equip_weapon_wand", "assets/equipment/weapon/wand.svg");
}
