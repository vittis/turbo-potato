import { MOD_TYPE, Mod } from "../Mods/ModsTypes";
import { STAT, UnitStats } from "./StatsTypes";

export class StatsManager {
  stats!: UnitStats;
  activeMods: Mod<MOD_TYPE.GRANT_BASE_STAT>[] = [];

  constructor() {}

  initializeStats(stats: UnitStats) {
    this.stats = stats;
  }

  getStats() {
    return this.stats;
  }

  setStats(newStats: UnitStats) {
    return (this.stats = newStats);
  }

  applyStatsMods(mods: Mod<MOD_TYPE.GRANT_BASE_STAT>[]) {
    mods.forEach((mod) => {
      const { stat, value } = mod.payload;
      switch (stat) {
        case STAT.HEALTH:
          this.stats.maxHp += value;
          this.stats.hp = this.stats.maxHp;
          break;
        case STAT.ATTACK_COOLDOWN:
          this.stats.attackCooldownModifier += value;
          break;
        case STAT.ATTACK_DAMAGE:
          this.stats.attackDamageModifier += value;
          break;
        case STAT.SPELL_COOLDOWN:
          this.stats.spellCooldownModifier += value;
          break;
        case STAT.SPELL_DAMAGE:
          this.stats.spellDamageModifier += value;
          break;
      }
    });
  }

  // todo is this needed
  /*
  setHp(hp: number) {
    this.stats.hp = hp;
  }
  */
}
