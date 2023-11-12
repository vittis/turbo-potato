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

export class Slash extends Ability {
  constructor() {
    super(Attacks.Slash);
  }

  use(unit: Unit): UseAbilityEvent {
    super.use(unit);
    const targets = this.getTargets(unit).map((t) => t?.id);

    // TODO: apply real damage using stats modifier for damage

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
