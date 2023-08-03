import { Class } from "./Class";
import Classes from "../data/classes";
import { Unit } from "../Unit/Unit";
import { OWNER, POSITION } from "../BoardManager";

describe("Class", () => {
  test("should create", () => {
    const unitClass = new Class(Classes.Ranger);
    expect(unitClass).toBeDefined();
  });

  test("should grant base class abilities", () => {
    const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);
    unit.setClass(new Class(Classes.Ranger));
    expect(unit.abilityManager.getAbilities().length).toBe(1);
  });
});
