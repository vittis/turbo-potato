import { PossibleMods } from "../Mods/ModsTypes";
import { TriggerEffect } from "../Trigger/TriggerTypes";

export enum EQUIPMENT_SLOT {
  MAIN_HAND = "MAIN_HAND",
  OFF_HAND = "OFF_HAND",
  TWO_HANDED = "TWO_HANDED",
  HEAD = "HEAD",
  CHEST = "CHEST",
}

// this represents the JSON of the equipment
export interface EquipmentData {
  name: string;
  allowedSlots: EQUIPMENT_SLOT[];
  mods: PossibleMods;
  effects: TriggerEffect[];
}
