import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { sortAndExecuteEvents } from "../Event/EventUtils";
import { Unit } from "../Unit/Unit";
import { Weapons } from "../data";
import { TARGET_TYPE } from "./TargetTypes";

describe("Target", () => {
  const bm = new BoardManager();

  const unit00 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
  const unit01 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_MID, bm);
  const unit02 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_BACK, bm);
  const unit03 = new Unit(OWNER.TEAM_ONE, POSITION.BOT_FRONT, bm);
  const unit04 = new Unit(OWNER.TEAM_ONE, POSITION.BOT_MID, bm);
  const unit05 = new Unit(OWNER.TEAM_ONE, POSITION.BOT_BACK, bm);

  const unit10 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
  const unit11 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_MID, bm);
  const unit12 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_BACK, bm);
  const unit13 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_FRONT, bm);
  const unit14 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_MID, bm);
  const unit15 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_BACK, bm);

  bm.addToBoard(unit00);
  bm.addToBoard(unit01);
  bm.addToBoard(unit02);
  bm.addToBoard(unit03);
  bm.addToBoard(unit04);
  bm.addToBoard(unit05);
  bm.addToBoard(unit10);
  bm.addToBoard(unit11);
  bm.addToBoard(unit12);
  bm.addToBoard(unit13);
  bm.addToBoard(unit14);
  bm.addToBoard(unit15);

  /* Board
      02 01 00 | 10 11 12
      05 04 03 | 13 14 15
  */

  // unit00 attacks unit10 to make health related tests
  unit00.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);
  const ability = unit00.abilities[0];
  for (let i = 0; i < ability.data.cooldown; i++) {
    unit00.step(i);
  }
  sortAndExecuteEvents(bm, unit00.serializeEvents());

  // create board with only one unit
  const bmEmpty = new BoardManager();
  const unitAlone = new Unit(OWNER.TEAM_ONE, POSITION.TOP_MID, bmEmpty);
  bmEmpty.addToBoard(unitAlone);

  it("should work ADJACENT_ALLIES", () => {
    const targets = bm.getTarget(unit01, TARGET_TYPE.ADJACENT_ALLIES);

    expect(targets).toHaveLength(3);
    expect(targets).toContain(unit00);
    expect(targets).toContain(unit02);
    expect(targets).toContain(unit04);
  });

  it("should work ALL_ALLIES", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.ALL_ALLIES);

    expect(targets).toHaveLength(6);
    expect(targets).toContain(unit00);
    expect(targets).toContain(unit01);
    expect(targets).toContain(unit02);
    expect(targets).toContain(unit03);
    expect(targets).toContain(unit04);
    expect(targets).toContain(unit05);
  });

  it("should work ALL_ENEMIES", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.ALL_ENEMIES);

    expect(targets).toHaveLength(6);
    expect(targets).toContain(unit10);
    expect(targets).toContain(unit11);
    expect(targets).toContain(unit12);
    expect(targets).toContain(unit13);
    expect(targets).toContain(unit14);
    expect(targets).toContain(unit15);
  });

  it("should work ALL_UNITS", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.ALL_UNITS);

    expect(targets).toHaveLength(12);
    expect(targets).toContain(unit00);
    expect(targets).toContain(unit01);
    expect(targets).toContain(unit02);
    expect(targets).toContain(unit03);
    expect(targets).toContain(unit04);
    expect(targets).toContain(unit05);
    expect(targets).toContain(unit10);
    expect(targets).toContain(unit11);
    expect(targets).toContain(unit12);
    expect(targets).toContain(unit13);
    expect(targets).toContain(unit14);
    expect(targets).toContain(unit15);
  });

  it("should work BACK_ALLY", () => {
    const targetsWhenHaveBackAlly = bm.getTarget(unit00, TARGET_TYPE.BACK_ALLY);

    expect(targetsWhenHaveBackAlly).toHaveLength(1);
    expect(targetsWhenHaveBackAlly).toContain(unit01);

    const targetsWhenOnBackColumn = bm.getTarget(unit02, TARGET_TYPE.BACK_ALLY);

    expect(targetsWhenOnBackColumn).toHaveLength(0);

    const targetsWhenNoBackAlly = bmEmpty.getTarget(
      unitAlone,
      TARGET_TYPE.BACK_ALLY
    );

    expect(targetsWhenNoBackAlly).toHaveLength(0);
  });

  it("should work DIAGONAL_ALLIES", () => {
    const targetsWhenMid = bm.getTarget(unit01, TARGET_TYPE.DIAGONAL_ALLIES);

    expect(targetsWhenMid).toHaveLength(2);
    expect(targetsWhenMid).toContain(unit03);
    expect(targetsWhenMid).toContain(unit05);

    const targetsWhenFrontOrBot = bm.getTarget(
      unit00,
      TARGET_TYPE.DIAGONAL_ALLIES
    );

    expect(targetsWhenFrontOrBot).toHaveLength(1);
    expect(targetsWhenFrontOrBot).toContain(unit04);
  });

  it("should work FRONT_ALLY", () => {
    const targetsWhenHaveFrontAlly = bm.getTarget(
      unit02,
      TARGET_TYPE.FRONT_ALLY
    );

    expect(targetsWhenHaveFrontAlly).toHaveLength(1);
    expect(targetsWhenHaveFrontAlly).toContain(unit01);

    const targetsWhenOnFrontColumn = bm.getTarget(
      unit00,
      TARGET_TYPE.FRONT_ALLY
    );

    expect(targetsWhenOnFrontColumn).toHaveLength(0);

    const targetsWhenNoFrontAlly = bmEmpty.getTarget(
      unitAlone,
      TARGET_TYPE.FRONT_ALLY
    );

    expect(targetsWhenNoFrontAlly).toHaveLength(0);
  });

  it("should work FURTHEST", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.FURTHEST);

    expect(targets).toHaveLength(1);
    expect(targets).toContain(unit15);
  });

  it("should work FURTHEST_BOX", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.FURTHEST_BOX);

    expect(targets).toHaveLength(4);
    expect(targets).toContain(unit11);
    expect(targets).toContain(unit12);
    expect(targets).toContain(unit14);
    expect(targets).toContain(unit15);
  });

  it("should work FURTHEST_COLUMN", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.FURTHEST_COLUMN);

    expect(targets).toHaveLength(2);
    expect(targets).toContain(unit12);
    expect(targets).toContain(unit15);
  });

  it("should work FURTHEST_ROW", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.FURTHEST_ROW);

    expect(targets).toHaveLength(3);
    expect(targets).toContain(unit13);
    expect(targets).toContain(unit14);
    expect(targets).toContain(unit15);
  });

  it("should work LOWEST_HEALTH_ALLY", () => {
    const targets = bm.getTarget(unit11, TARGET_TYPE.LOWEST_HEALTH_ALLY);

    expect(targets).toHaveLength(1);
    expect(targets).toContain(unit10);
  });

  it("should work LOWEST_HEALTH_ENEMY", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.LOWEST_HEALTH_ENEMY);

    expect(targets).toHaveLength(1);
    expect(targets).toContain(unit10);
  });

  it("should work SAME_COLUMN_ALLIES", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.SAME_COLUMN_ALLIES);

    expect(targets).toHaveLength(2);
    expect(targets).toContain(unit00);
    expect(targets).toContain(unit03);
  });

  it("should work SAME_ROW", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.SAME_ROW);

    expect(targets).toHaveLength(3);
    expect(targets).toContain(unit10);
    expect(targets).toContain(unit11);
    expect(targets).toContain(unit12);
  });

  it("should work SAME_ROW_ALLIES", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.SAME_ROW_ALLIES);

    expect(targets).toHaveLength(3);
    expect(targets).toContain(unit00);
    expect(targets).toContain(unit01);
    expect(targets).toContain(unit02);
  });

  it("should work SELF", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.SELF);

    expect(targets).toHaveLength(1);
    expect(targets).toContain(unit00);
  });

  it("should work SIDE_ALLY", () => {
    const targetsWhenHaveSideAlly = bm.getTarget(unit00, TARGET_TYPE.SIDE_ALLY);

    expect(targetsWhenHaveSideAlly).toHaveLength(1);
    expect(targetsWhenHaveSideAlly).toContain(unit03);

    const targetsWhenNoSideAlly = bmEmpty.getTarget(
      unitAlone,
      TARGET_TYPE.SIDE_ALLY
    );

    expect(targetsWhenNoSideAlly).toHaveLength(0);
  });

  it("should work STANDARD", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.STANDARD);

    expect(targets).toHaveLength(1);
    expect(targets).toContain(unit10);
  });

  it("should work STANDARD_BOX", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.STANDARD_BOX);

    expect(targets).toHaveLength(4);
    expect(targets).toContain(unit10);
    expect(targets).toContain(unit11);
    expect(targets).toContain(unit13);
    expect(targets).toContain(unit14);
  });

  it("should work STANDARD_COLUMN", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.STANDARD_COLUMN);

    expect(targets).toHaveLength(2);
    expect(targets).toContain(unit10);
    expect(targets).toContain(unit13);
  });

  it("should work STANDARD_ROW", () => {
    const targets = bm.getTarget(unit00, TARGET_TYPE.STANDARD_ROW);

    expect(targets).toHaveLength(3);
    expect(targets).toContain(unit10);
    expect(targets).toContain(unit11);
    expect(targets).toContain(unit12);
  });
});
