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
  } as EquipmentData,
};
