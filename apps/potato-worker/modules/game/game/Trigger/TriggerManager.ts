import { Ability } from "../Ability/Ability";
import { Perk } from "../Perk/Perk";
import { TriggerEffect } from "../Perk/PerkTypes";

interface ActiveTriggerEffect {
  effect: TriggerEffect;
  source: Ability | Perk; // todo should this be the instance class? Maybe string (id)? Maybe everything have base class with id?
}

export class TriggerManager {
  private triggerEffects = [] as ActiveTriggerEffect[];

  constructor() {}

  // todo addTriggerEffectFromSource?
}
