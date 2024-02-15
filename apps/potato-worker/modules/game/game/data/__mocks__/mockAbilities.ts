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
        conditions: [],
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
        conditions: [],
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
        conditions: [],
        payload: {
          value: 40,
        },
      },
      {
        type: "STATUS_EFFECT",
        trigger: "ON_HIT",
        target: "STANDARD",
        conditions: [],
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
        conditions: [],
        payload: {
          value: 20,
        },
      },
      {
        type: "STATUS_EFFECT",
        trigger: "ON_HIT",
        target: "SELF",
        conditions: [],
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
        conditions: [],
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
        conditions: [],
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
        conditions: [],
        payload: {
          value: 10,
        },
      },
    ],
  },
  PhalanxFury: {
    name: "Phalanx Fury",
    type: "ATTACK",
    tags: ["WEAPON_ABILITY"],
    target: "STANDARD_ROW",
    cooldown: 40,
    effects: [
      {
        type: "DAMAGE",
        trigger: "ON_HIT",
        target: "STANDARD_ROW",
        conditions: [],
        payload: {
          value: 40,
        },
      },
    ],
  },
};
