import { MOD_TYPE, Mod, PossibleMods } from "./ModsTypes";

export function filterModsByType<T extends MOD_TYPE>(
  mods: PossibleMods,
  type: MOD_TYPE
) {
  return mods.filter((mod) => mod.type === type) as Mod<T>[];
}
