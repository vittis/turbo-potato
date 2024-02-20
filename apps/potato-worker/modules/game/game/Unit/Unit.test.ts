import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Class } from "../Class/Class";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { sortAndExecuteEvents } from "../Event/EventUtils";
import { runGame } from "../Game";
import { Weapons, Classes } from "../data";
import classes from "../data/classes";
import { Unit } from "./Unit";

describe("Unit", () => {
  describe("Equipment", () => {
    test("should equip", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.equips).toHaveLength(1);

      expect(unit.equips[0].slot).toBe(EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.equips[0].equip).toBeInstanceOf(Equipment);
      expect(unit.equips[0].equip.data).toEqual(Weapons.Shortbow);
    });

    // todo add this
    // test("check if equip is on valid slot", () => {});

    test("should equip in different slots", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.equips).toHaveLength(1);

      unit.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.OFF_HAND);
      expect(unit.equips).toHaveLength(2);
    });

    test("should not be able to equip in same slot", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      try {
        unit.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);
        unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
      } catch (e: any) {
        expect(e.message).toBeDefined();
        expect(unit.equips).toHaveLength(1);
      }
    });

    test("should unequip then equip", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.equips).toHaveLength(1);

      unit.unequip(EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.equips).toHaveLength(0);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.equips).toHaveLength(1);
    });
  });

  describe("Abilities", () => {
    test("class should give ability", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.setClass(new Class(Classes.Ranger));

      expect(unit.abilities).toHaveLength(1);
    });
    test("equipping a weapon should give an ability", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.equips[0].slot).toBe(EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.abilities).toHaveLength(1);
    });

    test("equipping two weapons should give two abilities", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
      unit.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.OFF_HAND);

      expect(unit.abilities).toHaveLength(2);
    });

    test("throws error when invalid target", () => {
      const bm = new BoardManager();
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

      const ability = unit.abilities[0];

      try {
        for (let i = 0; i < ability.data.cooldown; i++) {
          unit.step(i);
        }
      } catch (e: any) {
        expect(e.message).toBeDefined();
        return;
      }

      expect(true).toBe(false);
    });

    test("uses Short Spear ability: Thrust", () => {
      const bm = new BoardManager();
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
      const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_MID, bm);
      bm.addToBoard(unit);
      bm.addToBoard(unit2);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

      const ability = unit.abilities[0];
      expect(ability.data.name).toBe("Thrust");

      for (let i = 0; i < ability.data.cooldown; i++) {
        unit.step(i);
      }

      sortAndExecuteEvents(bm, unit.serializeEvents());

      expect(ability.progress).toBe(0);
      expect(unit2.stats.hp).not.toBe(unit2.stats.maxHp);
    });

    test("uses Sword ability: Slash", () => {
      const bm = new BoardManager();
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
      const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
      bm.addToBoard(unit);
      bm.addToBoard(unit2);

      unit.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);

      const ability = unit.abilities[0];
      expect(ability.data.name).toBe("Slash");

      for (let i = 0; i < ability.data.cooldown; i++) {
        unit.step(i);
      }

      expect(ability.progress).toBe(0);
      sortAndExecuteEvents(bm, unit.serializeEvents());

      expect(unit2.stats.hp).not.toBe(unit2.stats.maxHp);
    });
  });

  describe("Stats", () => {
    test("equipping weapon grants stats", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.statsFromMods.attackDamageModifier).toBe(10);
    });

    // todo rewrite
    test.skip("equipping two items should accumulate stat", () => {
      const bm = new BoardManager();
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);

      expect(unit.stats.damageReductionModifier).toBe(10);
    });

    test("class should grant stats", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.setClass(new Class(Classes.Ranger));
      expect(unit.stats.attackCooldownModifier).toBe(7);
      expect(unit.stats.attackDamageModifier).toBe(7);
    });
  });

  describe("Perks", () => {
    test("equipping a weapon should give a perk", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.perks).toHaveLength(1);
    });

    test("unequipping a weapon should remove its perk", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.perks).toHaveLength(1);

      unit.unequip(EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.perks).toHaveLength(0);
    });
  });
});
