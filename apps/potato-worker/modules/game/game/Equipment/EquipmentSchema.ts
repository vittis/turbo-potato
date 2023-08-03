import { z } from "zod";
import { EQUIPMENT_SLOT, EquipmentData, MOD_TYPE } from "./EquipmentTypes";
import { AbilityModifierSchema } from "../Class/ClassSchema";

const GrantAbilityPayloadSchema = z.object({
  name: z.string(),
});

const GrantPerkPayloadSchema = z.object({
  name: z.string(),
  tier: z.optional(z.number()),
});

const GrantBaseStatPayloadSchema = z.object({
  stat: z.string(),
  value: z.number(),
});

const GrantAbilityModifierPayload = z.union([
  z.object({
    name: z.string(),
    modifiers: AbilityModifierSchema,
  }),
  z.object({
    name: z.string(),
    nodeName: z.string(),
    unique: z.literal(true),
  }),
]);

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
);

export const EquipmentDataSchema = z.object({
  name: z.string(),
  allowedSlots: z.array(z.nativeEnum(EQUIPMENT_SLOT)),
  mods: PossibleModsSchema,
}) satisfies z.ZodType<EquipmentData>;
