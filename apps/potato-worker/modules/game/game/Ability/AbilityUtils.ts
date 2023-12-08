import { MOD_TYPE, Mod, PossibleMods } from "../Mods/ModsTypes";
import { filterModsByType } from "../Mods/ModsUtils";
import { Attacks } from "../data";
import { Ability } from "./Ability";
import { AbilityData } from "./AbilityTypes";

function filterAbilityMods(mods: PossibleMods): Mod<MOD_TYPE.GRANT_ABILITY>[] {
  return filterModsByType(mods, MOD_TYPE.GRANT_ABILITY);
}

export function getAbilitiesInstancesFromMods(mods: PossibleMods) {
  const abilityMods = filterAbilityMods(mods);

  return abilityMods.map((mod) => {
    const name = mod.payload.name;
    const nameWithoutSpaces = name.replace(/\s/g, "");

    // todo do for spells too
    if (!Attacks[nameWithoutSpaces]) {
      throw Error(
        `Could not find ability ${name}. If running from a test make sure that it is mocked.`
      );
    }

    return new Ability(Attacks[nameWithoutSpaces] as any);
  });
}
