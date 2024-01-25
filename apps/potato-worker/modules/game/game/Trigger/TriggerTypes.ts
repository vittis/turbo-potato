import { TARGET_TYPE } from "../Target/TargetTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { DamagePayload, HealPayload, ShieldPayload } from "../Event/EventTypes";
import { EQUIPMENT_SLOT, EQUIPMENT_TAG } from "../Equipment/EquipmentTypes";

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
  SHIELD = "SHIELD",
  HEAL = "HEAL",
}

export enum EFFECT_CONDITION_TYPE {
  POSITION = "POSITION",
  EQUIPMENT = "EQUIPMENT",
}

export enum BOARD_POSITION {
  FRONT = "FRONT",
  BACK = "BACK",
  ISOLATED = "ISOLATED",
}

interface EffectCondition<T extends EFFECT_CONDITION_TYPE> {
  type: T;
  payload: TriggerConditionPayloadMap[T];
}

type PossibleEffectConditions =
  | EffectCondition<EFFECT_CONDITION_TYPE.POSITION>
  | EffectCondition<EFFECT_CONDITION_TYPE.EQUIPMENT>;

type TriggerConditionPayloadMap = {
  [EFFECT_CONDITION_TYPE.POSITION]: EffectConditionPositionPayload;
  [EFFECT_CONDITION_TYPE.EQUIPMENT]: EffectConditionEquipmentPayload;
};

interface EffectConditionPositionPayload {
  target: TARGET_TYPE;
  position: BOARD_POSITION;
}

interface EffectConditionEquipmentPayload {
  target: TARGET_TYPE;
  slots: EQUIPMENT_SLOT[]; // is OR
  tags: EQUIPMENT_TAG[]; // is AND
}

export interface StatusEffectPayload {
  name: STATUS_EFFECT;
  quantity: number | "DYNAMIC";
}

export type TriggerEffectPayloadMap = {
  [TRIGGER_EFFECT_TYPE.DAMAGE]: DamagePayload;
  [TRIGGER_EFFECT_TYPE.STATUS_EFFECT]: StatusEffectPayload[];
  [TRIGGER_EFFECT_TYPE.SHIELD]: ShieldPayload;
  [TRIGGER_EFFECT_TYPE.HEAL]: HealPayload;
};

export interface TriggerEffect<T extends TRIGGER_EFFECT_TYPE> {
  type: T;
  trigger: TRIGGER;
  target?: TARGET_TYPE;
  conditions: PossibleEffectConditions[];
  payload: TriggerEffectPayloadMap[T];
}

export type PossibleTriggerEffect =
  | TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>
  | TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>
  | TriggerEffect<TRIGGER_EFFECT_TYPE.SHIELD>
  | TriggerEffect<TRIGGER_EFFECT_TYPE.HEAL>;
