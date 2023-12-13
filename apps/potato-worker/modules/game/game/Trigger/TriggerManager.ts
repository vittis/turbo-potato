import { Class } from "../Class/Class";
import { Equipment } from "../Equipment/Equipment";
import { Perk } from "../Perk/Perk";
import { TRIGGER, TriggerEffect } from "./TriggerTypes";

interface ActiveTriggerEffect {
  effect: TriggerEffect;
  sourceId: string;
}

export class TriggerManager {
  triggerEffects: ActiveTriggerEffect[] = [];

  constructor() {}

  addTriggerEffectsFromSource(effects: TriggerEffect[], sourceId: string) {
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
    return this.triggerEffects.reduce((acc, { effect }) => {
      if (effect.trigger === trigger) {
        acc.push(effect);
      }
      return acc;
    }, [] as TriggerEffect[]);
  }
}
