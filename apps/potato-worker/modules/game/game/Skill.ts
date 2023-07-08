import { Unit } from "./Unit";

export enum STATUS_EFFECT_TYPE {
  REGEN = "REGEN",
  FAST = "FAST", // BUFF ATTACK SPEED
  STRONG = "STRONG", // BUFF ATTACK DAMAGE
  ENERGIZED = "ENERGIZED", // BUFF SKILL REGEN
  POISON = "POISON",
  BLEED = "BLEED",
  SLOW = "SLOW",
  VULNERABLE = "VULNERABLE",
  STURDY = "STURDY",
  THORN = "THORN",
  TAUNT = "TAUNT",
}

export enum DISABLE_TYPE {
  STUN = "STUN",
}

export interface StatusEffect {
  type: STATUS_EFFECT_TYPE;
  value: number;
}

export interface Disable {
  type: DISABLE_TYPE;
  duration: number;
}

export enum SKILL {
  HEALING_WORD = "Healing Word",
  POWERSHOT = "Powershot",
  HEAD_CRUSH = "Head Crush",
}

export class Skill {
  skillCost = 1000;

  afterExecute(unit: Unit) {
    unit.stats.sp = 0;
  }
}
