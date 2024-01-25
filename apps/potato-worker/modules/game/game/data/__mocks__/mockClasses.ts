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
            type: "GRANT_PERK",
            payload: {
              name: "Ranged Proficiency",
              tier: 1,
            },
          },
        ],
        description: "Gain the Ranged Proficiency perk",
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
  Blacksmith: {
    name: "Blacksmith",
    hp: 110,
    base: [
      {
        mods: [
          {
            type: "GRANT_ABILITY",
            payload: {
              name: "Reinforce Allies",
            },
          },
        ],
        description: "Gain the Reinforce Allies spell",
      },
      {
        mods: [
          {
            type: "GRANT_BASE_STAT",
            payload: {
              stat: "DAMAGE_REDUCTION",
              value: 10,
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
            type: "GRANT_ABILITY_MODIFIER",
            payload: {
              name: "Reinforce Allies",
              nodeName: "Reinforce Self",
              unique: true,
            },
          },
        ],
        description:
          "Reinforce Allies don't affect adjacents units anymore. Apply the same amount to self",
      },
      {
        mods: [
          {
            type: "GRANT_ABILITY_MODIFIER",
            payload: {
              name: "Reinforce Allies",
              modifiers: {
                trigger: [
                  {
                    name: "BATTLE_START",
                  },
                ],
              },
            },
          },
        ],
        description: "BATTLE START: Trigger Reinforce Allies",
      },
      {
        mods: [
          {
            type: "GRANT_ABILITY_MODIFIER",
            payload: {
              name: "Reinforce Allies",
              modifiers: {
                trigger: [
                  {
                    name: "DEATH",
                  },
                ],
              },
            },
          },
        ],
        description: "DEATH: Trigger Reinforce Allies",
      },
    ],
    tree: [
      {
        name: "Weaponsmith",
        talents: [
          {
            tier: 1,
            req: 0,
            mods: [
              {
                type: "GRANT_ABILITY_MODIFIER",
                payload: {
                  name: "Reinforce Allies",
                  modifiers: {
                    status_effect: [
                      {
                        name: "FAST",
                        target: "ADJACENT_ALLIES",
                        value: 5,
                      },
                    ],
                  },
                },
              },
            ],
            description:
              "Reinforce Allies also gives 5 FAST to adjacents allies",
          },
          {
            tier: 1,
            req: 0,
            mods: [
              {
                type: "GRANT_ABILITY_MODIFIER",
                payload: {
                  name: "Reinforce Allies",
                  modifiers: {
                    status_effect: [
                      {
                        name: "ATTACK_POWER",
                        target: "FRONT_UNIT",
                        value: 10,
                      },
                      {
                        name: "SPELL_POTENCY",
                        target: "FRONT_UNIT",
                        value: 10,
                      },
                      {
                        name: "FAST",
                        target: "FRONT_UNIT",
                        value: 10,
                      },
                    ],
                  },
                },
              },
            ],
            description:
              "Reinforce Allies also gives 10 ATTACK POWER, 10 SPELL POTENCY and 10 FAST to FRONT ally",
          },
          {
            tier: 2,
            req: 2,
            mods: [
              {
                type: "GRANT_ABILITY_MODIFIER",
                payload: {
                  name: "Reinforce Allies",
                  modifiers: {
                    status_effect: [
                      {
                        name: "MULTISTRIKE",
                        target: "FRONT_UNIT",
                        value: 1,
                      },
                    ],
                  },
                },
              },
            ],
            description:
              "Reinforce Allies also gives 1 MULTISTRIKE to FRONT ally",
          },
        ],
      },
      {
        name: "Armorsmith",
        talents: [
          {
            tier: 1,
            req: 0,
            mods: [
              {
                type: "GRANT_ABILITY_MODIFIER",
                payload: {
                  name: "Reinforce Allies",
                  modifiers: {
                    status_effect: [
                      {
                        name: "SHIELD",
                        target: "ADJACENT_ALLIES",
                        value: 15,
                      },
                    ],
                  },
                },
              },
            ],
            description:
              "Reinforce Allies also gives gives 15 more SHIELD to adjacents allies",
          },
          {
            tier: 1,
            req: 0,
            mods: [
              {
                type: "GRANT_ABILITY_MODIFIER",
                payload: {
                  name: "Reinforce Allies",
                  modifiers: {
                    status_effect: [
                      {
                        name: "STURDY",
                        target: "FRONT_UNIT",
                        value: 10,
                      },
                      {
                        name: "SHIELD",
                        target: "FRONT_UNIT",
                        value: 20,
                      },
                    ],
                  },
                },
              },
            ],
            description:
              "Reinforce Allies give 10 STURDY and 20 more SHIELD to FRONT ally",
          },
          {
            tier: 2,
            req: 2,
            mods: [
              {
                type: "GRANT_ABILITY_MODIFIER",
                payload: {
                  name: "Reinforce Allies",
                  modifiers: {
                    status_effect: [
                      {
                        name: "TAUNT",
                        target: "FRONT_UNIT",
                        value: 2,
                      },
                      {
                        name: "THORNS",
                        target: "FRONT_UNIT",
                        value: 25,
                      },
                    ],
                  },
                },
              },
            ],
            description:
              "Reinforce Allies: Give 2 TAUNT and 25 THORN to FRONT ally",
          },
        ],
      },
    ],
  },
};
