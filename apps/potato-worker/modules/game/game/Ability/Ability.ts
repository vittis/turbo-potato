import { ABILITY_CATEGORY, AbilityData } from "./AbilityTypes";
import { AbilityDataSchema } from "./AbilitySchema";
import { Unit } from "../Unit/Unit";
import {
  EVENT_TYPE,
  INSTANT_EFFECT_TYPE,
  SUBEVENT_TYPE,
  UseAbilityEvent,
  SubEvent,
} from "../Event/EventTypes";
import {
  PossibleTriggerEffect,
  TRIGGER,
  TRIGGER_EFFECT_TYPE,
  TriggerEffect,
} from "../Trigger/TriggerTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { nanoid } from "nanoid";
import {
  createDamageSubEvent,
  createHealSubEvent,
  createShieldSubEvent,
  createStatusEffectSubEvent,
} from "../Event/EventFactory";

export const VULNERABLE_LOSS_PER_HIT = 5; // todo put in json? (data/config/statusEffects.json)

export class Ability {
  id: string;
  data: AbilityData;
  progress = 0;
  cooldown = 0;

  constructor(data?: AbilityData) {
    if (!data) {
      throw Error(
        "Ability is undefined. If running from test make sure it's defined in mock files"
      );
    }
    const parsedData = AbilityDataSchema.parse(data);
    this.data = parsedData;
    this.cooldown = parsedData.cooldown;
    this.id = nanoid(8);
  }

  step() {
    this.progress += 1;
  }

  modifyCooldown(value: number) {
    this.cooldown = this.cooldown - this.cooldown * (value / 100);
  }

  canActivate() {
    return this.progress >= this.cooldown;
  }

  use(unit: Unit): UseAbilityEvent {
    const targets = this.getTargets(unit);

    // TODO fix abilities with no target
    if (targets.length === 0) {
      //@ts-expect-error
      return;
    }

    const onUseSubEvents = this.onUse(
      unit,
      this.data.effects.filter((effect) => effect.trigger === TRIGGER.ON_USE)
    );

    const onHitSubEvents = this.onHit(
      unit,
      this.data.effects.filter((effect) => effect.trigger === TRIGGER.ON_HIT)
    );

    const abilitySubEvents = [...onUseSubEvents, ...onHitSubEvents];

    const useAbilityEvent: UseAbilityEvent = {
      type: EVENT_TYPE.USE_ABILITY,
      actorId: unit.id,
      step: unit.currentStep,
      payload: {
        id: this.id,
        name: this.data.name,
        targetsId: targets.map((t) => t?.id),
        subEvents: abilitySubEvents,
      },
    };

    this.progress = 0;
    return useAbilityEvent;
  }

  isAttack() {
    return this.data.type === ABILITY_CATEGORY.ATTACK;
  }

  isSpell() {
    return this.data.type === ABILITY_CATEGORY.SPELL;
  }

  getDamageModifier(unit: Unit) {
    if (this.isAttack()) {
      return unit.stats.attackDamageModifier;
    } else {
      return unit.stats.spellDamageModifier;
    }
  }

  getTargets(unit: Unit) {
    const targets = unit.bm.getTarget(unit, this.data.target);
    if (targets.length === 0 || targets[0] === undefined) {
      //throw Error(`Couldnt find target for ${this.data.name}`);
      console.log(`Couldnt find target for ${this.data.name}`);
    }

    return targets;
  }

  onUse(unit: Unit, effects: PossibleTriggerEffect[]) {
    let subEvents: SubEvent[] = [];

    effects.forEach((effect) => {
      let newSubEvents: SubEvent[] = [];

      if (effect.type === TRIGGER_EFFECT_TYPE.DAMAGE) {
        newSubEvents = createDamageSubEvent(
          unit,
          effect,
          this.getDamageModifier(unit)
        );
      } else if (effect.type === TRIGGER_EFFECT_TYPE.HEAL) {
        newSubEvents = createHealSubEvent(unit, effect);
      } else if (effect.type === TRIGGER_EFFECT_TYPE.SHIELD) {
        newSubEvents = createShieldSubEvent(unit, effect);
      } else if (effect.type === TRIGGER_EFFECT_TYPE.STATUS_EFFECT) {
        newSubEvents = createStatusEffectSubEvent(unit, effect);
      }

      subEvents = [...subEvents, ...newSubEvents];
    });

    return subEvents;
  }

  onHit(unit: Unit, effects: PossibleTriggerEffect[]) {
    let subEvents: SubEvent[] = [];

    effects.forEach((effect) => {
      let newSubEvents: SubEvent[] = [];

      if (effect.type === TRIGGER_EFFECT_TYPE.DAMAGE) {
        newSubEvents = createDamageSubEvent(
          unit,
          effect,
          this.getDamageModifier(unit)
        );
      } else if (effect.type === TRIGGER_EFFECT_TYPE.HEAL) {
        newSubEvents = createHealSubEvent(unit, effect);
      } else if (effect.type === TRIGGER_EFFECT_TYPE.SHIELD) {
        newSubEvents = createShieldSubEvent(unit, effect);
      } else if (effect.type === TRIGGER_EFFECT_TYPE.STATUS_EFFECT) {
        newSubEvents = createStatusEffectSubEvent(unit, effect);
      }

      subEvents = [...subEvents, ...newSubEvents];
    });

    return subEvents;
  }
}
