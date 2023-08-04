import { MOD_TYPE, Mod, PossibleMods } from "../Mods/ModsTypes";
import { filterModsByType } from "../Mods/ModsUtils";

export function filterStatsMods(
  mods: PossibleMods
): Mod<MOD_TYPE.GRANT_BASE_STAT>[] {
  return filterModsByType(mods, MOD_TYPE.GRANT_BASE_STAT);
}
