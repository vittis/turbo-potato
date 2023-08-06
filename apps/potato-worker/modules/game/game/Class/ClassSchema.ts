import { z } from "zod";
import {
  ABILITY_TARGET,
  AbilityModifier,
  ClassNode,
  TalentNode,
  ClassData,
} from "./ClassTypes";
import { PossibleModsSchema } from "../Mods/ModsSchema";
import { STAT } from "../Stats/StatsTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";

// todo better type
export const AbilityModifierSchema = z.object({
  trigger: z
    .array(
      z.object({
        name: z.string(),
        remove: z.boolean().optional(),
      })
    )
    .optional(),
  target: z
    .array(
      z.object({
        name: z.string(),
        remove: z.boolean().optional(),
      })
    )
    .optional(),
  status_effect: z
    .array(
      z.object({
        name: z.nativeEnum(STATUS_EFFECT),
        target: z.nativeEnum(ABILITY_TARGET),
        value: z.number(),
        remove: z.boolean().optional(),
      })
    )
    .optional(),
  stats: z
    .array(
      z.object({
        name: z.nativeEnum(STAT),
        target: z.nativeEnum(ABILITY_TARGET),
        value: z.number(),
        remove: z.boolean().optional(),
      })
    )
    .optional(),
}) satisfies z.ZodType<AbilityModifier>;

export const ClassNodeSchema = z.object({
  mods: PossibleModsSchema,
  description: z.string(),
}) satisfies z.ZodType<ClassNode>;

export const TalentNodeSchema = ClassNodeSchema.extend({
  tier: z.number(),
  req: z.number(),
}) satisfies z.ZodType<TalentNode>;

export const ClassDataSchema = z.object({
  name: z.string(),
  base: z.array(ClassNodeSchema),
  utility: z.array(ClassNodeSchema),
  tree: z.array(
    z.object({
      name: z.string(),
      talents: z.array(TalentNodeSchema),
    })
  ),
}) satisfies z.ZodType<ClassData>;
