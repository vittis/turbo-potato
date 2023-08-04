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
      throw Error("ALREADY EQUIPPED THIS SLOT MAN");
    }
    this.equips.push({
      slot,
      equip,
    });
  }

  unequip(slot: EQUIPMENT_SLOT) {
    const equip = this.equips.find((e) => e.slot === slot);
    this.equips = this.equips.filter((e) => e.slot !== slot);

    return equip;
  }

  getAllAbilitiesFromEquips() {
    return this.equips.reduce(
      (acc, cur) => [...acc, ...cur.equip.getGrantedAbilities()],
      [] as Ability[]
    );
  }

  getAllStatsModsFromEquips() {
    return this.equips.reduce(
      (acc, cur) => [...acc, ...cur.equip.getStatsMods()],
      [] as Mod<MOD_TYPE.GRANT_BASE_STAT>[]
    );
  }
}
