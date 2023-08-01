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

export enum TARGET {
  STANDARD = "STANDARD",
  FURTHEST = "FURTHEST",
}

// this represents the JSON of the ability
export interface AbilityData {
  name: string;
  type: ABILITY_CATEGORY;
  tags: ABILITY_TAG[];
  target: TARGET;
  baseDamage: number;
  cooldown: number;
}
