import { MOD_TYPE, Mod, PossibleMods } from "../Mods/ModsTypes";
import { filterModsByType } from "../Mods/ModsUtils";
import { Attacks } from "../data";
import { Ability } from "./Ability";
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
    if (!AbilityDataMap[nameWithoutSpaces]) {
      throw Error(
        `Could not find ability ${name}. Make sure it's defined in AbilityDataMap. If running from a test make sure that it is mocked.`
      );
    }
    return new Ability(AbilityDataMap[nameWithoutSpaces]);
  });
}
