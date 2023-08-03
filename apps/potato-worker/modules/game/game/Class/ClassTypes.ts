import { PossibleMods } from "../Equipment/EquipmentTypes";

export enum UNIT_STATS {
  HEALTH = "HEALTH",
}

export enum STATUS_EFFECTS {
  FAST = "FAST",
  SHIELD = "SHIELD",
  STURDY = "STURDY",
  THORN = "THORN",
  MULTISTRIKE = "MULTISTRIKE",
  POISON = "POISON",
  DAMAGE = "DAMAGE",
  TAUNT = "TAUNT",
}

export enum ABILITY_TARGET {
  STANDARD = "STANDARD",
  FURTHEST = "FURTHEST",
  ADJACENT_UNITS = "ADJACENT_UNITS",
  FRONT_UNIT = "FRONT_UNIT",
  SELF = "SELF",
}

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
    name: STATUS_EFFECTS;
    target: ABILITY_TARGET;
    value: number;
    remove?: boolean;
  }[];
  stats?: {
    name: UNIT_STATS;
    target: ABILITY_TARGET;
    value: number;
    remove?: boolean;
  }[];
}

export interface GrantAbilityModifierPayload {
  name: string;
  modifiers: AbilityModifier;
}

export interface GrantUniqueAbilityModifierPayload {
  name: string;
  nodeName: string;
  unique: boolean;
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
  base: ClassNode[];
  utility: ClassNode[];
  tree: {
    name: string;
    talents: TalentNode[];
  }[];
}
