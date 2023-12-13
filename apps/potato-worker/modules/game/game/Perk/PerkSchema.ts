import { z } from "zod";
import { PERK_TYPE, PerkData } from "./PerkTypes";
import { TRIGGER, TRIGGER_EFFECT_TYPE } from "../Trigger/TriggerTypes";
import { TARGET_TYPE } from "../Target/TargetTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";

const PerkTierScaleSchema = z.object({
  name: z.string(),
  values: z.array(z.number()),
});

export const TriggerEffectsSchema = z.array(
  z.object({
    type: z.literal(TRIGGER_EFFECT_TYPE.GRANT_STATUS_EFFECT),
    trigger: z.nativeEnum(TRIGGER),
    target: z.nativeEnum(TARGET_TYPE),
    payload: z.array(
      z.object({
        name: z.nativeEnum(STATUS_EFFECT),
        quantity: z.union([z.number(), z.literal("DYNAMIC")]),
      })
    ),
  })
);

export const PerkDataSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(PERK_TYPE),
  tiers: z.array(PerkTierScaleSchema),
  effects: TriggerEffectsSchema,
}) satisfies z.ZodType<PerkData>;
