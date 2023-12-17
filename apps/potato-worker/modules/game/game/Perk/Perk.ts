import { nanoid } from "nanoid";
import { PerkDataSchema } from "./PerkSchema";
import { PERK_TYPE, PerkData } from "./PerkTypes";
import { TRIGGER_EFFECT_TYPE } from "../Trigger/TriggerTypes";

export class Perk {
  id: string;
  data: PerkData;
  tier: number = 1;

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

  getTriggerEffects() {
    return this.data.effects.map((effect) => {
      // todo suit for all cases
      if (effect.type === TRIGGER_EFFECT_TYPE.STATUS_EFFECT) {
        return {
          ...effect,
          payload: effect.payload.map((statusPayload) => {
            const tierMatch = this.data.tiers.find(
              (tier) => tier.name === statusPayload.name
            );
            const tierMatchValue = tierMatch?.values?.[this.tier - 1];
            if (tierMatchValue === undefined) {
              throw Error(`Tier match not found for perk: ${this.data.name}`);
            }

            return {
              ...statusPayload,
              quantity:
                statusPayload.quantity === "DYNAMIC"
                  ? tierMatchValue
                  : statusPayload.quantity,
            };
          }),
        };
      }
      return effect;
    });
  }
}
