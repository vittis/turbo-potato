import { TARGET_TYPE } from "../Target/TargetTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";

export enum TRIGGER {
  BATTLE_START = "BATTLE_START",
  ON_HIT = "ON_HIT",
  ON_WEAPON_HIT = "ON_WEAPON_HIT",
  ALLY_FAINT = "ALLY_FAINT",
  ENEMY_FAINT = "ENEMY_FAINT",
  SELF_FAINT = "FAINT",
}

export enum TRIGGER_EFFECT_TYPE {
  GRANT_STATUS_EFFECT = "GRANT_STATUS_EFFECT",
  // INSTANT_EFFECT = "INSTANT_EFFECT",
}

export interface GrantStatusEffectPayload {
  name: STATUS_EFFECT;
  quantity: number | "DYNAMIC";
}

type TriggerEffectPayload = GrantStatusEffectPayload /*  | OtherPayloadType */;

export interface TriggerEffect {
  type: TRIGGER_EFFECT_TYPE;
  trigger: TRIGGER;
  target?: TARGET_TYPE;
  payload: TriggerEffectPayload[];
}
