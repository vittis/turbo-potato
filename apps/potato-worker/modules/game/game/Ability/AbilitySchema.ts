import { z } from "zod";
import {
  ABILITY_CATEGORY,
  ABILITY_TAG,
  AbilityData,
  TARGET,
} from "./AbilityTypes";

export const AbilityDataSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(ABILITY_CATEGORY),
  tags: z.array(z.nativeEnum(ABILITY_TAG)),
  target: z.nativeEnum(TARGET),
  baseDamage: z.number(),
  cooldown: z.number(),
}) satisfies z.ZodType<AbilityData>;
