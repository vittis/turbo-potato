import { PossibleMods } from "../Mods/ModsTypes";
import { PossibleTriggerEffect } from "../Trigger/TriggerTypes";

export enum EQUIPMENT_SLOT {
  MAIN_HAND = "MAIN_HAND",
  OFF_HAND = "OFF_HAND",
  TRINKET = "TRINKET",
}

export enum EQUIPMENT_TAG {
  WEAPON = "WEAPON",
  TWO_HANDED = "TWO_HANDED",
  PHYSICAL = "PHYSICAL",
  RANGED = "RANGED",
}

// this represents the JSON of the equipment
export interface EquipmentData {
  name: string;
  tags: EQUIPMENT_TAG[];
  slots: EQUIPMENT_SLOT[];
  mods: PossibleMods;
  effects: PossibleTriggerEffect[];
}
