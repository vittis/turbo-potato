import { AbilityData } from "./AbilityTypes";
import { AbilityDataSchema } from "./AbilitySchema";
import { Unit } from "../Unit/Unit";
import { UseAbilityEvent } from "../Event/EventTypes";

export class Ability {
  data: AbilityData;
  progress = 0;

  constructor(data?: AbilityData) {
    const parsedData = AbilityDataSchema.parse(data);
    this.data = parsedData;
  }

  step() {
    this.progress += 1;
  }

  canActivate() {
    return this.progress >= this.data.cooldown;
  }

  //@ts-expect-error
  use(unit: Unit): UseAbilityEvent {
    this.progress = 0;
  }
}
