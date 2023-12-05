import {
  EVENT_TYPE,
  INSTANT_EFFECT_TYPE,
  SUBEVENT_TYPE,
  UseAbilityEvent,
  UseAbilitySubEvent,
} from "../../Event/EventTypes";
import { TRIGGER_EFFECT_TYPE } from "../../Perk/PerkTypes";
import { TRIGGER } from "../../Trigger/TriggerTypes";
import { Unit } from "../../Unit/Unit";
import { Attacks } from "../../data";
import { Ability } from "../Ability";

// todo do we really need one file for every attack/ability?
export class DisarmingShot extends Ability {
  constructor() {
    super(Attacks.DisarmingShot);
  }

  use(unit: Unit): UseAbilityEvent {
    super.use(unit);
    const targets = this.getTargets(unit).map((t) => t?.id);

    // TODO: apply real damage using stats modifier for damage

    const onHitGrantStatusEffects = this.data.effects.filter(
      (effect) =>
        effect.trigger === TRIGGER.ON_HIT &&
        effect.type === TRIGGER_EFFECT_TYPE.GRANT_STATUS_EFFECT
    );

    const statusSubEvents: UseAbilitySubEvent[] = onHitGrantStatusEffects.map(
      (effect) => {
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
      }
    );

    const damageEvent: UseAbilityEvent = {
      type: EVENT_TYPE.USE_ABILITY,
      actorId: unit.id,
      step: unit.currentStep,
      payload: {
        name: this.data.name,
        targetsId: targets,
        subEvents: [
          {
            type: SUBEVENT_TYPE.INSTANT_EFFECT,
            payload: {
              type: INSTANT_EFFECT_TYPE.DAMAGE,
              targetsId: targets,
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

    return targets;
  }
}
