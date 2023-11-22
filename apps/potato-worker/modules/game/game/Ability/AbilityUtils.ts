import { MOD_TYPE, Mod, PossibleMods } from "../Mods/ModsTypes";
import { filterModsByType } from "../Mods/ModsUtils";
import { Ability } from "./Ability";
import Attacks from "../data/attacks";
import { AbilityData } from "./AbilityTypes";

export const AbilityDataMap: { [key: string]: AbilityData } = {
  Thrust: Attacks.Thrust,
  Slash: Attacks.Slash,
  DisarmingShot: Attacks.DisarmingShot,
};

function filterAbilityMods(mods: PossibleMods): Mod<MOD_TYPE.GRANT_ABILITY>[] {
  return filterModsByType(mods, MOD_TYPE.GRANT_ABILITY);
}

export function getAbilitiesInstancesFromMods(mods: PossibleMods) {
  const abilityMods = filterAbilityMods(mods);

  return abilityMods.map((mod) => {
    const name = mod.payload.name;
    const nameWithoutSpaces = name.replace(/\s/g, "");
    return new Ability(AbilityDataMap[nameWithoutSpaces]);
  });
}
