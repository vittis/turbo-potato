export enum STAT {
  HEALTH = "HEALTH",
  ATTACK_DAMAGE = "ATTACK_DAMAGE",
  ATTACK_COOLDOWN = "ATTACK_COOLDOWN",
  SPELL_DAMAGE = "SPELL_DAMAGE",
  SPELL_COOLDOWN = "SPELL_COOLDOWN",
  DAMAGE_REDUCTION = "DAMAGE_REDUCTION",
}

export interface UnitStats {
  hp: number;
  maxHp: number;
  shield: number;
  attackDamageModifier: number;
  attackCooldownModifier: number;
  spellDamageModifier: number;
  spellCooldownModifier: number;
  damageReductionModifier: number;
}
