import { BoardManager } from "./BoardManager";
import { Unit } from "./Unit";

/* export enum SKILL_EFFECT {
  DAMAGE = "DAMAGE",
  HEAL = "HEAL",
  STUN = "STUN",
}

export enum SKILL_TARGET {
  SELF = "SELF",
  SINGLE_ENEMY = "SINGLE_ENEMY",
  SINGLE_ALLY = "SINGLE_ALLY",
  AREA_LINE = "AREA_LINE",
  AREA_SQUARE = "AREA_SQUARE",
  ALL_ALLIES = "ALL_ALLIES",
  ALL_ENEMIES = "ALL_ENEMIES",
} */

export class Skill {
  skillCost = 1000;

  afterExecute(unit: Unit) {
    unit.stats.sp = 0;
  }
}
