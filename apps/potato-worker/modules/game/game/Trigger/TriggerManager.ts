import { BoardManager } from "../BoardManager";
import {
  createDamageSubEvent,
  createHealSubEvent,
  createShieldSubEvent,
  createStatusEffectSubEvent,
} from "../Event/EventFactory";
import {
  EVENT_TYPE,
  INSTANT_EFFECT_TYPE,
  SUBEVENT_TYPE,
  SubEvent,
  TriggerEffectEvent,
} from "../Event/EventTypes";
import { Unit } from "../Unit/Unit";
import {
  isEquipmentConditionValid,
  isPositionConditionValid,
} from "./ConditionUtils";
import {
  EFFECT_CONDITION_TYPE,
  PossibleTriggerEffect,
  TRIGGER,
  TRIGGER_EFFECT_TYPE,
} from "./TriggerTypes";

interface ActiveTriggerEffect {
  effect: PossibleTriggerEffect;
  sourceId: string;
}

export class TriggerManager {
  triggerEffects: ActiveTriggerEffect[] = [];

  constructor() {}

  addTriggerEffectsFromSource(
    effects: PossibleTriggerEffect[],
    sourceId: string
  ) {
    effects.forEach((effect) => {
      this.triggerEffects.push({ effect, sourceId });
    });
  }

  removeTriggerEffectsFromSource(sourceId: string) {
    this.triggerEffects = this.triggerEffects.filter(
      (triggerEffect) => triggerEffect.sourceId !== sourceId
    );
  }

  getAllEffectsForTrigger(trigger: TRIGGER) {
    return this.triggerEffects.reduce((acc, activeEffect) => {
      if (activeEffect.effect.trigger === trigger) {
        acc.push(activeEffect);
      }
      return acc;
    }, [] as ActiveTriggerEffect[]);
  }

  onTrigger(trigger: TRIGGER, unit: Unit, bm: BoardManager) {
    const triggerEffects = this.getAllEffectsForTrigger(trigger);

    let subEvents: SubEvent[] = [];

    triggerEffects.forEach((activeEffect) => {
      let canUseEffect = true;

      if (activeEffect.effect.conditions.length > 0) {
        activeEffect.effect.conditions.forEach((condition) => {
          if (condition.type === EFFECT_CONDITION_TYPE.POSITION) {
            canUseEffect = isPositionConditionValid(
              bm,
              unit,
              condition.payload.target,
              condition.payload.position
            );
          } else if (condition.type === EFFECT_CONDITION_TYPE.EQUIPMENT) {
            canUseEffect = isEquipmentConditionValid(
              bm,
              unit,
              condition.payload.target,
              condition.payload.slots,
              condition.payload.tags
            );
          }
        });
      }

      if (!canUseEffect) {
        return;
      }

      let newSubEvents: SubEvent[] = [];

      if (activeEffect.effect.type === TRIGGER_EFFECT_TYPE.DAMAGE) {
        newSubEvents = createDamageSubEvent(
          unit,
          activeEffect.effect,
          0 // TODO serase 0 ou pega modifier de attack ou spell
        );
      } else if (activeEffect.effect.type === TRIGGER_EFFECT_TYPE.HEAL) {
        newSubEvents = createHealSubEvent(unit, activeEffect.effect);
      } else if (activeEffect.effect.type === TRIGGER_EFFECT_TYPE.SHIELD) {
        newSubEvents = createShieldSubEvent(unit, activeEffect.effect);
      } else if (
        activeEffect.effect.type === TRIGGER_EFFECT_TYPE.STATUS_EFFECT
      ) {
        newSubEvents = createStatusEffectSubEvent(unit, activeEffect.effect);
      }

      subEvents = [...subEvents, ...newSubEvents];
    });

    if (subEvents.length > 0) {
      const event: TriggerEffectEvent = {
        actorId: unit.id,
        step: unit.currentStep,
        type: EVENT_TYPE.TRIGGER_EFFECT,
        trigger: trigger,
        subEvents,
      };

      unit.stepEvents.push(event);
    }
  }
}
