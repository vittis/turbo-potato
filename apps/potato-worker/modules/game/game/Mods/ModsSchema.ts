import { z } from "zod";
import {
  GrantAbilityModifierPayload,
  GrantAbilityPayload,
  GrantBaseStatPayload,
  GrantPerkPayload,
  MOD_TYPE,
  PossibleMods,
} from "./ModsTypes";
import { AbilityModifierSchema } from "../Class/ClassSchema";
import { STAT } from "../Stats/StatsTypes";

const GrantAbilityPayloadSchema = z.object({
  name: z.string(),
}) satisfies z.ZodType<GrantAbilityPayload>;

const GrantPerkPayloadSchema = z.object({
  name: z.string(),
  tier: z.optional(z.number()),
}) satisfies z.ZodType<GrantPerkPayload>;

const GrantBaseStatPayloadSchema = z.object({
  stat: z.nativeEnum(STAT),
  value: z.number(),
}) satisfies z.ZodType<GrantBaseStatPayload>;

const GrantAbilityModifierPayload = z.union([
  z.object({
    name: z.string(),
    modifiers: AbilityModifierSchema,
  }),
  z.object({
    name: z.string(),
    nodeName: z.string(),
    unique: z.boolean(),
  }),
]) satisfies z.ZodType<GrantAbilityModifierPayload>;

export const PossibleModsSchema = z.array(
  z.union([
    z.object({
      type: z.literal(MOD_TYPE.GRANT_ABILITY),
      payload: GrantAbilityPayloadSchema,
    }),
    z.object({
      type: z.literal(MOD_TYPE.GRANT_PERK),
      payload: GrantPerkPayloadSchema,
    }),
    z.object({
      type: z.literal(MOD_TYPE.GRANT_BASE_STAT),
      payload: GrantBaseStatPayloadSchema,
    }),
    z.object({
      type: z.literal(MOD_TYPE.GRANT_ABILITY_MODIFIER),
      payload: GrantAbilityModifierPayload,
    }),
  ])
) satisfies z.ZodType<PossibleMods>;
