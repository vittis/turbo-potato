import { BoardManager } from "../BoardManager";
import {
  EVENT_TYPE,
  INSTANT_EFFECT_TYPE,
  SUBEVENT_TYPE,
  SubEvent,
  TriggerEffectEvent,
} from "../Event/EventTypes";
import { Unit } from "../Unit/Unit";
import {
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
      const targets = bm.getTarget(unit, activeEffect.effect.target);

      if (activeEffect.effect.type === TRIGGER_EFFECT_TYPE.STATUS_EFFECT) {
        subEvents.push({
          type: SUBEVENT_TYPE.INSTANT_EFFECT,
          payload: {
            type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
            targetsId: targets.map((target) => target.id),
            payload: activeEffect.effect.payload.map((statusEffect) => ({
              name: statusEffect.name,
              quantity: statusEffect.quantity as number,
            })),
          },
        });
      } else if (activeEffect.effect.type === TRIGGER_EFFECT_TYPE.DAMAGE) {
        subEvents.push({
          type: SUBEVENT_TYPE.INSTANT_EFFECT,
          payload: {
            type: INSTANT_EFFECT_TYPE.DAMAGE,
            targetsId: targets.map((target) => target.id),
            payload: { value: activeEffect.effect.payload.value },
          },
        });
      }
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
