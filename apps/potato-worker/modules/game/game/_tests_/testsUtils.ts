import { Ability } from "../Ability/Ability";
import { Unit } from "../Unit/Unit";

export function useAbility(unit: Unit, ability?: Ability) {
  let finalAbility = ability || unit.abilities[0];

  for (let i = 0; i < finalAbility.data.cooldown; i++) {
    unit.step(i);
    if (finalAbility.progress === 0) {
      break;
    }
  }
}
