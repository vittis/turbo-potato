import { BoardManager, OWNER, POSITION } from "./BoardManager";
import { Class } from "./Class/Class";
import { Equipment } from "./Equipment/Equipment";
import { EQUIPMENT_SLOT } from "./Equipment/EquipmentTypes";
import { runGame } from "./Game";
import { Unit } from "./Unit/Unit";
import { Weapons } from "./data";

describe("Run Game", () => {
  it("runs game 1v1 and both units die", () => {
    const bm = new BoardManager();

    const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
    unit1.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
    bm.addToBoard(unit1);

    const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
    unit2.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
    bm.addToBoard(unit2);

    const { eventHistory } = runGame(bm);

    expect(eventHistory.at(eventHistory.length - 1)).toHaveProperty(
      "type",
      "FAINT"
    );

    expect(eventHistory.at(eventHistory.length - 2)).toHaveProperty(
      "type",
      "FAINT"
    );
  });
});
