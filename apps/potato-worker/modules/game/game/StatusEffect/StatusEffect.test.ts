jest.mock("../data");

import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Class } from "../Class/Class";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { sortAndExecuteEvents } from "../Event/EventUtils";
import { MOD_TYPE, Mod } from "../Mods/ModsTypes";
import { Unit } from "../Unit/Unit";
import { Classes, Weapons } from "../data";
import { StatusEffectManager } from "./StatusEffectManager";
import { STATUS_EFFECT } from "./StatusEffectTypes";

/* const modsMock: Mod<MOD_TYPE.GRANT_PERK>[] = [
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
]; */

describe("StatusEffect", () => {
  describe("StatusEffectManager", () => {
    test("applies status effect", () => {
      const manager = new StatusEffectManager();

      manager.applyStatusEffect({
        name: STATUS_EFFECT.ATTACK_POWER,
        quantity: 10,
      });

      expect(manager.activeStatusEffects).toEqual([
        {
          name: STATUS_EFFECT.ATTACK_POWER,
          quantity: 10,
        },
      ]);
    });

    test("applies multiple status effect", () => {
      const manager = new StatusEffectManager();

      manager.applyStatusEffect({
        name: STATUS_EFFECT.ATTACK_POWER,
        quantity: 10,
      });

      manager.applyStatusEffect({
        name: STATUS_EFFECT.SPELL_POTENCY,
        quantity: 10,
      });

      expect(manager.activeStatusEffects).toEqual([
        {
          name: STATUS_EFFECT.ATTACK_POWER,
          quantity: 10,
        },
        {
          name: STATUS_EFFECT.SPELL_POTENCY,
          quantity: 10,
        },
      ]);
    });

    test("applying same status effect adds to quantity", () => {
      const manager = new StatusEffectManager();

      manager.applyStatusEffect({
        name: STATUS_EFFECT.ATTACK_POWER,
        quantity: 10,
      });

      manager.applyStatusEffect({
        name: STATUS_EFFECT.ATTACK_POWER,
        quantity: 20,
      });

      expect(manager.activeStatusEffects).toEqual([
        {
          name: STATUS_EFFECT.ATTACK_POWER,
          quantity: 30,
        },
      ]);
    });

    test("removes one stack", () => {
      const manager = new StatusEffectManager();

      manager.applyStatusEffect({
        name: STATUS_EFFECT.ATTACK_POWER,
        quantity: 2,
      });

      manager.removeStacks(STATUS_EFFECT.ATTACK_POWER, 1);

      expect(manager.activeStatusEffects).toEqual([
        {
          name: STATUS_EFFECT.ATTACK_POWER,
          quantity: 1,
        },
      ]);

      manager.removeStacks(STATUS_EFFECT.ATTACK_POWER, 1);

      expect(manager.activeStatusEffects).toEqual([]);
    });

    test("removes all stacks", () => {
      const manager = new StatusEffectManager();

      manager.applyStatusEffect({
        name: STATUS_EFFECT.ATTACK_POWER,
        quantity: 10,
      });

      manager.removeAllStacks(STATUS_EFFECT.ATTACK_POWER);

      expect(manager.activeStatusEffects).toEqual([]);
    });
  });

  describe("In battle", () => {
    test("should apply status effect on hit", () => {
      const bm = new BoardManager();
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
      const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
      bm.addToBoard(unit);
      bm.addToBoard(unit2);

      unit.equip(new Equipment(Weapons.ShortBow), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.equips[0].slot).toBe(EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.abilities).toHaveLength(1);

      const ability = unit.abilities[0];

      for (let i = 0; i < ability.data.cooldown; i++) {
        unit.step(i);
      }

      // expect(ability.progress).toBe(0);
      sortAndExecuteEvents(bm, unit.serializeEvents());

      expect(unit2.stats.hp).not.toBe(unit2.stats.maxHp);
      expect(unit2.statusEffects).toEqual([
        {
          name: STATUS_EFFECT.VULNERABLE,
          quantity: 10,
        },
      ]);
    });

    test("should receive more damage when hit with vulnerable", () => {
      const bm = new BoardManager();
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
      const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
      bm.addToBoard(unit);
      bm.addToBoard(unit2);

      unit.equip(new Equipment(Weapons.ShortBow), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.equips[0].slot).toBe(EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.abilities).toHaveLength(1);

      const ability = unit.abilities[0];

      for (let i = 0; i < ability.data.cooldown; i++) {
        unit.step(i);
      }

      sortAndExecuteEvents(bm, unit.serializeEvents());

      expect(unit2.stats.hp).toBe(unit2.stats.maxHp - 40);
      expect(unit2.statusEffects).toEqual([
        {
          name: STATUS_EFFECT.VULNERABLE,
          quantity: 10,
        },
      ]);
      expect(unit2.stats.damageReductionModifier).toBe(-10);

      for (let i = 0; i < ability.data.cooldown; i++) {
        unit.step(i);
      }
      sortAndExecuteEvents(bm, unit.serializeEvents());

      expect(unit2.stats.hp).toBe(unit2.stats.maxHp - 40 - 44);
      expect(unit2.statusEffects).toEqual([
        {
          name: STATUS_EFFECT.VULNERABLE,
          quantity: 15,
        },
      ]);
    });

    test.only("should work attacking multiple times", () => {
      const bm = new BoardManager();
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
      const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
      bm.addToBoard(unit);
      bm.addToBoard(unit2);

      unit.equip(new Equipment(Weapons.ShortBow), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.equips[0].slot).toBe(EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.abilities).toHaveLength(1);

      const ability = unit.abilities[0];

      expect(unit2.statusEffects).toEqual([]);

      for (let i = 0; i < ability.data.cooldown; i++) {
        unit.step(i);
      }
      sortAndExecuteEvents(bm, unit.serializeEvents());
      expect(unit2.statusEffects).toEqual([
        {
          name: STATUS_EFFECT.VULNERABLE,
          quantity: 10,
        },
      ]);
      expect(unit2.stats.hp).toBe(unit2.stats.maxHp - 100);

      for (let i = 0; i < ability.data.cooldown; i++) {
        unit.step(i);
      }
      sortAndExecuteEvents(bm, unit.serializeEvents());

      expect(unit2.statusEffects).toEqual([
        {
          name: STATUS_EFFECT.VULNERABLE,
          quantity: 15,
        },
      ]);
      expect(unit2.stats.hp).toBe(unit2.stats.maxHp - 100 - 110);

      for (let i = 0; i < ability.data.cooldown; i++) {
        unit.step(i);
      }
      sortAndExecuteEvents(bm, unit.serializeEvents());

      expect(unit2.statusEffects).toEqual([
        {
          name: STATUS_EFFECT.VULNERABLE,
          quantity: 20,
        },
      ]);
      expect(unit2.stats.hp).toBe(unit2.stats.maxHp - 100 - 110 - 125);

      for (let i = 0; i < ability.data.cooldown; i++) {
        unit.step(i);
      }
      sortAndExecuteEvents(bm, unit.serializeEvents());

      expect(unit2.statusEffects).toEqual([
        {
          name: STATUS_EFFECT.VULNERABLE,
          quantity: 25,
        },
      ]);
      expect(unit2.stats.hp).toBe(unit2.stats.maxHp - 100 - 110 - 125);
    });
  });
});
