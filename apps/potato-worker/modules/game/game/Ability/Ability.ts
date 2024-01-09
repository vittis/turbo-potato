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

    const statusSubEvents: SubEvent[] = [];

    const targetHasVulnerable = targets[0].statusEffects.some(
      (effect) => effect.name === STATUS_EFFECT.VULNERABLE
    );

    if (targetHasVulnerable) {
      const vulnerableQuantity = targets[0].statusEffects.find(
        (effect) => effect.name === STATUS_EFFECT.VULNERABLE
      )?.quantity as number;

      statusSubEvents.push({
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
      });
    }

    const onHitGrantStatusEffects = this.data.effects.filter(
      (effect) =>
        effect.trigger === TRIGGER.ON_HIT &&
        effect.type === TRIGGER_EFFECT_TYPE.STATUS_EFFECT
    ) as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>[];

    const onHitStatusSubEvents: SubEvent[] = onHitGrantStatusEffects.map(
      (effect) => {
        const target =
          effect.target === "HIT_TARGET"
            ? targets[0]
            : unit.bm.getTarget(unit, effect.target)[0];

        return {
          type: SUBEVENT_TYPE.INSTANT_EFFECT,
          payload: {
            type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
            targetsId: [target.id], // todo move effect target logic somewhere else
            payload: [
              {
                name: effect.payload[0].name, // todo loop?
                quantity: effect.payload[0].quantity as number,
              },
            ],
          },
        };
      }
    );

    const damage = this.data.baseDamage
      ? this.data.baseDamage +
        (this.data.baseDamage * this.getDamageModifier(unit)) / 100
      : 0;

    const finalDamage = Math.max(
      1,
      Math.round(
        damage - (damage * targets[0].stats.damageReductionModifier) / 100
      )
    );

    const useAbilityEvent: UseAbilityEvent = {
      type: EVENT_TYPE.USE_ABILITY,
      actorId: unit.id,
      step: unit.currentStep,
      payload: {
        id: this.id,
        name: this.data.name,
        targetsId: targets.map((t) => t?.id),
        subEvents: [
          {
            type: SUBEVENT_TYPE.INSTANT_EFFECT,
            payload: {
              type: INSTANT_EFFECT_TYPE.DAMAGE,
              targetsId: targets.map((t) => t?.id),
              payload: {
                value: finalDamage,
              },
            },
          },
          ...onHitStatusSubEvents,
          ...statusSubEvents,
        ],
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
      throw Error(`Couldnt find target for ${this.data.name}`);
    }

    return targets;
  }
}
