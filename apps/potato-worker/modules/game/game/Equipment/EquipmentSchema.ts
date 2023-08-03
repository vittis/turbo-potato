import { z } from "zod";
import { EQUIPMENT_SLOT, EquipmentData, IMPLICIT_TYPE } from "./EquipmentTypes";

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

export const EquipmentDataSchema = z.object({
  name: z.string(),
  allowedSlots: z.array(z.nativeEnum(EQUIPMENT_SLOT)),
  implicits: z.array(
    z.union([
      z.object({
        type: z.literal(IMPLICIT_TYPE.GRANT_ABILITY),
        payload: GrantAbilityPayloadSchema,
      }),
      z.object({
        type: z.literal(IMPLICIT_TYPE.GRANT_PERK),
        payload: GrantPerkPayloadSchema,
      }),
      z.object({
        type: z.literal(IMPLICIT_TYPE.GRANT_BASE_STAT),
        payload: GrantBaseStatPayloadSchema,
      }),
    ])
  ),
}) satisfies z.ZodType<EquipmentData>;
