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

export enum TALENT_CATEGORY {
  GRANT_ABILITY = "GRANT_ABILITY",
  GRANT_PERK = "GRANT_PERK",
  ABILITY_MODIFIER = "ABILITY_MODIFIER",
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

export interface ClassNode {
  type: TALENT_CATEGORY;
  payload: {
    name: string;
    tier?: number; // if its a perk
    nodeName?: string; // if its an unique ability modifier
    unique?: boolean; // if its an unique ability modifier
    modifiers?: AbilityModifier; // if its an ability modifier
  };
  description: string;
}

export interface TalentNode extends ClassNode {
  tier: number;
  req: number;
}

// this represents the JSON of the class
export interface ClassData {
  name: string;
  implicits: ClassNode[];
  utility: ClassNode[];
  tree: {
    name: string;
    talents: ClassNode[];
  }[];
}
