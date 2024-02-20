import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { sortAndExecuteEvents } from "../Event/EventUtils";
import { TRIGGER } from "../Trigger/TriggerTypes";
import { Unit } from "../Unit/Unit";
import { useAbility } from "../_tests_/testsUtils";
import { Weapons } from "../data";
import { StatusEffectManager } from "./StatusEffectManager";
import { STATUS_EFFECT } from "./StatusEffectTypes";

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

  describe("VULNERABLE (Shortbow)", () => {
    test("should apply VULNERABLE status effect on hit", () => {
      const bm = new BoardManager();
      const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
      unit1.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
      bm.addToBoard(unit1);

      const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
      bm.addToBoard(unit2);

      useAbility(unit1);
      sortAndExecuteEvents(bm, unit1.serializeEvents());

      expect(unit2.statusEffects).toEqual([
        {
          name: STATUS_EFFECT.VULNERABLE,
          quantity: 15,
        },
      ]);
    });

    test("should modify damageReductionModifier when with VULNERABLE", () => {
      const bm = new BoardManager();
      const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
      unit1.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
      bm.addToBoard(unit1);

      const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
      bm.addToBoard(unit2);

      useAbility(unit1);
      sortAndExecuteEvents(bm, unit1.serializeEvents());

      expect(unit2.stats.damageReductionModifier).toBe(-15);
    });

    // todo this mechanic might not exist anymore
    test.skip("should decrease VULNERABLE stacks when hit", () => {
      const bm = new BoardManager();
      const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
      unit1.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
      bm.addToBoard(unit1);

      const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
      bm.addToBoard(unit2);

      useAbility(unit1);
      sortAndExecuteEvents(bm, unit1.serializeEvents());

      expect(unit2.statusEffects).toEqual([
        {
          name: STATUS_EFFECT.VULNERABLE,
          quantity: 15,
        },
      ]);

      useAbility(unit1);
      sortAndExecuteEvents(bm, unit1.serializeEvents());

      expect(unit2.statusEffects).toEqual([
        {
          name: STATUS_EFFECT.VULNERABLE,
          quantity: 25, // 15 + 15 - 5
        },
      ]);
    });
  });

  describe("ATTACK_POWER (Axe)", () => {
    test("should apply ATTACK_POWER status effect on hit", () => {
      const bm = new BoardManager();
      const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
      unit1.equip(new Equipment(Weapons.Axe), EQUIPMENT_SLOT.MAIN_HAND);
      bm.addToBoard(unit1);

      const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
      bm.addToBoard(unit2);

      useAbility(unit1);
      sortAndExecuteEvents(bm, unit1.serializeEvents());

      expect(unit1.statusEffects).toEqual([
        {
          name: STATUS_EFFECT.ATTACK_POWER,
          quantity: 10,
        },
      ]);
    });
  });

  describe("VULNERABLE (Axe)", () => {
    // todo this mechanic might not exist anymore
    test.skip("should remove all VULNERABLE when hit", () => {
      const bm = new BoardManager();
      const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
      unit1.equip(new Equipment(Weapons.Axe), EQUIPMENT_SLOT.MAIN_HAND);
      bm.addToBoard(unit1);

      unit1.triggerManager.onTrigger(TRIGGER.BATTLE_START, unit1, bm);
      sortAndExecuteEvents(bm, unit1.serializeEvents());

      expect(unit1.statusEffects).toContainEqual({
        name: STATUS_EFFECT.VULNERABLE,
        quantity: 10,
      });

      const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
      unit2.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);

      bm.addToBoard(unit2);

      // attacks
      useAbility(unit2);
      sortAndExecuteEvents(bm, unit2.serializeEvents());
      expect(unit1.statusEffects).toContainEqual({
        name: STATUS_EFFECT.VULNERABLE,
        quantity: 5,
      });

      // attacks again
      useAbility(unit2);
      sortAndExecuteEvents(bm, unit2.serializeEvents());

      expect(unit1.statusEffects).toHaveLength(1);
      expect(unit1.statusEffects).not.toContainEqual({
        name: STATUS_EFFECT.VULNERABLE,
        quantity: 0,
      });
    });
  });
});
