import { MOD_TYPE, Mod, PossibleMods } from "../Mods/ModsTypes";
import { filterModsByType } from "../Mods/ModsUtils";
import { Perk } from "./Perk";
import { Perks } from "../data";

function getPerkData(name: string) {
  const nameWithoutSpaces = name.replace(/\s/g, "");
  const PerkData = Perks[nameWithoutSpaces];
  if (PerkData) {
    return PerkData;
  } else {
    throw new Error(`Unknown perk: ${name}`);
  }
}

function filterPerkMods(mods: PossibleMods): Mod<MOD_TYPE.GRANT_PERK>[] {
  return filterModsByType(mods, MOD_TYPE.GRANT_PERK);
}

export function getPerksInstancesFromMods(mods: PossibleMods) {
  const perkMods = filterPerkMods(mods);

  return perkMods.map((mod) => {
    const PerkData = getPerkData(mod.payload.name);
    return new Perk(PerkData);
  });
}
