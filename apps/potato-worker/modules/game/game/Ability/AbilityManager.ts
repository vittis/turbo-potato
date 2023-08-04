import { EquippedItem } from "../Equipment/EquipmentManager";
import { Ability } from "./Ability";

export class AbilityManager {
  private abilitiesFromEquips: Ability[] = [];
  private abilitiesFromClass: Ability[] = [];

  constructor() {}

  get abilities() {
    return this.getAbilities();
  }

  removeAllAbiliiites() {
    this.abilitiesFromEquips = [];
    this.abilitiesFromClass = [];
  }

  removeAllAbilitiesFromEquips() {
    this.abilitiesFromEquips = [];
  }

  removeAllAbilitiesFromClass() {
    this.abilitiesFromClass = [];
  }

  addAbilitiesFromEquips(abilities: Ability[]) {
    this.abilitiesFromEquips = [...this.abilitiesFromEquips, ...abilities];
  }

  addAbilitiesFromClass(abilities: Ability[]) {
    this.abilitiesFromClass = [...this.abilitiesFromClass, ...abilities];
  }

  /* addAbilities(abilities: Ability | Ability[]) {
    if (Array.isArray(abilities)) {
      this.abilities = [...this.abilities, ...abilities];
    } else {
      this.abilities = [...this.abilities, abilities];
    }
  } */

  getAbilities() {
    return [...this.abilitiesFromEquips, ...this.abilitiesFromClass];
  }
}
