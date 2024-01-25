import { z } from "zod";
import { EQUIPMENT_SLOT, EQUIPMENT_TAG, EquipmentData } from "./EquipmentTypes";
import { PossibleModsSchema } from "../Mods/ModsSchema";
import { TriggerEffectsSchema } from "../Perk/PerkSchema";

export const EquipmentDataSchema = z.object({
  name: z.string(),
  tags: z.array(z.nativeEnum(EQUIPMENT_TAG)),
  slots: z.array(z.nativeEnum(EQUIPMENT_SLOT)),
  mods: PossibleModsSchema,
  effects: TriggerEffectsSchema,
}) satisfies z.ZodType<EquipmentData>;
