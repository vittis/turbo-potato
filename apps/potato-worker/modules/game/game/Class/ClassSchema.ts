import { z } from "zod";
import {
  UNIT_STATS,
  STATUS_EFFECTS,
  ABILITY_TARGET,
  TALENT_CATEGORY,
  AbilityModifier,
  ClassNode,
  TalentNode,
  ClassData,
} from "./ClassTypes";

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
        name: z.nativeEnum(STATUS_EFFECTS),
        target: z.nativeEnum(ABILITY_TARGET),
        value: z.number(),
        remove: z.boolean().optional(),
      })
    )
    .optional(),
  stats: z
    .array(
      z.object({
        name: z.nativeEnum(UNIT_STATS),
        target: z.nativeEnum(ABILITY_TARGET),
        value: z.number(),
        remove: z.boolean().optional(),
      })
    )
    .optional(),
}) satisfies z.ZodType<AbilityModifier>;

export const ClassNodeSchema = z.object({
  type: z.nativeEnum(TALENT_CATEGORY),
  payload: z.object({
    name: z.string(),
    tier: z.number().optional(),
    nodeName: z.string().optional(),
    unique: z.boolean().optional(),
    modifiers: AbilityModifierSchema.optional(),
  }),
  description: z.string(),
}) satisfies z.ZodType<ClassNode>;

export const TalentNodeSchema = ClassNodeSchema.extend({
  tier: z.number(),
  req: z.number(),
}) satisfies z.ZodType<TalentNode>;

export const ClassDataSchema = z.object({
  name: z.string(),
  implicits: z.array(ClassNodeSchema),
  utility: z.array(ClassNodeSchema),
  tree: z.array(
    z.object({
      name: z.string(),
      talents: z.array(TalentNodeSchema),
    })
  ),
}) satisfies z.ZodType<ClassData>;