import { Perk } from "./Perk";
import { Perks } from "../data";

describe("Perk", () => {
  it("should create", () => {
    const perk = new Perk(Perks.FocusedMind);
    expect(perk).toBeDefined();
  });

  test("getTriggerEffects", () => {
    const perk = new Perk(Perks.FocusedMind);

    expect(perk.getTriggerEffects()).toEqual([
      {
        payload: [{ name: "FOCUS", quantity: 5 }],
        target: "SELF",
        trigger: "BATTLE_START",
        type: "STATUS_EFFECT",
      },
    ]);
  });
});
