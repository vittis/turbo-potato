import { MOD_TYPE, Mod } from "../Mods/ModsTypes";
import { StatsManager } from "./StatsManager";
import { STAT } from "./StatsTypes";

const statsMock = {
  hp: 200,
  maxHp: 200,
  shield: 0,
  attackCooldownModifier: 0,
  attackDamageModifier: 0,
  spellCooldownModifier: 0,
  spellDamageModifier: 0,
  damageReductionModifier: 0,
};

const modsMock: Mod<MOD_TYPE.GRANT_BASE_STAT>[] = [
  {
    type: MOD_TYPE.GRANT_BASE_STAT,
    payload: {
      stat: STAT.ATTACK_DAMAGE,
      value: 5,
    },
  },
  {
    type: MOD_TYPE.GRANT_BASE_STAT,
    payload: {
      stat: STAT.DAMAGE_REDUCTION,
      value: 10,
    },
  },
];

describe("Stats", () => {
  describe("StatManager", () => {
    test("initialize correctly", () => {
      const manager = new StatsManager();
      manager.initializeStats(statsMock);

      expect(manager.getStatsFromMods()).toBeDefined();
      expect(manager.getActiveMods()).toHaveLength(0);

      expect(manager.getStats()).toEqual(statsMock);
    });

    test("add mod", () => {
      const manager = new StatsManager();
      manager.addMods(modsMock);

      expect(manager.getActiveMods()).toEqual(modsMock);
      expect(manager.getStatsFromMods()).toEqual({
        attackDamageModifier: 5,
        attackCooldownModifier: 0,
        damageReductionModifier: 10,
        maxHp: 0,
        shield: 0,
        spellCooldownModifier: 0,
        spellDamageModifier: 0,
      });
    });

    test("remove mod", () => {
      const manager = new StatsManager();
      manager.addMods(modsMock);
      manager.removeMods([modsMock[0]]);
      expect(manager.getActiveMods()).toEqual([modsMock[1]]);

      expect(manager.getStatsFromMods()).toEqual({
        attackDamageModifier: 0,
        attackCooldownModifier: 0,
        damageReductionModifier: 10,
        maxHp: 0,
        shield: 0,
        spellCooldownModifier: 0,
        spellDamageModifier: 0,
      });
    });
  });
});
