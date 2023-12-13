import { nanoid } from "nanoid";
import { PerkDataSchema } from "./PerkSchema";
import { PerkData } from "./PerkTypes";

export class Perk {
  id: string;
  data: PerkData;

  constructor(data?: PerkData) {
    if (!data) {
      throw Error(
        "Perk data is undefined. If running from test make sure it's defined in mock files"
      );
    }
    const parsedData = PerkDataSchema.parse(data);
    this.data = parsedData;
    this.id = nanoid(8);
  }
}
