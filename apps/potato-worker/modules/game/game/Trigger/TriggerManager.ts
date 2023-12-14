import { PossibleTriggerEffect, TRIGGER } from "./TriggerTypes";

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
}
