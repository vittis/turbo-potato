export function loadCurrentAssets(scene: Phaser.Scene) {
  scene.load.image("board", "assets/board3.png");
  scene.load.image("castle", "assets/castle.png");

  scene.load.spritesheet("warrior", "assets/Warrior.png", {
    frameWidth: 192,
    frameHeight: 192,
  });

  //scene.load.image("ranger", "assets/units/archer.png");
  scene.load.image("ranger", "assets/premade_characters/archer.png");

  scene.load.image("cleric", "assets/units/cleric.png");

  scene.load.image("knight", "assets/units/knight.png");
  scene.load.spritesheet("tree", "assets/tree.png", {
    frameWidth: 192,
    frameHeight: 192,
  });

  scene.load.image("distort", "assets/noisesmall2.png");
}

export function loadCharacterAssets(scene: Phaser.Scene) {
  // Races
  scene.load.image("unit_bodyBot", "assets/unit/body_bot.png");
  scene.load.image("unit_bodyLine", "assets/unit/body_line.png");
  scene.load.image("unit_bodyTopSkin", "assets/unit/body_top_skin.png");
  scene.load.image("unit_headLineElf", "assets/unit/head_line_elf.png");
  scene.load.image("unit_headLineHuman", "assets/unit/head_line_human.png");
  scene.load.image("unit_headLineOrc", "assets/unit/head_line_orc.png");
  scene.load.image("unit_headLineDwarf", "assets/unit/head_line_orc.png");
  scene.load.image("unit_headSkinElf", "assets/unit/head_skin_elf.png");
  scene.load.image("unit_headSkinHuman", "assets/unit/head_skin_human.png");
  scene.load.image("unit_headSkinOrc", "assets/unit/head_skin_orc.png");
  scene.load.image("unit_headSkinDwarf", "assets/unit/head_skin_orc.png");
  scene.load.image("unit_leftArmLine", "assets/unit/left_arm_line.png");
  scene.load.image("unit_leftArmSkin", "assets/unit/left_arm_skin.png");
  scene.load.image("unit_neckLine", "assets/unit/neck_line.png");
  scene.load.image("unit_neckSkin", "assets/unit/neck_skin.png");
  scene.load.image("unit_rightArmLine", "assets/unit/right_arm_line.png");
  scene.load.image("unit_rightArmSkin", "assets/unit/right_arm_skin.png");

  // Equipment - Back
  /* scene.load.image("equip_back_backpack", "assets/equipment/back/backpack.png");
  scene.load.image("equip_back_basket", "assets/equipment/back/basket.png");
  scene.load.image("equip_back_capeBlack", "assets/equipment/back/cape_black.png");
  scene.load.image("equip_back_capeGreen", "assets/equipment/back/cape_green.png");
  scene.load.image("equip_back_capeYellow", "assets/equipment/back/cape_yellow.png");
  scene.load.image("equip_back_corn", "assets/equipment/back/corn.png");
  scene.load.image("equip_back_goldBasket", "assets/equipment/back/gold_basket.png");
  scene.load.image("equip_back_quiver", "assets/equipment/back/quiver.png"); */

  //Equipment - Chest
  scene.load.image("equip_body_leatherShirt", "assets/equipment/body/leather_shirt.png");
  scene.load.image("equip_body_clothRobe", "assets/equipment/body/cloth_robe.png");
  scene.load.image("equip_body_plateMail", "assets/equipment/body/plate_mail.png");
  /* scene.load.image("equip_body_clothMantle", "assets/equipment/body/cloth_mantle.png");
  scene.load.image("equip_body_leatherMantle", "assets/equipment/body/leather_mantle.png");
  scene.load.image("equip_body_leatherRobe", "assets/equipment/body/leather_robe.png");
  scene.load.image("equip_body_leatherRobe2", "assets/equipment/body/leather_robe_2.png");
  scene.load.image("equip_body_leatherShirt2", "assets/equipment/body/leather_shirt_2.png");
  scene.load.image("equip_body_plateMail2", "assets/equipment/body/plate_mail_2.png");
  scene.load.image("equip_body_reinforcedShirt", "assets/equipment/body/reinforced_shirt.png"); */

  //Equipment - Head
  scene.load.image("equip_head_clothHat", "assets/equipment/head/hood.png");
  scene.load.image("equip_head_leatherHat", "assets/equipment/head/farmer_hat.png");
  scene.load.image("equip_head_plateHelmet", "assets/equipment/head/plate_helmet.png");
  /* scene.load.image("equip_head_cap", "assets/equipment/head/cap.png");
  scene.load.image("equip_head_crown", "assets/equipment/head/crown.png");
  scene.load.image("equip_head_hair", "assets/equipment/head/hair.png");
  scene.load.image("equip_head_hood", "assets/equipment/head/hood.png");
  scene.load.image("equip_head_plagueMask", "assets/equipment/head/plague_mask.png");
  scene.load.image("equip_head_plateHelmetPaladin", "assets/equipment/head/plate_helmet_paladin.png");
  scene.load.image("equip_head_witchHat", "assets/equipment/head/witch_hat.png"); */

  //Equipment - Offhand
  /* scene.load.image("equip_offhand_arrow", "assets/equipment/offhand/arrow.png");
  scene.load.image("equip_offhand_book", "assets/equipment/offhand/book.png");
  scene.load.image("equip_offhand_dagger", "assets/equipment/offhand/dagger.png");
  scene.load.image("equip_offhand_herbs", "assets/equipment/offhand/herbs.png");
  scene.load.image("equip_offhand_ironShield", "assets/equipment/offhand/iron_shield.png");
  scene.load.image("equip_offhand_map", "assets/equipment/offhand/map.png");
  scene.load.image("equip_offhand_woodenShield", "assets/equipment/offhand/wooden_shield.png"); */

  //Equipment - Weapon
  /* scene.load.image("equip_weapon_axe", "assets/equipment/weapon/axe.png");
  scene.load.image("equip_weapon_bow", "assets/equipment/weapon/bow.png");
  scene.load.image("equip_weapon_club", "assets/equipment/weapon/club.png"); */
  scene.load.image("equip_weapon_dagger", "assets/equipment/weapon/dagger.png");
  scene.load.image("equip_weapon_greatsword", "assets/equipment/weapon/sword.png");
  scene.load.image("equip_weapon_staff", "assets/equipment/weapon/staff.png");
  scene.load.image("equip_weapon_wand", "assets/equipment/weapon/scepter.png");
  /* scene.load.image("equip_weapon_hammer", "assets/equipment/weapon/hammer.png");
  scene.load.image("equip_weapon_longsword", "assets/equipment/weapon/longsword.png");
  scene.load.image("equip_weapon_mageStaff", "assets/equipment/weapon/mage_staff.png");
  scene.load.image("equip_weapon_pickaxe", "assets/equipment/weapon/pickaxe.png");
  scene.load.image("equip_weapon_pike", "assets/equipment/weapon/pike.png");
  scene.load.image("equip_weapon_pitchfork", "assets/equipment/weapon/pitchfork.png");
  scene.load.image("equip_weapon_plagueStaff", "assets/equipment/weapon/plague_staff.png");
  scene.load.image("equip_weapon_pouch", "assets/equipment/weapon/pouch.png");
  scene.load.image("equip_weapon_scepter", "assets/equipment/weapon/scepter.png");
  scene.load.image("equip_weapon_shovel", "assets/equipment/weapon/shovel.png");
  scene.load.image("equip_weapon_sickle", "assets/equipment/weapon/sickle.png");
  scene.load.image("equip_weapon_sword", "assets/equipment/weapon/sword.png");
  scene.load.image("equip_weapon_trident", "assets/equipment/weapon/trident.png"); */
}
