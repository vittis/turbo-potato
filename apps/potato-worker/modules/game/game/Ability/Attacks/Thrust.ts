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

  use(unit: Unit): UseAbilityEvent {
    super.use(unit);
    const targets = this.getTargets(unit).map((t) => t?.id);

    // TODO: apply real damage using stats modifier for damage

    const useAbilityEvent: UseAbilityEvent = {
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

    return useAbilityEvent;
  }

  getTargets(unit: Unit) {
    const targets = unit.bm.getTarget(unit, this.data.target);
    console.log(targets);
    if (targets.length === 0 || targets[0] === undefined) {
      throw Error(`Couldnt find target for ${this.data.name}`);
    }

    return targets;
  }
}
