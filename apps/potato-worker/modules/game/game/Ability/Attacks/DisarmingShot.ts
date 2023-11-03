import {
  EVENT_TYPE,
  Event,
  INSTANT_EFFECT_TYPE,
  SUBEVENT_TYPE,
  UseAbilityEvent,
  UseAbilitySubEvent,
} from "../../Event/EventTypes";
import { TRIGGER_EFFECT_TYPE } from "../../Perk/PerkTypes";
import { TRIGGER } from "../../Trigger/TriggerTypes";
import { Unit } from "../../Unit/Unit";
import Attacks from "../../data/attacks";
import { Ability } from "../Ability";
import { TARGET_TYPE } from "../TargetTypes";

/* switch (effect.trigger) {
        case TRIGGER.ON_HIT:
          return {
            type: SUBEVENT_TYPE.INSTANT_EFFECT,
            payload: {
              type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
              targetId: [target.id],
              payload: {
                name: effect.payload[0].name,
                quantity: effect.payload[0].quantity,
              },
            },
          };
        default:
          throw Error(`Unknown trigger effect type ${effect.type}`); */

// todo do we really need one file for every attack?
export class DisarmingShot extends Ability {
  constructor() {
    super(Attacks.DisarmingShot);
  }

  use(unit: Unit): Event {
    // todo UseAbilityEvent
    super.use(unit);
    const target = this.getTargets(unit);

    // TODO: apply real damage using stats modifier for damage

    const onHitGrantStatusEffects = this.data.effects.filter(
      (effect) =>
        effect.trigger === TRIGGER.ON_HIT &&
        effect.type === TRIGGER_EFFECT_TYPE.GRANT_STATUS_EFFECT
    );

    const statusSubEvents: UseAbilitySubEvent<
      SUBEVENT_TYPE.INSTANT_EFFECT,
      INSTANT_EFFECT_TYPE.STATUS_EFFECT
    >[] = onHitGrantStatusEffects.map((effect) => {
      return {
        type: SUBEVENT_TYPE.INSTANT_EFFECT,
        payload: {
          type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
          targetId: [unit.bm.getTarget(unit, effect.target)[0].id], // todo move effect target logic somewhere else
          payload: {
            name: effect.payload[0].name,
            quantity: effect.payload[0].quantity as number,
          },
        },
      };
    });

    const damageEvent: UseAbilityEvent<
      SUBEVENT_TYPE.INSTANT_EFFECT,
      // todo fix this union
      INSTANT_EFFECT_TYPE.DAMAGE | INSTANT_EFFECT_TYPE.STATUS_EFFECT
    > = {
      type: EVENT_TYPE.USE_ABILITY,
      actorId: unit.id,
      step: unit.currentStep,
      payload: {
        name: this.data.name,
        subEvents: [
          {
            type: SUBEVENT_TYPE.INSTANT_EFFECT,
            payload: {
              type: INSTANT_EFFECT_TYPE.DAMAGE,
              targetId: [target.id],
              payload: {
                value: this.data.baseDamage,
              },
            },
          },
          ...statusSubEvents,
        ],
      },
    };

    return damageEvent;
  }

  getTargets(unit: Unit) {
    const targets = unit.bm.getTarget(unit, this.data.target);
    if (targets.length === 0) {
      throw Error(`Couldnt find target for ${this.data.name}`);
    }

    return targets[0];
  }
}
