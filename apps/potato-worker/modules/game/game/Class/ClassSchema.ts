import { z } from "zod";
import { ClassNode, TalentNode, ClassData } from "./ClassTypes";
import { PossibleModsSchema } from "../Mods/ModsSchema";

const ClassNodeSchema = z.object({
  mods: PossibleModsSchema,
  description: z.string(),
}) satisfies z.ZodType<ClassNode>;

const TalentNodeSchema = ClassNodeSchema.extend({
  tier: z.number(),
  req: z.number(),
}) satisfies z.ZodType<TalentNode>;

export const ClassDataSchema = z.object({
  name: z.string(),
  hp: z.number(),
  base: z.array(ClassNodeSchema),
  utility: z.array(ClassNodeSchema),
  tree: z.array(
    z.object({
      name: z.string(),
      talents: z.array(TalentNodeSchema),
    })
  ),
}) satisfies z.ZodType<ClassData>;
