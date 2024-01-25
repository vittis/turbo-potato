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
        conditions: [],
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
        conditions: [],
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
        conditions: [],
        payload: [
          {
            name: "STURDY",
            quantity: "DYNAMIC",
          },
        ],
      },
    ],
  } as PerkData,
  Berserk: {
    name: "Berserk",
    type: "TIER_SCALE",
    tiers: [
      {
        name: "ATTACK_POWER",
        values: [5, 10, 15, 20, 30],
      },
      {
        name: "VULNERABLE",
        values: [5, 10, 15, 20, 30],
      },
    ],
    effects: [
      {
        type: "STATUS_EFFECT",
        trigger: "BATTLE_START",
        target: "SELF",
        conditions: [
          {
            type: "POSITION",
            payload: {
              target: "SELF",
              position: "FRONT",
            },
          },
        ],
        payload: [
          {
            name: "ATTACK_POWER",
            quantity: "DYNAMIC",
          },
          {
            name: "VULNERABLE",
            quantity: "DYNAMIC",
          },
        ],
      },
    ],
  } as PerkData,
  RangedProficiency: {
    name: "Ranged Proficiency",
    type: "TIER_SCALE",
    tiers: [
      {
        name: "FAST",
        values: [5, 10, 15, 20, 30],
      },
    ],
    effects: [
      {
        type: "STATUS_EFFECT",
        trigger: "BATTLE_START",
        target: "SELF",
        conditions: [
          {
            type: "EQUIPMENT",
            payload: {
              target: "SELF",
              slots: ["MAIN_HAND", "OFF_HAND"],
              tags: ["PHYSICAL", "RANGED"],
            },
          },
        ],
        payload: [
          {
            name: "FAST",
            quantity: "DYNAMIC",
          },
        ],
      },
    ],
  } as PerkData,
};
