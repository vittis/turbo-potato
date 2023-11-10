import { DisarmingShot } from "./Attacks/DisarmingShot";
import { MOD_TYPE, Mod, PossibleMods } from "../Mods/ModsTypes";
import { filterModsByType } from "../Mods/ModsUtils";
import { Ability } from "./Ability";
import { Slash } from "./Attacks/Slash";
import { Thrust } from "./Attacks/Thrust";

// todo any way to dynamically make this?
export const AbilityClassMap: { [key: string]: typeof Ability } = {
  Thrust: Thrust,
  Slash: Slash,
  DisarmingShot: DisarmingShot,
};

function getAbilityInstanceClass(name: string) {
  const nameWithoutSpaces = name.replace(/\s/g, "");
  const AbilityClass = AbilityClassMap[nameWithoutSpaces];
  if (AbilityClass) {
    return AbilityClass;
  } else {
    throw new Error(`Unknown ability: ${name}`);
  }
}

function filterAbilityMods(mods: PossibleMods): Mod<MOD_TYPE.GRANT_ABILITY>[] {
  return filterModsByType(mods, MOD_TYPE.GRANT_ABILITY);
}

export function getAbilitiesInstancesFromMods(mods: PossibleMods) {
  const abilityMods = filterAbilityMods(mods);

  return abilityMods.map((mod) => {
    const AbilityClass = getAbilityInstanceClass(mod.payload.name);
    return new AbilityClass();
  });
}
