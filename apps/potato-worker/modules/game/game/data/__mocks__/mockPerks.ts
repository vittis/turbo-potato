import { PerkData } from "../../Perk/PerkTypes";

export const MockPerks = {
  FocusedMind: {
    name: "Focused Mind",
    type: "TIER_SCALE",
    tiers: [
      {
        name: "FOCUS",
        values: [5, 10, 15, 20, 30],
      },
    ],
    effects: [
      {
        type: "GRANT_STATUS_EFFECT",
        trigger: "BATTLE_START",
        target: "SELF",
        payload: [
          {
            name: "FOCUS",
            quantity: "DYNAMIC",
          },
        ],
      },
    ],
  } as PerkData,
};
