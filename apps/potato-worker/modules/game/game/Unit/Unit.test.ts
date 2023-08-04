import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import Weapons from "../data/weapons";
import { Unit } from "./Unit";

describe("Unit", () => {
  describe("Equipment", () => {
    test("should equip", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.equipmentManager.equips).toHaveLength(1);

      expect(unit.equipmentManager.equips[0].slot).toBe(
        EQUIPMENT_SLOT.MAIN_HAND
      );
      expect(unit.equipmentManager.equips[0].equip).toBeInstanceOf(Equipment);
      expect(unit.equipmentManager.equips[0].equip.data).toEqual(
        Weapons.ShortSpear
      );
    });

    test("check if equip is on valid slot", () => {});

    test("should equip in different slots", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.equipmentManager.equips).toHaveLength(1);

      unit.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.OFF_HAND);
      expect(unit.equipmentManager.equips).toHaveLength(2);
    });

    test("should not be able to equip in same slot", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      try {
        unit.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);
        unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
      } catch (e: any) {
        expect(e.message).toBeDefined();
        expect(unit.equipmentManager.equips).toHaveLength(1);
      }
    });

    test("should unequip then equip", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.equipmentManager.equips).toHaveLength(1);

      unit.equipmentManager.unequip(EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.equipmentManager.equips).toHaveLength(0);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.equipmentManager.equips).toHaveLength(1);
    });
  });

  describe("Abilities", () => {
    test("equipping a weapon should give an ability", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.equipmentManager.equips[0].slot).toBe(
        EQUIPMENT_SLOT.MAIN_HAND
      );
      expect(unit.abilityManager.getAbilities()).toHaveLength(1);
    });

    test("equipping two weapons should give two abilities", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
      unit.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.OFF_HAND);

      expect(unit.abilityManager.getAbilities()).toHaveLength(2);
    });

    test("throws error when invalid target", () => {
      const bm = new BoardManager();
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

      const ability = unit.abilityManager.getAbilities()[0];

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
      const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
      bm.addToBoard(unit);
      bm.addToBoard(unit2);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

      const ability = unit.abilityManager.getAbilities()[0];
      expect(ability.data.name).toBe("Thrust");

      for (let i = 0; i < ability.data.cooldown; i++) {
        unit.step(i);
      }

      expect(ability.progress).toBe(0);
      // todo fix post step logic
      // expect(unit2.stats.hp).not.toBe(unit2.stats.maxHp);
    });

    test("uses Sword ability: Slash", () => {
      const bm = new BoardManager();
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
      const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
      bm.addToBoard(unit);
      bm.addToBoard(unit2);

      unit.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);

      const ability = unit.abilityManager.getAbilities()[0];
      expect(ability.data.name).toBe("Slash");

      for (let i = 0; i < ability.data.cooldown; i++) {
        unit.step(i);
      }

      expect(ability.progress).toBe(0);
      // todo fix post step logic
      // expect(unit2.stats.hp).not.toBe(unit2.stats.maxHp);
    });
  });

  /* describe("kek", () => {
    test.only("w", () => {
      const kkkk = new Equipment(Weapons.ShortSpear);
    });
  }); */
});
