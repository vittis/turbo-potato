import { Ability } from "../Ability/Ability";
import { MOD_TYPE, Mod } from "../Mods/ModsTypes";
import { Equipment } from "./Equipment";
import { EQUIPMENT_SLOT } from "./EquipmentTypes";

export interface EquippedItem {
  slot: EQUIPMENT_SLOT;
  equip: Equipment;
}

export class EquipmentManager {
  equips: EquippedItem[] = [];

  constructor() {}

  equip(equip: Equipment, slot: EQUIPMENT_SLOT) {
    const isSlotOccupied = this.equips.find((e) => e.slot === slot);
    if (isSlotOccupied) {
      throw Error("ALREADY EQUIPPED THIS SLOT MAN: " + slot + equip.data.name);
    }
    const item = {
      slot,
      equip,
    } as EquippedItem;
    this.equips.push(item);

    return item;
  }

  unequip(slot: EQUIPMENT_SLOT): EquippedItem {
    const equippedItem = this.equips.find((e) => e.slot === slot);
    if (!equippedItem) {
      throw Error("NO EQUIP IN THIS SLOT MAN");
    }

    this.equips = this.equips.filter((e) => e.slot !== slot);

    return equippedItem;
  }
}
