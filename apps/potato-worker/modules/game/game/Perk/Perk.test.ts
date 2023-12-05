import { Unit } from "../Unit/Unit";
import { OWNER, POSITION } from "../BoardManager";
import { Perk } from "./Perk";
import { Perks } from "../data";

describe("Perk", () => {
  test("should create", () => {
    const unit = new Perk(Perks.FocusedMind);
    expect(unit).toBeDefined();
  });
});
