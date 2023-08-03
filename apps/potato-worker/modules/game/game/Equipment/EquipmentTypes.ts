import {
  GrantAbilityModifierPayload,
  GrantUniqueAbilityModifierPayload,
} from "../Class/ClassTypes";

export enum EQUIPMENT_SLOT {
  MAIN_HAND = "MAIN_HAND",
  OFF_HAND = "OFF_HAND",
  TWO_HANDED = "TWO_HANDED",
}

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
  stat: string; // todo use a enum
  value: number;
}

export type ModPayloadMap = {
  [MOD_TYPE.GRANT_ABILITY]: GrantAbilityPayload;
  [MOD_TYPE.GRANT_PERK]: GrantPerkPayload;
  [MOD_TYPE.GRANT_BASE_STAT]: GrantBaseStatPayload;
  [MOD_TYPE.GRANT_ABILITY_MODIFIER]:
    | GrantAbilityModifierPayload
    | GrantUniqueAbilityModifierPayload;
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

// this represents the JSON of the equipment
export interface EquipmentData {
  name: string;
  allowedSlots: EQUIPMENT_SLOT[];
  mods: PossibleMods;
}
