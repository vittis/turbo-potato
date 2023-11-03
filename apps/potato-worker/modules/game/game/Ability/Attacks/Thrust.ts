import { BoardManager } from "../../BoardManager";
import {
  EVENT_TYPE,
  Event,
  INSTANT_EFFECT_TYPE,
  SUBEVENT_TYPE,
  UseAbilityEvent,
} from "../../Event/EventTypes";
import { Unit } from "../../Unit/Unit";
import Attacks from "../../data/attacks";
import { Ability } from "../Ability";
import { AbilityData } from "../AbilityTypes";

export class Thrust extends Ability {
  constructor() {
    super(Attacks.Thrust);
  }

  use(unit: Unit): Event {
    super.use(unit);
    const target = this.getTargets(unit);

    // TODO: apply real damage using stats modifier for damage

    const damageEvent: UseAbilityEvent<
      SUBEVENT_TYPE.INSTANT_EFFECT,
      INSTANT_EFFECT_TYPE.DAMAGE
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
