export enum EVENT_TYPE {
  USE_ABILITY = "USE_ABILITY",
  FAINT = "FAINT",
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

export interface UseAbilityEvent<
  T extends SUBEVENT_TYPE,
  U extends INSTANT_EFFECT_TYPE
> extends Event {
  type: EVENT_TYPE.USE_ABILITY;
  actorId: string;
  payload: UseAbilityEventPayload<T, U>;
}

export interface FaintEvent extends Event {
  type: EVENT_TYPE.FAINT;
  actorId: string;
}

export interface UseAbilityEventPayload<
  T extends SUBEVENT_TYPE,
  U extends INSTANT_EFFECT_TYPE
> {
  name: string;
  subEvents: UseAbilitySubEvent<T, U>[];
}

export interface UseAbilitySubEvent<
  T extends SUBEVENT_TYPE,
  U extends INSTANT_EFFECT_TYPE
> {
  type: T;
  payload: UseAbilitySubEventMap<U>[T];
}

export type UseAbilitySubEventMap<U extends INSTANT_EFFECT_TYPE> = {
  [SUBEVENT_TYPE.INSTANT_EFFECT]: InstantEffectPayload<U>;
};

export interface InstantEffectPayload<T extends INSTANT_EFFECT_TYPE> {
  type: T;
  targetId: string[];
  payload: InstantEffectPayloadMap[T];
}

export type InstantEffectPayloadMap = {
  [INSTANT_EFFECT_TYPE.DAMAGE]: DamagePayload;
  [INSTANT_EFFECT_TYPE.HEAL]: HealPayload;
  [INSTANT_EFFECT_TYPE.SHIELD]: ShieldPayload;
  [INSTANT_EFFECT_TYPE.DISABLE]: DisablePayload;
  [INSTANT_EFFECT_TYPE.STATUS_EFFECT]: StatusEffectPayload;
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
  name: string;
  duration: number;
}

export interface StatusEffectPayload {
  name: string;
  quantity: number;
}

/* const fireball: UseAbilityEvent<SUBEVENT_TYPE.INSTANT_EFFECT> = {
  type: EVENT_TYPE.USE_ABILITY,
  actorId: "player123",
  payload: {
    name: "Fireball",
    subEvents: [
      {
        type: SUBEVENT_TYPE.INSTANT_EFFECT,
        payload: {
          type: INSTANT_EFFECT_TYPE.DAMAGE,
          targetId: ["enemy456"],
          payload: {
            // I would like that the type of this payload is DamagePayload, because the type of the subevent is INSTANT_EFFECT_TYPE.DAMAGE
            value: 50,
          } as DamagePayload, // I dont want to have to write this here
        },
      },
    ],
  },
};
 */
