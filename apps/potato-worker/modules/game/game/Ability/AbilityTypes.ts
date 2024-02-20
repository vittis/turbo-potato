import { PossibleTriggerEffect, TriggerEffect } from "../Trigger/TriggerTypes";
import { TARGET_TYPE } from "../Target/TargetTypes";

export enum ABILITY_CATEGORY {
  ATTACK = "ATTACK",
  SPELL = "SPELL",
}

export enum ABILITY_TAG {
  WEAPON_ABILITY = "WEAPON_ABILITY",
  USE_WEAPON_ABILITY = "USE_WEAPON_ABILITY",
  SUMMON = "SUMMON",
  BUFF = "BUFF",
}

// this represents the JSON of the ability
export interface AbilityData {
  name: string;
  type: ABILITY_CATEGORY;
  tags: ABILITY_TAG[];
  target: TARGET_TYPE;
  baseDamage?: number;
  cooldown: number;
  effects: PossibleTriggerEffect[];
}
