import { PerkData } from "./PerkTypes";
import { MOD_TYPE, Mod, PossibleMods } from "../Mods/ModsTypes";
import { filterModsByType } from "../Mods/ModsUtils";
import { Perk } from "./Perk";
import Perks from "../data/perks";

// todo any way to dynamically make this?
export const PerkDataMap: { [key: string]: PerkData } = {
  "Focused Mind": Perks.FocusedMind,
};

export const PerkClassMap: { [key: string]: typeof Perk } = {
  //FocusedMind: FocusedMind,
};

function getPerkInstanceClass(name: string) {
  const PerkClass = PerkClassMap[name];
  if (PerkClass) {
    return PerkClass;
  } else {
    throw new Error(`Unknown perk: ${name}`);
  }
}

function getPerkData(name: string) {
  const PerkData = PerkDataMap[name];
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
    if (mod.payload.tier === undefined) {
      const PerkClass = getPerkInstanceClass(mod.payload.name);
      return new PerkClass();
    }

    const PerkData = getPerkData(mod.payload.name);
    return new Perk(PerkData);
  });
}
