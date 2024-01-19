export const MockAbilities = {
  Thrust: {
    name: "Thrust",
    type: "ATTACK",
    tags: ["WEAPON_ABILITY"],
    target: "STANDARD",
    cooldown: 80,
    effects: [
      {
        type: "DAMAGE",
        trigger: "ON_HIT",
        target: "STANDARD",
        payload: {
          value: 20,
        },
      },
    ],
  },
  Slash: {
    name: "Slash",
    type: "ATTACK",
    tags: ["WEAPON_ABILITY"],
    target: "STANDARD",
    cooldown: 50,
    effects: [
      {
        type: "DAMAGE",
        trigger: "ON_HIT",
        target: "STANDARD",
        payload: {
          value: 20,
        },
      },
    ],
  },
  DisarmingShot: {
    name: "Disarming Shot",
    type: "ATTACK",
    tags: ["WEAPON_ABILITY"],
    target: "STANDARD",
    cooldown: 120,
    effects: [
      {
        type: "DAMAGE",
        trigger: "ON_HIT",
        target: "STANDARD",
        payload: {
          value: 40,
        },
      },
      {
        type: "STATUS_EFFECT",
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
    cooldown: 60,
    effects: [
      {
        type: "DAMAGE",
        trigger: "ON_HIT",
        target: "STANDARD",
        payload: {
          value: 20,
        },
      },
      {
        type: "STATUS_EFFECT",
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
  ReinforceAllies: {
    name: "Reinforce Allies",
    type: "SPELL",
    tags: [],
    target: "ADJACENT_ALLIES",
    cooldown: 100,
    effects: [
      {
        type: "SHIELD",
        trigger: "ON_USE",
        target: "ADJACENT_ALLIES",
        payload: {
          value: 20,
        },
      },
    ],
  },
  BlessedBeacon: {
    name: "Blessed Beacon",
    type: "SPELL",
    tags: ["BUFF"],
    target: "ADJACENT_ALLIES",
    cooldown: 120,
    effects: [
      {
        type: "STATUS_EFFECT",
        trigger: "ON_USE",
        target: "ADJACENT_ALLIES",
        payload: [
          {
            name: "REGEN",
            quantity: 5,
          },
        ],
      },
      {
        type: "HEAL",
        trigger: "ON_USE",
        target: "ADJACENT_ALLIES",
        payload: {
          value: 10,
        },
      },
    ],
  },
};
