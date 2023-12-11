import { EquipmentData } from "../../Equipment/EquipmentTypes";

export const MockWeapons = {
  Shortbow: {
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
    effects: [],
  } as EquipmentData,
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
      {
        type: "GRANT_BASE_STAT",
        payload: {
          stat: "ATTACK_DAMAGE",
          value: 5,
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
    allowedSlots: ["MAIN_HAND", "OFF_HAND"],
    mods: [
      {
        type: "GRANT_ABILITY",
        payload: {
          name: "Slash",
        },
      },
    ],
    effects: [],
  } as EquipmentData,
  Axe: {
    name: "Axe",
    allowedSlots: ["MAIN_HAND"],
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
        type: "GRANT_STATUS_EFFECT",
        trigger: "ON_HIT",
        target: "HIT_TARGET",
        payload: [
          {
            name: "VULNERABLE",
            quantity: 20,
          },
        ],
      },
    ],
  } as EquipmentData,
};
