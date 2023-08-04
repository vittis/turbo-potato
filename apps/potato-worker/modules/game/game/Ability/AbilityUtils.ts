import { MOD_TYPE, Mod, PossibleMods } from "../Mods/ModsTypes";
import { Ability } from "./Ability";
import { Slash } from "./Attacks/Slash";
import { Thrust } from "./Attacks/Thrust";

// todo any way to dynamically make this?
export const AbilityClassMap: { [key: string]: typeof Ability } = {
  Thrust: Thrust,
  Slash: Slash,
};

function getAbilityInstanceClass(name: string) {
  const AbilityClass = AbilityClassMap[name];
  if (AbilityClass) {
    return AbilityClass;
  } else {
    throw new Error(`Unknown ability: ${name}`);
  }
}

function filterAbilityMods(mods: PossibleMods) {
  return mods.filter(
    (mod) => mod.type === MOD_TYPE.GRANT_ABILITY
  ) as Mod<MOD_TYPE.GRANT_ABILITY>[];
}

export function getAbilitiesInstancesFromMods(mods: PossibleMods) {
  const abilityMods = filterAbilityMods(mods);

  if (abilityMods.length === 0) {
    return [];
  }

  return abilityMods.map((mod) => {
    const AbilityClass = getAbilityInstanceClass(mod.payload.name);
    return new AbilityClass();
  });
}
