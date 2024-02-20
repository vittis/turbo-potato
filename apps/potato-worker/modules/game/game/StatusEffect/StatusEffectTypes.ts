export enum STATUS_EFFECT {
  ATTACK_POWER = "ATTACK_POWER",
  FAST = "FAST",
  FOCUS = "FOCUS",
  MULTISTRIKE = "MULTISTRIKE",
  POISON = "POISON",
  REGEN = "REGEN",
  SLOW = "SLOW",
  SPELL_POTENCY = "SPELL_POTENCY",
  STURDY = "STURDY",
  TAUNT = "TAUNT",
  THORN = "THORN",
  VULNERABLE = "VULNERABLE",
}

export interface ActiveStatusEffect {
  name: STATUS_EFFECT;
  quantity: number;
}
