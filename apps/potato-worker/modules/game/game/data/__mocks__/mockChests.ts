export const MockChests = {
  LeatherShirt: {
    name: "Leather Shirt",
    allowedSlots: ["CHEST"],
    mods: [
      {
        type: "GRANT_BASE_STAT",
        payload: {
          stat: "DAMAGE_REDUCTION",
          value: 8,
        },
      },
    ],
    effects: [],
  },
};
