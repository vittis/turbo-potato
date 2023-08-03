import { EquippedItem } from "../Equipment/EquipmentManager";
import { Ability } from "./Ability";

export class AbilityManager {
  private abilities: Ability[] = [];

  constructor() {}

  updateEquipmentAbilities(equips: EquippedItem[]) {
    const abilitiesGranted = equips.reduce((acc, cur) => {
      return [...acc, ...cur.equip.getEquipmentAbilities()];
    }, [] as Ability[]);

    this.abilities = abilitiesGranted;
  }

  updateClassAbilities(abilities: Ability[]) {
    this.abilities = [...this.abilities, ...abilities];
  }

  getAbilities() {
    return this.abilities;
  }
}
