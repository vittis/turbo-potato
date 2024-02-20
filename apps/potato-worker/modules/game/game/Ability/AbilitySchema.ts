import { z } from "zod";
import { ABILITY_CATEGORY, ABILITY_TAG, AbilityData } from "./AbilityTypes";
import { TARGET_TYPE } from "../Target/TargetTypes";
import { TriggerEffectsSchema } from "../Perk/PerkSchema";

export const AbilityDataSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(ABILITY_CATEGORY),
  tags: z.array(z.nativeEnum(ABILITY_TAG)),
  target: z.nativeEnum(TARGET_TYPE),
  baseDamage: z.optional(z.number()),
  cooldown: z.number(),
  effects: TriggerEffectsSchema,
}) satisfies z.ZodType<AbilityData>;
