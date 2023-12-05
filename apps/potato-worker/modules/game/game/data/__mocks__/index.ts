export const Weapons = {
  ShortBow: {
    name: "Shortbow",
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
  ShortSpear: {
    name: "Short Spear",
    allowedSlots: ["MAIN_HAND"],
    mods: [
      {
        type: "GRANT_ABILITY",
        payload: {
          name: "Thrust",
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
  Ranger: {
    name: "Ranger",
    hp: 80,
    base: [
      {
        mods: [
          {
            type: "GRANT_ABILITY",
            payload: {
              name: "Thrust",
            },
          },
        ],
        description: "Gain the Weak Spot attack",
      },
    ],
    utility: [
      {
        mods: [
          {
            type: "GRANT_PERK",
            payload: {
              name: "Desperate Will",
              tier: 1,
            },
          },
        ],
        description: "Gain 1 Desperate Will",
      },
      {
        mods: [
          {
            type: "GRANT_PERK",
            payload: {
              name: "Dampening Field",
              tier: 1,
            },
          },
        ],
        description: "Gain 1 Dampening Field",
      },
      {
        mods: [
          {
            type: "GRANT_PERK",
            payload: {
              name: "Focused Mind",
              tier: 1,
            },
          },
        ],
        description: "Gain 1 Focused Mind",
      },
    ],
    tree: [
      {
        name: "Sniper",
        talents: [
          {
            tier: 1,
            req: 0,
            mods: [
              {
                type: "GRANT_PERK",
                payload: {
                  name: "Ranged Proficiency",
                  tier: 1,
                },
              },
            ],
            description: "Gain 1 Ranged Proficiency",
          },
          {
            tier: 1,
            req: 0,
            mods: [
              {
                type: "GRANT_PERK",
                payload: {
                  name: "Open Field Tactics",
                  tier: 1,
                },
              },
            ],
            description: "Gain 1 Open Field Tactics",
          },
          {
            tier: 2,
            req: 2,
            mods: [
              {
                type: "GRANT_ABILITY",
                payload: {
                  name: "Powershot",
                },
              },
            ],
            description: "Gain the Powershot attack",
          },
        ],
      },
      {
        name: "Hunter",
        talents: [
          {
            tier: 1,
            req: 0,
            mods: [
              {
                type: "GRANT_ABILITY",
                payload: {
                  name: "Summon Crab",
                },
              },
            ],
            description: "Gain the Summon Crab spell",
          },
          {
            tier: 1,
            req: 0,
            mods: [
              {
                type: "GRANT_ABILITY",
                payload: {
                  name: "Summon Rabbit",
                },
              },
            ],
            description: "Gain the Summon Rabbit spell",
          },
          {
            tier: 1,
            req: 0,
            mods: [
              {
                type: "GRANT_ABILITY",
                payload: {
                  name: "Summon Boar",
                },
              },
            ],
            description: "Gain the Summon Boar spell",
          },
          {
            tier: 2,
            req: 1,
            mods: [
              {
                type: "GRANT_PERK",
                payload: {
                  name: "Companion Master",
                  tier: 1,
                },
              },
            ],
            description: "Gain 1 Companion Master",
          },
          {
            tier: 3,
            req: 3,
            mods: [
              {
                type: "GRANT_PERK",
                payload: {
                  name: "Summoner's Farewell",
                },
              },
            ],
            description: "Gain Summoner's Farewell",
          },
        ],
      },
    ],
  },
};

export const Perks = {
  // Your mocked perks data here
};

export const Attacks = {
  DisarmingShot: {
    name: "Disarming Shot",
    type: "ATTACK",
    tags: [],
    target: "STANDARD",
    baseDamage: 100,
    cooldown: 120,
    effects: [
      {
        type: "GRANT_STATUS_EFFECT",
        trigger: "ON_HIT",
        target: "STANDARD",
        payload: [
          {
            name: "VULNERABLE",
            quantity: 10,
          },
        ],
      },
    ],
  },
  Thrust: {
    name: "Thrust",
    type: "ATTACK",
    tags: ["WEAPON_ABILITY"],
    target: "STANDARD",
    baseDamage: 30,
    cooldown: 80,
    effects: [],
  },
};
