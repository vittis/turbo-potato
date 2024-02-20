import { z } from "zod";
import { PERK_TYPE, PerkData } from "./PerkTypes";
import {
  BOARD_POSITION,
  EFFECT_CONDITION_TYPE,
  TRIGGER,
  TRIGGER_EFFECT_TYPE,
} from "../Trigger/TriggerTypes";
import { TARGET_TYPE } from "../Target/TargetTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { EQUIPMENT_SLOT, EQUIPMENT_TAG } from "../Equipment/EquipmentTypes";

const PositionEffectCondition = z.object({
  type: z.literal(EFFECT_CONDITION_TYPE.POSITION),
  payload: z.object({
    target: z.nativeEnum(TARGET_TYPE),
    position: z.nativeEnum(BOARD_POSITION),
  }),
});

const EquipmentEffectCondition = z.object({
  type: z.literal(EFFECT_CONDITION_TYPE.EQUIPMENT),
  payload: z.object({
    target: z.nativeEnum(TARGET_TYPE),
    slots: z.array(z.nativeEnum(EQUIPMENT_SLOT)),
    tags: z.array(z.nativeEnum(EQUIPMENT_TAG)),
  }),
});

const EffectConditionsSchema = z.array(
  z.union([PositionEffectCondition, EquipmentEffectCondition])
);

const PerkTierScaleSchema = z.object({
  name: z.string(),
  values: z.array(z.number()),
});

const StatusTriggerEffect = z.object({
  type: z.literal(TRIGGER_EFFECT_TYPE.STATUS_EFFECT),
  trigger: z.nativeEnum(TRIGGER),
  target: z.nativeEnum(TARGET_TYPE),
  conditions: EffectConditionsSchema,
  payload: z.array(
    z.object({
      name: z.nativeEnum(STATUS_EFFECT),
      quantity: z.union([z.number(), z.literal("DYNAMIC")]),
    })
  ),
});

const DamageTriggerEffect = z.object({
  type: z.literal(TRIGGER_EFFECT_TYPE.DAMAGE),
  trigger: z.nativeEnum(TRIGGER),
  target: z.nativeEnum(TARGET_TYPE),
  conditions: EffectConditionsSchema,
  payload: z.object({ value: z.number() }),
});

const ShieldTriggerEffect = z.object({
  type: z.literal(TRIGGER_EFFECT_TYPE.SHIELD),
  trigger: z.nativeEnum(TRIGGER),
  target: z.nativeEnum(TARGET_TYPE),
  conditions: EffectConditionsSchema,
  payload: z.object({ value: z.number() }),
});

const HealTriggerEffect = z.object({
  type: z.literal(TRIGGER_EFFECT_TYPE.HEAL),
  trigger: z.nativeEnum(TRIGGER),
  target: z.nativeEnum(TARGET_TYPE),
  conditions: EffectConditionsSchema,
  payload: z.object({ value: z.number() }),
});

export const TriggerEffectsSchema = z.array(
  z.union([
    StatusTriggerEffect,
    DamageTriggerEffect,
    ShieldTriggerEffect,
    HealTriggerEffect,
  ])
);

export const PerkDataSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(PERK_TYPE),
  tiers: z.array(PerkTierScaleSchema),
  effects: TriggerEffectsSchema,
}) satisfies z.ZodType<PerkData>;
