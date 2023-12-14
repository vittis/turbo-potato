import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";

export enum EVENT_TYPE {
  USE_ABILITY = "USE_ABILITY",
  FAINT = "FAINT",
  TRIGGER_EFFECT = "TRIGGER_EFFECT",
}

export enum SUBEVENT_TYPE {
  INSTANT_EFFECT = "INSTANT_EFFECT",
}

export enum INSTANT_EFFECT_TYPE {
  DAMAGE = "DAMAGE",
  HEAL = "HEAL",
  SHIELD = "SHIELD",
  DISABLE = "DISABLE",
  STATUS_EFFECT = "STATUS_EFFECT",
}

export interface Event {
  type: EVENT_TYPE;
  actorId: string;
  step: number;
}

export interface FaintEvent extends Event {
  actorId: string;
}

export interface UseAbilityEvent extends Event {
  type: EVENT_TYPE.USE_ABILITY;
  actorId: string;
  payload: UseAbilityEventPayload;
}

export interface UseAbilityEventPayload {
  name: string;
  targetsId: string[];
  subEvents: SubEvent[];
}

export interface SubEvent {
  type: SUBEVENT_TYPE;
  payload: InstantEffectPossiblePayload;
}

type InstantEffectPossiblePayload =
  | InstantEffectPayload<INSTANT_EFFECT_TYPE.DAMAGE>
  | InstantEffectPayload<INSTANT_EFFECT_TYPE.HEAL>
  | InstantEffectPayload<INSTANT_EFFECT_TYPE.SHIELD>
  | InstantEffectPayload<INSTANT_EFFECT_TYPE.DISABLE>
  | InstantEffectPayload<INSTANT_EFFECT_TYPE.STATUS_EFFECT>;

export interface InstantEffectPayload<T extends INSTANT_EFFECT_TYPE> {
  type: T;
  targetsId: string[];
  payload: InstantEffectPayloadMap[T];
}

export type InstantEffectPayloadMap = {
  [INSTANT_EFFECT_TYPE.DAMAGE]: DamagePayload;
  [INSTANT_EFFECT_TYPE.HEAL]: HealPayload;
  [INSTANT_EFFECT_TYPE.SHIELD]: ShieldPayload;
  [INSTANT_EFFECT_TYPE.DISABLE]: DisablePayload;
  [INSTANT_EFFECT_TYPE.STATUS_EFFECT]: StatusEffectPayload[];
};

export interface DamagePayload {
  value: number;
}

export interface HealPayload {
  value: number;
}

export interface ShieldPayload {
  value: number;
}

export interface DisablePayload {
  name: string; // todo enum
  duration: number;
}

export interface StatusEffectPayload {
  name: STATUS_EFFECT;
  quantity: number;
}

// TRIGGER EFFECT EVENTS -----------------------------------------------

export interface TriggerEffectEvent extends Event {
  subEvents: SubEvent[];
}
