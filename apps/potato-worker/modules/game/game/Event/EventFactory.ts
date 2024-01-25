import { VULNERABLE_LOSS_PER_HIT } from "../Ability/Ability";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TRIGGER_EFFECT_TYPE, TriggerEffect } from "../Trigger/TriggerTypes";
import { Unit } from "../Unit/Unit";
import { INSTANT_EFFECT_TYPE, SUBEVENT_TYPE, SubEvent } from "./EventTypes";

export function createStatusEffectSubEvent(
  unit: Unit,
  effect: TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>
) {
  const targets = unit.bm.getTarget(unit, effect.target);

  const payloadStatusEffects = effect.payload.map((statusEffect) => ({
    name: statusEffect.name,
    quantity: statusEffect.quantity,
  }));

  const subEvent = {
    type: SUBEVENT_TYPE.INSTANT_EFFECT,
    payload: {
      type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
      targetsId: targets.map((t) => t?.id),
      payload: [...payloadStatusEffects],
    },
  };

  return subEvent as SubEvent;
}

export function createHealSubEvent(
  unit: Unit,
  effect: TriggerEffect<TRIGGER_EFFECT_TYPE.HEAL>
) {
  const targets = unit.bm.getTarget(unit, effect.target);

  const subEvent = {
    type: SUBEVENT_TYPE.INSTANT_EFFECT,
    payload: {
      type: INSTANT_EFFECT_TYPE.HEAL,
      targetsId: targets.map((t) => t?.id),
      payload: {
        value: effect.payload.value,
      },
    },
  };

  return subEvent as SubEvent;
}

export function createShieldSubEvent(
  unit: Unit,
  effect: TriggerEffect<TRIGGER_EFFECT_TYPE.SHIELD>
) {
  const targets = unit.bm.getTarget(unit, effect.target);

  const subEvent = {
    type: SUBEVENT_TYPE.INSTANT_EFFECT,
    payload: {
      type: INSTANT_EFFECT_TYPE.SHIELD,
      targetsId: targets.map((t) => t?.id),
      payload: {
        value: effect.payload.value,
      },
    },
  };

  return subEvent as SubEvent;
}

export function createDamageSubEvent(
  unit: Unit,
  effect: TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>,
  damageModifier = 0
) {
  const targets = unit.bm.getTarget(unit, effect.target);

  /* const targetHasVulnerable = targets[0].statusEffects.some(
    (effect) => effect.name === STATUS_EFFECT.VULNERABLE
  );

  if (targetHasVulnerable) {
    abilitySubEvents.push(createSubEventVulnerable(targets));
  } */

  const targetDamageReductionModifier =
    targets[0].stats.damageReductionModifier;

  const finalModifier = damageModifier - targetDamageReductionModifier;

  const finalDamage = Math.max(
    0,
    Math.round(
      effect.payload.value + (effect.payload.value * finalModifier) / 100
    )
  );

  const subEvent = {
    type: SUBEVENT_TYPE.INSTANT_EFFECT,
    payload: {
      type: INSTANT_EFFECT_TYPE.DAMAGE,
      targetsId: targets.map((t) => t?.id),
      payload: {
        value: finalDamage,
      },
    },
  };

  return subEvent as SubEvent;
}

export function createSubEventVulnerable(targets: Unit[]) {
  const vulnerableQuantity = targets[0].statusEffects.find(
    (effect) => effect.name === STATUS_EFFECT.VULNERABLE
  )?.quantity as number;

  const subEvent = {
    type: SUBEVENT_TYPE.INSTANT_EFFECT,
    payload: {
      type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
      targetsId: [targets[0].id], // todo not only [0]
      payload: [
        {
          name: STATUS_EFFECT.VULNERABLE,
          quantity: Math.max(-VULNERABLE_LOSS_PER_HIT, -vulnerableQuantity),
        },
      ],
    },
  };

  return subEvent as SubEvent;
}
