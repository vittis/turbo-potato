import { ABILITY_CATEGORY, AbilityData } from "./AbilityTypes";
import { AbilityDataSchema } from "./AbilitySchema";
import { Unit } from "../Unit/Unit";
import {
  EVENT_TYPE,
  INSTANT_EFFECT_TYPE,
  SUBEVENT_TYPE,
  UseAbilityEvent,
  UseAbilitySubEvent,
} from "../Event/EventTypes";
import { TRIGGER_EFFECT_TYPE } from "../Perk/PerkTypes";
import { TRIGGER } from "../Trigger/TriggerTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";

export class Ability {
  data: AbilityData;
  progress = 0;
  cooldown = 0;

  constructor(data?: AbilityData) {
    const parsedData = AbilityDataSchema.parse(data);
    this.data = parsedData;
    this.cooldown = parsedData.cooldown;
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

    const statusSubEvents: UseAbilitySubEvent[] = [];

    const targetHasVulnerable = targets[0].statusEffects.some(
      (effect) => effect.name === STATUS_EFFECT.VULNERABLE
    );
    if (targetHasVulnerable) {
      const vulnerableLoss = 5;
      targets[0].statusEffectManager.removeStacks(
        STATUS_EFFECT.VULNERABLE,
        vulnerableLoss
      );

      statusSubEvents.push({
        type: SUBEVENT_TYPE.INSTANT_EFFECT,
        payload: {
          type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
          targetsId: [targets[0].id], // todo move effect target logic somewhere else
          payload: {
            name: STATUS_EFFECT.VULNERABLE,
            quantity: -vulnerableLoss,
          },
        },
      });
    }

    const onHitGrantStatusEffects = this.data.effects.filter(
      (effect) =>
        effect.trigger === TRIGGER.ON_HIT &&
        effect.type === TRIGGER_EFFECT_TYPE.GRANT_STATUS_EFFECT
    );

    const onHitStatusSubEvents: UseAbilitySubEvent[] =
      onHitGrantStatusEffects.map((effect) => {
        return {
          type: SUBEVENT_TYPE.INSTANT_EFFECT,
          payload: {
            type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
            targetsId: [unit.bm.getTarget(unit, effect.target)[0].id], // todo move effect target logic somewhere else
            payload: {
              name: effect.payload[0].name,
              quantity: effect.payload[0].quantity as number,
            },
          },
        };
      });

    const damage =
      this.data.baseDamage +
      (this.data.baseDamage * this.getDamageModifier(unit)) / 100;

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
