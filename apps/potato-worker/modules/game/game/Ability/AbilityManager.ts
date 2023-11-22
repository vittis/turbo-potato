import { Class } from "../Class/Class";
import { EquippedItem } from "../Equipment/EquipmentManager";
import { MOD_TYPE, Mod } from "../Mods/ModsTypes";
import { STAT } from "../Stats/StatsTypes";
import { Ability } from "./Ability";
import { ABILITY_CATEGORY } from "./AbilityTypes";

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

  applyCooldownModifierFromMods(mods: Mod<MOD_TYPE.GRANT_BASE_STAT>[]) {
    this.activeAbilities.forEach(({ ability }) => {
      const isAttack = ability.data.type === ABILITY_CATEGORY.ATTACK;

      const attackCooldownMods = mods.filter(
        (mod) => mod.payload.stat === STAT.ATTACK_COOLDOWN
      );

      const spellCooldownMods = mods.filter(
        (mod) => mod.payload.stat === STAT.SPELL_COOLDOWN
      );

      if (isAttack) {
        attackCooldownMods.forEach((mod) => {
          ability.modifyCooldown(mod.payload.value);
        });
      } else {
        spellCooldownMods.forEach((mod) => {
          ability.modifyCooldown(mod.payload.value);
        });
      }
    });
  }
}
