import { TriggerEffect } from "../Trigger/TriggerTypes";

export enum PERK_TYPE {
  TIER_SCALE = "TIER_SCALE",
  UNIQUE = "UNIQUE",
}

export interface PerkTierScale {
  name: string;
  values: number[];
}

/* type TriggerEffectPayloadMap = {
  [TRIGGER_EFFECT_TYPE.GRANT_STATUS_EFFECT]: GrantStatusEffectPayload;
}; */

export interface PerkData {
  name: string;
  type: PERK_TYPE;
  tiers: PerkTierScale[];
  effects: TriggerEffect[];
}
