export const Weapons = {
  // Your mocked weapons data here
  ShortBow: {
    name: "ShortbowTeste",
    allowedSlots: ["MAIN_HAND"],
    mods: [
      {
        type: "GRANT_ABILITY",
        payload: {
          name: "Disarming Shot",
        },
      },
    ],
  },
};

export const Chests = {
  // Your mocked chests data here
};

export const Heads = {
  // Your mocked heads data here
};

export const Classes = {
  // Your mocked classes data here
};

export const Perks = {
  // Your mocked perks data here
};

export const Attacks = {
  // Your mocked attacks data here
  /* DisarmingShot: {
    name: "Disarming Shot",
    type: "ATTACK",
    tags: [],
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
            quantity: 2,
          },
        ],
      },
    ],
  }, */
};
