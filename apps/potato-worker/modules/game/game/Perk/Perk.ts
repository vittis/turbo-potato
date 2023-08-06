import { PerkDataSchema } from "./PerkSchema";
import { PerkData } from "./PerkTypes";

export class Perk {
  data: PerkData;

  constructor(data?: PerkData) {
    const parsedData = PerkDataSchema.parse(data);
    this.data = parsedData;
  }
}
