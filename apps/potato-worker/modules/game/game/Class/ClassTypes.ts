import { PossibleMods } from "../Mods/ModsTypes";
import { STAT } from "../Stats/StatsTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";

export enum ABILITY_TARGET {
  STANDARD = "STANDARD",
  FURTHEST = "FURTHEST",
  ADJACENT_UNITS = "ADJACENT_UNITS",
  FRONT_UNIT = "FRONT_UNIT",
  SELF = "SELF",
}

// todo better type for this
export interface AbilityModifier {
  trigger?: {
    name: string;
    remove?: boolean;
  }[];
  target?: {
    name: string;
    remove?: boolean;
  }[];
  status_effect?: {
    name: STATUS_EFFECT;
    target: ABILITY_TARGET;
    value: number;
    remove?: boolean;
  }[];
  stats?: {
    name: STAT;
    target: ABILITY_TARGET;
    value: number;
    remove?: boolean;
  }[];
}

export interface ClassNode {
  mods: PossibleMods;
  description: string;
}

export interface TalentNode extends ClassNode {
  tier: number;
  req: number;
}

// this represents the JSON of the class
export interface ClassData {
  name: string;
  hp: number;
  base: ClassNode[];
  utility: ClassNode[];
  tree: {
    name: string;
    talents: TalentNode[];
  }[];
}
