import { PerkData } from "../../Perk/PerkTypes";

export const MockPerks = {
  FocusedMind: {
    name: "Focused Mind",
    type: "TIER_SCALE",
    tiers: [
      {
        name: "FOCUS",
        values: [5, 10, 15, 20, 30],
      },
    ],
    effects: [
      {
        type: "STATUS_EFFECT",
        trigger: "BATTLE_START",
        target: "SELF",
        payload: [
          {
            name: "FOCUS",
            quantity: "DYNAMIC",
          },
        ],
      },
    ],
  } as PerkData,
  DesperateWill: {
    name: "Desperate Will",
    type: "TIER_SCALE",
    tiers: [
      {
        name: "ATTACK_POWER",
        values: [5, 10, 15, 20, 30],
      },
      {
        name: "SPELL_POTENCY",
        values: [5, 10, 15, 20, 30],
      },
    ],
    effects: [
      {
        type: "STATUS_EFFECT",
        trigger: "ALLY_FAINT",
        target: "SELF",
        payload: [
          {
            name: "ATTACK_POWER",
            quantity: "DYNAMIC",
          },
          {
            name: "SPELL_POTENCY",
            quantity: "DYNAMIC",
          },
        ],
      },
    ],
  } as PerkData,
  LastWords: {
    name: "Last Words",
    type: "TIER_SCALE",
    tiers: [
      {
        name: "STURDY",
        values: [20, 25, 30, 35, 45],
      },
    ],
    effects: [
      {
        type: "STATUS_EFFECT",
        trigger: "SELF_FAINT",
        target: "ALL_ALLIES",
        payload: [
          {
            name: "STURDY",
            quantity: "DYNAMIC",
          },
        ],
      },
    ],
  } as PerkData,
};
