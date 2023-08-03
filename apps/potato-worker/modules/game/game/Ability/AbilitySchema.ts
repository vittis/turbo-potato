import { z } from "zod";
import { ABILITY_CATEGORY, ABILITY_TAG, AbilityData } from "./AbilityTypes";
import { TARGET_TYPE } from "./TargetTypes";

export const AbilityDataSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(ABILITY_CATEGORY),
  tags: z.array(z.nativeEnum(ABILITY_TAG)),
  target: z.nativeEnum(TARGET_TYPE),
  baseDamage: z.number(),
  cooldown: z.number(),
}) satisfies z.ZodType<AbilityData>;
