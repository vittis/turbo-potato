export const MockClasses = {
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
      {
        mods: [
          {
            type: "GRANT_BASE_STAT",
            payload: {
              stat: "ATTACK_COOLDOWN",
              value: 7,
            },
          },
          {
            type: "GRANT_BASE_STAT",
            payload: {
              stat: "ATTACK_DAMAGE",
              value: 7,
            },
          },
        ],
        description: "Gain 10% Damage Reduction",
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