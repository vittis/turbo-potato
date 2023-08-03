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
      throw Error("ALREADY EQUIPPED THIS SLOT MAN");
    }

    this.equips.push({
      slot,
      equip,
    });
  }

  unequip(slot: EQUIPMENT_SLOT) {
    this.equips = this.equips.filter((e) => e.slot !== slot);
  }
}
