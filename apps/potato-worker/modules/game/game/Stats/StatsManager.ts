import { MOD_TYPE, Mod } from "../Mods/ModsTypes";
import { STAT, UnitStats } from "./StatsTypes";

type StatsFromMods = Omit<UnitStats, "hp">;

export class StatsManager {
  private stats!: UnitStats;
  private statsFromMods!: StatsFromMods;
  private activeMods: Mod<MOD_TYPE.GRANT_BASE_STAT>[] = [];

  constructor() {
    this.resetStatsFromMods();
  }

  initializeStats(stats: UnitStats) {
    this.stats = stats;
  }

  setBaseHp(hp: number) {
    this.stats.hp = hp;
    this.stats.maxHp = hp;
  }

  // todo better stats management. better merge from all sources
  getStats() {
    return {
      ...this.stats,
      ...this.statsFromMods,
      maxHp: this.stats.maxHp,
      hp: this.stats.hp,
    };
  }

  setStats(newStats: UnitStats) {
    return (this.stats = newStats);
  }

  getStatsFromMods() {
    return this.statsFromMods;
  }

  getActiveMods() {
    return this.activeMods;
  }

  resetStatsFromMods() {
    this.statsFromMods = {
      maxHp: 0,
      attackCooldownModifier: 0,
      attackDamageModifier: 0,
      spellCooldownModifier: 0,
      spellDamageModifier: 0,
      damageReductionModifier: 0,
      shield: 0,
    };
  }

  addMods(mods: Mod<MOD_TYPE.GRANT_BASE_STAT>[]) {
    this.activeMods = [...this.activeMods, ...mods];
    this.applyModsToStats(mods);
  }

  removeMods(mods: Mod<MOD_TYPE.GRANT_BASE_STAT>[]) {
    this.activeMods = this.activeMods.filter(
      (activeMod) => !mods.includes(activeMod)
    );

    // remove the bonuses applied to statsFromMods
    this.applyModsToStats(
      mods.map((mod) => ({
        ...mod,
        payload: { ...mod.payload, value: -mod.payload.value },
      }))
    );
  }

  applyModsToStats(mods: Mod<MOD_TYPE.GRANT_BASE_STAT>[]) {
    mods.forEach((mod) => {
      const { stat, value } = mod.payload;
      switch (stat) {
        case STAT.HEALTH:
          this.statsFromMods.maxHp += value;
          break;
        case STAT.ATTACK_COOLDOWN:
          this.statsFromMods.attackCooldownModifier += value;
          break;
        case STAT.ATTACK_DAMAGE:
          this.statsFromMods.attackDamageModifier += value;
          break;
        case STAT.SPELL_COOLDOWN:
          this.statsFromMods.spellCooldownModifier += value;
          break;
        case STAT.SPELL_DAMAGE:
          this.statsFromMods.spellDamageModifier += value;
          break;
        case STAT.DAMAGE_REDUCTION:
          this.statsFromMods.damageReductionModifier += value;
          break;
      }
    });
  }
}
