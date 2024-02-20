export function loadCurrentAssets(scene: Phaser.Scene) {
  scene.load.image("board", "assets/board/board4.png");
  scene.load.image("floor", "assets/board/floor.png");
  scene.load.image("castle", "assets/castle.png");

  scene.load.spritesheet("warrior", "assets/Warrior.png", {
    frameWidth: 192,
    frameHeight: 192,
  });

  //scene.load.image("ranger", "assets/units/archer.png");
  //scene.load.image("ranger", "assets/premade_characters/archer.png");

  scene.load.image("cleric", "assets/units/cleric.png");

  scene.load.image("knight", "assets/units/knight.png");
  scene.load.spritesheet("tree", "assets/tree.png", {
    frameWidth: 192,
    frameHeight: 192,
  });

  scene.load.image("distort", "assets/noisesmall2.png");
}

export function loadAssets(scene: Phaser.Scene) {
  scene.load.image("paul", "assets/paul.png");

  // Abilities
  scene.load.image("ability_thrust", "assets/abilities/thrust.png");
  scene.load.image("ability_disarming_shot", "assets/abilities/disarming_shot.png");
  scene.load.image("ability_slash", "assets/abilities/slash.png");
  scene.load.image("ability_empowering_strike", "assets/abilities/empowering_strike.png");

  // Status Effects
  scene.load.image("statusEffect_attack_power", "assets/status_effects/attack_power.png");
  scene.load.image("statusEffect_fast", "assets/status_effects/fast.png");
  scene.load.image("statusEffect_focus", "assets/status_effects/focus.png");
  scene.load.image("statusEffect_multistrike", "assets/status_effects/multistrike.png");
  scene.load.image("statusEffect_poison", "assets/status_effects/poison.png");
  scene.load.image("statusEffect_regen", "assets/status_effects/regen.png");
  scene.load.image("statusEffect_slow", "assets/status_effects/slow.png");
  scene.load.image("statusEffect_spell_potency", "assets/status_effects/spell_potency.png");
  scene.load.image("statusEffect_sturdy", "assets/status_effects/sturdy.png");
  scene.load.image("statusEffect_taunt", "assets/status_effects/taunt.png");
  scene.load.image("statusEffect_thorn", "assets/status_effects/thorn.png");
  scene.load.image("statusEffect_vulnerable", "assets/status_effects/vulnerable.png");

  // Unit
  scene.load.spritesheet("unit", "assets/unit.png", {
    frameWidth: 180,
    frameHeight: 180,
  });

  // Equipment Back
  scene.load.spritesheet("equip_back", "assets/equipment/back.png", {
    frameWidth: 180,
    frameHeight: 180,
  });

  // Equipment Chest
  scene.load.spritesheet("equip_chest", "assets/equipment/chest.png", {
    frameWidth: 180,
    frameHeight: 180,
  });

  // Equipment Helmet
  scene.load.spritesheet("equip_helmet", "assets/equipment/helmet.png", {
    frameWidth: 180,
    frameHeight: 180,
  });

  // Equipment Offhand
  scene.load.spritesheet("equip_offhand", "assets/equipment/offhand.png", {
    frameWidth: 180,
    frameHeight: 180,
  });

  // Equipment Weapon
  scene.load.spritesheet("equip_weapon", "assets/equipment/weapon.png", {
    frameWidth: 180,
    frameHeight: 180,
  });

  /*   // Animals
  scene.load.spritesheet("animals", "assets/animals.png", {
    frameWidth: 180,
    frameHeight: 180,
  });

  // Groups
  scene.load.spritesheet("groups", "assets/groups.png", {
    frameWidth: 180,
    frameHeight: 180,
  });

  // Monsters
  scene.load.spritesheet("monsters", "assets/monsters.png", {
    frameWidth: 180,
    frameHeight: 180,
  });

  // Objects
  scene.load.spritesheet("objects", "assets/objects.png", {
    frameWidth: 180,
    frameHeight: 180,
  });

  // Premade Races
  scene.load.spritesheet("premade_races", "assets/premade_races.png", {
    frameWidth: 180,
    frameHeight: 180,
  });

  // Premade Units
  scene.load.spritesheet("premade_units", "assets/premade_units.png", {
    frameWidth: 180,
    frameHeight: 180,
  }); */
}
