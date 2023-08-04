import { EquippedItem } from "../Equipment/EquipmentManager";
import { Ability } from "./Ability";

export class AbilityManager {
  private abilities: Ability[] = [];

  constructor() {}

  removeAllAbiliiites() {
    this.abilities = [];
  }

  addAbilities(abilities: Ability | Ability[]) {
    if (Array.isArray(abilities)) {
      this.abilities = [...this.abilities, ...abilities];
    } else {
      this.abilities = [...this.abilities, abilities];
    }
  }

  getAbilities() {
    return this.abilities;
  }
}
