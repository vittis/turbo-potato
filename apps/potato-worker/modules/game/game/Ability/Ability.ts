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
      const noTargetEvent: UseAbilityEvent = {
        type: EVENT_TYPE.USE_ABILITY,
        actorId: unit.id,
        step: unit.currentStep,
        payload: {
          id: this.id,
          name: this.data.name,
          targetsId: [],
          subEvents: [],
        },
      };

      return noTargetEvent;
    }

    const abilitySubEvents: SubEvent[] = [];

    this.onUse(
      abilitySubEvents,
      unit,
      this.data.effects.filter((effect) => effect.trigger === TRIGGER.ON_USE)
    );

    this.onHit(
      abilitySubEvents,
      unit,
      this.data.effects.filter((effect) => effect.trigger === TRIGGER.ON_HIT)
    );

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

  onUse(
    abilitySubEvents: SubEvent[],
    unit: Unit,
    effects: PossibleTriggerEffect[]
  ) {
    effects.forEach((effect) => {
      if (effect.type === TRIGGER_EFFECT_TYPE.DAMAGE) {
        abilitySubEvents.push(
          this.createSubEventDamage(abilitySubEvents, unit, effect)
        );
      } else if (effect.type === TRIGGER_EFFECT_TYPE.HEAL) {
        abilitySubEvents.push(this.createSubEventHeal(unit, effect));
      } else if (effect.type === TRIGGER_EFFECT_TYPE.SHIELD) {
        abilitySubEvents.push(this.createSubEventShield(unit, effect));
      } else if (effect.type === TRIGGER_EFFECT_TYPE.STATUS_EFFECT) {
        abilitySubEvents.push(this.createSubEventStatusEffect(unit, effect));
      }
    });
  }

  onHit(
    abilitySubEvents: SubEvent[],
    unit: Unit,
    effects: PossibleTriggerEffect[]
  ) {
    effects.forEach((effect) => {
      if (effect.type === TRIGGER_EFFECT_TYPE.DAMAGE) {
        abilitySubEvents.push(
          this.createSubEventDamage(abilitySubEvents, unit, effect)
        );
      } else if (effect.type === TRIGGER_EFFECT_TYPE.HEAL) {
        abilitySubEvents.push(this.createSubEventHeal(unit, effect));
      } else if (effect.type === TRIGGER_EFFECT_TYPE.SHIELD) {
        abilitySubEvents.push(this.createSubEventShield(unit, effect));
      } else if (effect.type === TRIGGER_EFFECT_TYPE.STATUS_EFFECT) {
        abilitySubEvents.push(this.createSubEventStatusEffect(unit, effect));
      }
    });
  }

  createSubEventDamage(
    abilitySubEvents: SubEvent[],
    unit: Unit,
    effect: TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>
  ) {
    const targets = unit.bm.getTarget(unit, effect.target);

    const targetHasVulnerable = targets[0].statusEffects.some(
      (effect) => effect.name === STATUS_EFFECT.VULNERABLE
    );

    if (targetHasVulnerable) {
      abilitySubEvents.push(this.createSubEventVulnerable(targets));
    }

    const damage =
      effect.payload.value +
      (effect.payload.value * this.getDamageModifier(unit)) / 100;

    const finalDamage = Math.max(
      0,
      Math.round(
        damage - (damage * targets[0].stats.damageReductionModifier) / 100
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

  createSubEventHeal(
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

  createSubEventShield(
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

  createSubEventStatusEffect(
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

  createSubEventVulnerable(targets: Unit[]) {
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
}
