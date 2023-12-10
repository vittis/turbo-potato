export const MockAttacks = {
  Thrust: {
    name: "Thrust",
    type: "ATTACK",
    tags: ["WEAPON_ABILITY"],
    target: "STANDARD",
    baseDamage: 30,
    cooldown: 80,
    effects: [],
  },
  Slash: {
    name: "Slash",
    type: "ATTACK",
    tags: ["WEAPON_ABILITY"],
    target: "STANDARD",
    baseDamage: 20,
    cooldown: 50,
    effects: [],
  },
  DisarmingShot: {
    name: "Disarming Shot",
    type: "ATTACK",
    tags: ["WEAPON_ABILITY"],
    target: "STANDARD",
    baseDamage: 40,
    cooldown: 120,
    effects: [
      {
        type: "GRANT_STATUS_EFFECT",
        trigger: "ON_HIT",
        target: "STANDARD",
        payload: [
          {
            name: "VULNERABLE",
            quantity: 15,
          },
        ],
      },
    ],
  },
  EmpoweringStrike: {
    name: "Empowering Strike",
    type: "ATTACK",
    tags: ["WEAPON_ABILITY"],
    target: "STANDARD",
    baseDamage: 20,
    cooldown: 60,
    effects: [
      {
        type: "GRANT_STATUS_EFFECT",
        trigger: "ON_HIT",
        target: "SELF",
        payload: [
          {
            name: "ATTACK_POWER",
            quantity: 10,
          },
        ],
      },
    ],
  },
};
