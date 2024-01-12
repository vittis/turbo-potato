import { TARGET_TYPE } from "../Target/TargetTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { DamagePayload } from "../Event/EventTypes";

export enum TRIGGER {
  BATTLE_START = "BATTLE_START",
  ON_HIT = "ON_HIT",
  ON_USE = "ON_USE",
  ON_WEAPON_HIT = "ON_WEAPON_HIT",
  ALLY_FAINT = "ALLY_FAINT",
  ENEMY_FAINT = "ENEMY_FAINT",
  SELF_FAINT = "SELF_FAINT",
}

export enum TRIGGER_EFFECT_TYPE {
  STATUS_EFFECT = "STATUS_EFFECT",
  DAMAGE = "DAMAGE",
}

export interface StatusEffectPayload {
  name: STATUS_EFFECT;
  quantity: number | "DYNAMIC";
}

export type TriggerEffectPayloadMap = {
  [TRIGGER_EFFECT_TYPE.DAMAGE]: DamagePayload;
  [TRIGGER_EFFECT_TYPE.STATUS_EFFECT]: StatusEffectPayload[];
};

export interface TriggerEffect<T extends TRIGGER_EFFECT_TYPE> {
  type: T;
  trigger: TRIGGER;
  target?: TARGET_TYPE;
  payload: TriggerEffectPayloadMap[T];
}

export type PossibleTriggerEffect =
  | TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>
  | TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>;
