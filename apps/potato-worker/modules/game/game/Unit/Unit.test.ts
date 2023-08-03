import { OWNER, POSITION } from "../BoardManager";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { UnitNew } from "./UnitNew";
import Weapons from "../data/weapons";
import { Ability } from "../Ability/Ability";
import { Unit } from "../Unit";

describe("Unit", () => {
  describe("Equipment", () => {
    test("should equip", () => {
      const unit = new UnitNew(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.equips).toHaveLength(1);

      expect(unit.equips[0].slot).toBe(EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.equips[0].equip).toBeInstanceOf(Equipment);
      expect(unit.equips[0].equip.data).toEqual(Weapons.ShortSpear);
    });

    test("should equip in different slots", () => {
      const unit = new UnitNew(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.equips).toHaveLength(1);

      unit.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.OFF_HAND);
      expect(unit.equips).toHaveLength(2);
    });

    test("should not be able to equip in same slot", () => {
      const unit = new UnitNew(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      try {
        unit.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);
        unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
      } catch (e: any) {
        expect(e.message).toBeDefined();
        expect(unit.equips).toHaveLength(1);
      }
    });

    test("should unequip then equip", () => {
      const unit = new UnitNew(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.equips).toHaveLength(1);

      unit.unequip(EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.equips).toHaveLength(0);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
      expect(unit.equips).toHaveLength(1);
    });
  });

  describe("Abilities", () => {
    test("equipping a weapon should give an ability", () => {
      const unit = new UnitNew(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.abilities).toHaveLength(1);
    });

    test("equipping two weapons should give two abilities", () => {
      const unit = new UnitNew(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

      unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
      unit.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.OFF_HAND);

      expect(unit.abilities).toHaveLength(2);
    });
  });
  /* describe("kek", () => {
    test.only("w", () => {
      const kkkk = new Equipment(Weapons.ShortSpear);
    });
  }); */
});
