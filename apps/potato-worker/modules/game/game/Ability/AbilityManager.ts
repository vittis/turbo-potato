import { Class } from "../Class/Class";
import { EquippedItem } from "../Equipment/EquipmentManager";
import { Ability } from "./Ability";

type AbilitySource = EquippedItem | Class;

interface ActiveAbility {
  ability: Ability;
  source: AbilitySource;
}

export class AbilityManager {
  private activeAbilities: ActiveAbility[] = [];

  constructor() {}

  get abilities() {
    return this.getAbilities();
  }

  removeAllAbiliiites() {
    this.activeAbilities = [];
  }

  addAbilitiesFromSource(abilities: Ability[], source: AbilitySource) {
    abilities.forEach((ability) => {
      this.activeAbilities.push({ ability, source });
    });
  }

  removeAbilitiesFromSource(source: AbilitySource) {
    this.activeAbilities = this.activeAbilities.filter(
      (ability) => ability.source !== source
    );
  }

  getAbilities() {
    return this.activeAbilities.map((ability) => ability.ability);
  }
}
