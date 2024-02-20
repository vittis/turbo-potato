import { AbilityModifier } from "../Class/ClassTypes";
import { STAT } from "../Stats/StatsTypes";

export enum MOD_TYPE {
  GRANT_ABILITY = "GRANT_ABILITY",
  GRANT_PERK = "GRANT_PERK",
  GRANT_BASE_STAT = "GRANT_BASE_STAT",
  GRANT_ABILITY_MODIFIER = "GRANT_ABILITY_MODIFIER",
}

export interface GrantAbilityPayload {
  name: string;
}

export interface GrantPerkPayload {
  name: string;
  tier?: number;
}

export interface GrantBaseStatPayload {
  stat: STAT;
  value: number;
}

export interface GrantDefaultAbilityModifierPayload {
  name: string;
  modifiers: AbilityModifier;
}

export interface GrantUniqueAbilityModifierPayload {
  name: string;
  nodeName: string;
  unique: boolean;
}

export type GrantAbilityModifierPayload =
  | GrantDefaultAbilityModifierPayload
  | GrantUniqueAbilityModifierPayload;

export type ModPayloadMap = {
  [MOD_TYPE.GRANT_ABILITY]: GrantAbilityPayload;
  [MOD_TYPE.GRANT_PERK]: GrantPerkPayload;
  [MOD_TYPE.GRANT_BASE_STAT]: GrantBaseStatPayload;
  [MOD_TYPE.GRANT_ABILITY_MODIFIER]: GrantAbilityModifierPayload;
};

export interface Mod<T extends MOD_TYPE> {
  type: T;
  payload: ModPayloadMap[T];
}

export type PossibleMods = Array<
  | Mod<MOD_TYPE.GRANT_ABILITY>
  | Mod<MOD_TYPE.GRANT_PERK>
  | Mod<MOD_TYPE.GRANT_BASE_STAT>
  | Mod<MOD_TYPE.GRANT_ABILITY_MODIFIER>
>;
