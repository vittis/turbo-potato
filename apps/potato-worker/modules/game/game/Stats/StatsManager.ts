import { UnitStats } from "./StatsTypes";

export class StatsManager {
  stats!: UnitStats;

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

  // todo is this needed
  /*
  setHp(hp: number) {
    this.stats.hp = hp;
  }
  */
}
