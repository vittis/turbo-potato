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
      const index = this._activeStatusEffects.findIndex(
        (statusEffect) => statusEffect.name === statusEffect.name
      );
      this._activeStatusEffects[index].quantity += statusEffect.quantity;
    } else {
      this._activeStatusEffects.push(statusEffect);
    }
  }

  hasStatusEffect(name: STATUS_EFFECT) {
    return this._activeStatusEffects.some(
      (statusEffect) => statusEffect.name === name
    );
  }

  removeOneStack(name: STATUS_EFFECT) {
    const index = this._activeStatusEffects.findIndex(
      (statusEffect) => statusEffect.name === name
    );
    if (index === -1) {
      return;
    }

    const statusEffect = this._activeStatusEffects[index];
    if (statusEffect.quantity === 1) {
      this._activeStatusEffects.splice(index, 1);
    } else {
      this._activeStatusEffects[index].quantity -= 1;
    }
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
