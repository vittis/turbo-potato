import { ActiveStatusEffect, STATUS_EFFECT } from "./StatusEffectTypes";

export class StatusEffectManager {
  private _activeStatusEffects = [] as ActiveStatusEffect[];

  constructor() {}

  get activeStatusEffects() {
    return this._activeStatusEffects;
  }

  applyStatusEffect(statusEffect: ActiveStatusEffect) {
    const alreadyHasStatusEffect = this.hasStatusEffect(statusEffect.name);
    if (alreadyHasStatusEffect) {
      this._activeStatusEffects = this._activeStatusEffects.map((effect) => {
        if (effect.name === statusEffect.name) {
          return {
            ...effect,
            quantity: effect.quantity + statusEffect.quantity,
          };
        }
        return effect;
      });
    } else {
      this._activeStatusEffects = [...this._activeStatusEffects, statusEffect];
    }
  }

  hasStatusEffect(name: STATUS_EFFECT) {
    return this._activeStatusEffects.some(
      (statusEffect) => statusEffect.name === name
    );
  }

  removeStacks(name: STATUS_EFFECT, quantity: number) {
    this._activeStatusEffects = this._activeStatusEffects.reduce(
      (acc, effect) => {
        if (effect.name === name) {
          const finalQuantity = Math.max(0, effect.quantity - quantity);
          if (finalQuantity === 0) {
            return acc;
          }
          return [
            ...acc,
            {
              ...effect,
              quantity: finalQuantity,
            },
          ];
        }
        return [...acc, effect];
      },
      [] as ActiveStatusEffect[]
    );
  }

  removeAllStacks(name: STATUS_EFFECT) {
    const index = this._activeStatusEffects.findIndex(
      (statusEffect) => statusEffect.name === name
    );
    if (index === -1) {
      return;
    }

    this._activeStatusEffects.splice(index, 1);
  }
}
