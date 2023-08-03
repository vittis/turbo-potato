import { BoardManager } from "../../BoardManager";
import { Unit } from "../../Unit/Unit";
import Attacks from "../../data/attacks";
import { Ability } from "../Ability";
import { AbilityData } from "../AbilityTypes";

export class Slash extends Ability {
  constructor() {
    super(Attacks.Slash);
  }

  use(unit: Unit): void {
    super.use(unit);
    const targets = this.getTargets(unit);
  }

  getTargets(unit: Unit) {
    const targets = unit.bm.getTarget(unit, this.data.target);
    if (targets.length === 0) {
      throw Error("COULDN'T FIND TARGET FOR SLASH");
    }

    const target = targets[0];

    target.receiveDamage(this.data.baseDamage);
  }
}
