import { z } from "zod";
import { EQUIPMENT_SLOT, EquipmentData } from "./EquipmentTypes";
import { PossibleModsSchema } from "../Mods/ModsSchema";

export const EquipmentDataSchema = z.object({
  name: z.string(),
  allowedSlots: z.array(z.nativeEnum(EQUIPMENT_SLOT)),
  mods: PossibleModsSchema,
}) satisfies z.ZodType<EquipmentData>;
