import { Unit } from "../Unit/Unit";
import { OWNER, POSITION } from "../BoardManager";
import { Perk } from "./Perk";
import Perks from "../data/perks";

describe("Perk", () => {
  test("should create", () => {
    const unit = new Perk(Perks.FocusedMind);
    expect(unit).toBeDefined();
  });
});
