import { TARGET_TYPE } from "../Ability/TargetTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TRIGGER } from "../Trigger/TriggerTypes";

export enum TRIGGER_EFFECT_TYPE {
  GRANT_STATUS_EFFECT = "GRANT_STATUS_EFFECT",
  // INSTANT_EFFECT = "INSTANT_EFFECT",
}

export enum PERK_TYPE {
  TIER_SCALE = "TIER_SCALE",
  UNIQUE = "UNIQUE",
}

export interface PerkTierScale {
  name: string;
  values: number[];
}

export interface GrantStatusEffectPayload {
  name: STATUS_EFFECT;
  quantity: number | "DYNAMIC";
}

export type TriggerEffectPayloadMap = {
  [TRIGGER_EFFECT_TYPE.GRANT_STATUS_EFFECT]: GrantStatusEffectPayload;
  // [TRIGGER_EFFECT_TYPE.INSTANT_EFFECT]: InstantEffectPayload;
};

export interface TriggerEffect<T extends TRIGGER_EFFECT_TYPE> {
  type: TRIGGER_EFFECT_TYPE;
  trigger: TRIGGER;
  target?: TARGET_TYPE;
  payload: TriggerEffectPayloadMap[T][];
}

export type PossibleTriggerEffects = Array<
  TriggerEffect<TRIGGER_EFFECT_TYPE.GRANT_STATUS_EFFECT>
  // | TriggerEffect<TRIGGER_EFFECT_TYPE.INSTANT_EFFECT>
>;

export interface PerkData {
  name: string;
  type: PERK_TYPE;
  tiers: PerkTierScale[];
  effects: PossibleTriggerEffects;
}
