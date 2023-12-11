export const MockHeads = {
  LeatherHat: {
    name: "Leather Hat",
    allowedSlots: ["HEAD"],
    mods: [
      {
        type: "GRANT_BASE_STAT",
        payload: {
          stat: "DAMAGE_REDUCTION",
          value: 2,
        },
      },
    ],
    effects: [],
  },
};
