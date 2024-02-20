import { EquipmentData } from "../../Equipment/EquipmentTypes";

export const MockWeapons = {
  Shortbow: {
    name: "Shortbow",
    tags: ["RANGED", "PHYSICAL"],
    slots: ["MAIN_HAND"],
    mods: [
      {
        type: "GRANT_ABILITY",
        payload: {
          name: "Disarming Shot",
        },
      },
      /* {
        type: "GRANT_PERK",
        payload: {
          name: "Ranged Proficiency",
        },
      }, */
    ],
    effects: [],
  } as EquipmentData,
  ShortSpear: {
    name: "Short Spear",
    tags: [],
    slots: ["MAIN_HAND"],
    mods: [
      {
        type: "GRANT_ABILITY",
        payload: {
          name: "Thrust",
        },
      },
      {
        type: "GRANT_BASE_STAT",
        payload: {
          stat: "ATTACK_DAMAGE",
          value: 10,
        },
      },
      {
        type: "GRANT_PERK",
        payload: {
          name: "Focused Mind",
          tier: 1,
        },
      },
    ],
    effects: [],
  } as EquipmentData,
  Sword: {
    name: "Sword",
    tags: [],
    slots: ["MAIN_HAND", "OFF_HAND"],
    mods: [
      {
        type: "GRANT_ABILITY",
        payload: {
          name: "Slash",
        },
      },
      {
        type: "GRANT_PERK",
        payload: {
          name: "Desperate Will",
          tier: 1,
        },
      },
      {
        type: "GRANT_PERK",
        payload: {
          name: "Berserk",
          tier: 1,
        },
      },
    ],
    effects: [],
  } as EquipmentData,
  Axe: {
    name: "Axe",
    tags: [],
    slots: ["MAIN_HAND"],
    mods: [
      {
        type: "GRANT_ABILITY",
        payload: {
          name: "Empowering Strike",
        },
      },
    ],
    effects: [
      {
        type: "STATUS_EFFECT",
        trigger: "ON_HIT",
        target: "HIT_TARGET",
        conditions: [],
        payload: [
          {
            name: "VULNERABLE",
            quantity: 20,
          },
        ],
      },
      {
        type: "STATUS_EFFECT",
        trigger: "BATTLE_START",
        target: "SELF",
        conditions: [],
        payload: [
          {
            name: "VULNERABLE",
            quantity: 10,
          },
          {
            name: "ATTACK_POWER",
            quantity: 10,
          },
        ],
      },
      {
        type: "DAMAGE",
        trigger: "BATTLE_START",
        target: "SELF",
        conditions: [],
        payload: {
          value: 50,
        },
      },
    ],
  } as EquipmentData,
  Wand: {
    name: "Wand",
    tags: [],
    slots: ["MAIN_HAND"],
    mods: [
      {
        type: "GRANT_ABILITY",
        payload: {
          name: "Empowering Strike",
        },
      },
      {
        type: "GRANT_PERK",
        payload: {
          name: "Focused Mind",
          tier: 1,
        },
      },
      {
        type: "GRANT_PERK",
        payload: {
          name: "Last Words",
          tier: 3,
        },
      },
    ],
    effects: [],
  } as EquipmentData,
};
