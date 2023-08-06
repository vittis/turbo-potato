import { AbilityData } from "./AbilityTypes";
import { AbilityDataSchema } from "./AbilitySchema";
import { Unit } from "../Unit/Unit";

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

  use(unit: Unit) {
    this.progress = 0;
  }
}
