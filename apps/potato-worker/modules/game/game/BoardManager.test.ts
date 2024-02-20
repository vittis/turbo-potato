import { TARGET_TYPE } from "./Target/TargetTypes";
import { BoardManager, OWNER, POSITION } from "./BoardManager";
import { Unit } from "./Unit/Unit";

describe("BoardManager", () => {
  describe("Targeting", () => {
    it("should work STANDARD", () => {
      const bm = new BoardManager();
      const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
      bm.addToBoard(unit1);

      const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
      bm.addToBoard(unit2);

      const targets = bm.getTarget(unit1, TARGET_TYPE.STANDARD);

      expect(targets).toHaveLength(1);
      expect(targets[0].id).toBe(unit2.id);
    });
  });
});
