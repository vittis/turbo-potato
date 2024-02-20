import { BOX, BoardManager, COLUMN, ROW } from "../BoardManager";
import { Unit } from "../Unit/Unit";
import { TARGET_TYPE } from "./TargetTypes";

export const TargetFunctionMap: {
  [key: string]: (bm: BoardManager, unit: Unit) => Unit[];
} = {
  ADJACENT_ALLIES: getAdjacentAlliesTarget,
  ALL_ALLIES: getAllAlliedUnitsTarget,
  ALL_ENEMIES: getAllEnemyUnitsTarget,
  ALL_UNITS: getAllUnitsTarget,
  BACK_ALLY: getBackAllyTarget,
  DIAGONAL_ALLIES: getDiagonalAlliesTarget,
  FRONT_ALLY: getFrontAllyTarget,
  FURTHEST: getFurthestTarget,
  FURTHEST_BOX: getFurthestBoxTarget,
  FURTHEST_COLUMN: getFurthestColumnTarget,
  FURTHEST_ROW: getFurthestRowTarget,
  LOWEST_HEALTH_ALLY: getLowestHealthAllyTarget,
  LOWEST_HEALTH_ENEMY: getLowestHealthEnemyTarget,
  SAME_COLUMN_ALLIES: getSameColumnAlliesTarget,
  SAME_ROW: getSameRowTarget,
  SAME_ROW_ALLIES: getSameRowAlliesTarget,
  SELF: getSelfTarget,
  SIDE_ALLY: getSideAllyTarget,
  STANDARD: getStandardTarget,
  STANDARD_BOX: getStandardBoxTarget,
  STANDARD_COLUMN: getStandardColumnTarget,
  STANDARD_ROW: getStandardRowTarget,
};

export function getTargetFunction(targetType: TARGET_TYPE) {
  const TargetFunction = TargetFunctionMap[targetType];
  if (TargetFunction) {
    return TargetFunction;
  } else {
    throw new Error(`Unknown target type: ${targetType}`);
  }
}

function getStandardTarget(bm: BoardManager, unit: Unit): Unit[] {
  const frontEnemies = bm.getAllAliveUnitsInColumn(
    bm.getEnemyOwner(unit.owner),
    COLUMN.FRONT
  );
  const midEnemies = bm.getAllAliveUnitsInColumn(
    bm.getEnemyOwner(unit.owner),
    COLUMN.MID
  );

  const backEnemies = bm.getAllAliveUnitsInColumn(
    bm.getEnemyOwner(unit.owner),
    COLUMN.BACK
  );

  // todo any cleaner way to do this?
  const enemyUnitsInClosestColumn =
    (frontEnemies.length > 0 ? frontEnemies : undefined) ||
    (midEnemies.length > 0 ? midEnemies : undefined) ||
    backEnemies;

  const target =
    enemyUnitsInClosestColumn.find(
      (enemyUnit) => bm.getUnitRow(enemyUnit) === bm.getUnitRow(unit)
    ) || enemyUnitsInClosestColumn[0];

  return [target] as Unit[];
}

function getStandardBoxTarget(bm: BoardManager, unit: Unit): Unit[] {
  const standardTarget = getStandardTarget(bm, unit)[0];

  if (bm.getUnitColumn(standardTarget) === COLUMN.FRONT) {
    const unitsInFrontBox = bm.getAllAliveUnitsInBox(
      bm.getEnemyOwner(unit.owner),
      BOX.FRONT
    );

    return unitsInFrontBox as Unit[];
  }

  const unitsInBackBox = bm.getAllAliveUnitsInBox(
    bm.getEnemyOwner(unit.owner),
    BOX.BACK
  );

  return unitsInBackBox as Unit[];
}

function getStandardColumnTarget(bm: BoardManager, unit: Unit): Unit[] {
  const standardTarget = getStandardTarget(bm, unit)[0];

  const unitsInColumn = bm.getAllAliveUnitsInColumn(
    bm.getEnemyOwner(unit.owner),
    bm.getUnitColumn(standardTarget)
  );

  return unitsInColumn as Unit[];
}

function getStandardRowTarget(bm: BoardManager, unit: Unit): Unit[] {
  const standardTarget = getStandardTarget(bm, unit)[0];

  const unitsInRow = bm.getAllAliveUnitsInRow(
    bm.getEnemyOwner(unit.owner),
    bm.getUnitRow(standardTarget)
  );

  return unitsInRow as Unit[];
}

function getFurthestTarget(bm: BoardManager, unit: Unit): Unit[] {
  const enemyUnitsInFurthestColumn =
    bm.getAllAliveUnitsInColumn(bm.getEnemyOwner(unit.owner), COLUMN.BACK) ||
    bm.getAllAliveUnitsInColumn(bm.getEnemyOwner(unit.owner), COLUMN.MID) ||
    bm.getAllAliveUnitsInColumn(bm.getEnemyOwner(unit.owner), COLUMN.FRONT);

  const target =
    enemyUnitsInFurthestColumn.find(
      (enemyUnit) => bm.getUnitRow(enemyUnit) !== bm.getUnitRow(unit)
    ) || enemyUnitsInFurthestColumn[0];

  return [target] as Unit[];
}

function getFurthestBoxTarget(bm: BoardManager, unit: Unit): Unit[] {
  const furthestTarget = getFurthestTarget(bm, unit)[0];

  if (bm.getUnitColumn(furthestTarget) === COLUMN.BACK) {
    const unitsInBackBox = bm.getAllAliveUnitsInBox(
      bm.getEnemyOwner(unit.owner),
      BOX.BACK
    );

    return unitsInBackBox as Unit[];
  }

  const unitsInFrontBox = bm.getAllAliveUnitsInBox(
    bm.getEnemyOwner(unit.owner),
    BOX.FRONT
  );

  return unitsInFrontBox as Unit[];
}

function getFurthestColumnTarget(bm: BoardManager, unit: Unit): Unit[] {
  const furthestTarget = getFurthestTarget(bm, unit)[0];

  const unitsInColumn = bm.getAllAliveUnitsInColumn(
    bm.getEnemyOwner(unit.owner),
    bm.getUnitColumn(furthestTarget)
  );

  return unitsInColumn as Unit[];
}

function getFurthestRowTarget(bm: BoardManager, unit: Unit): Unit[] {
  const furthestTarget = getFurthestTarget(bm, unit)[0];

  const unitsInRow = bm.getAllAliveUnitsInRow(
    bm.getEnemyOwner(unit.owner),
    bm.getUnitRow(furthestTarget)
  );

  return unitsInRow as Unit[];
}

function getSameRowTarget(bm: BoardManager, unit: Unit): Unit[] {
  const unitsInRow = bm.getAllAliveUnitsInRow(
    bm.getEnemyOwner(unit.owner),
    bm.getUnitRow(unit)
  );

  return unitsInRow as Unit[];
}

function getSameRowAlliesTarget(bm: BoardManager, unit: Unit): Unit[] {
  const alliedUnitsInSameRow = bm.getAllAliveUnitsInRow(
    unit.owner,
    bm.getUnitRow(unit)
  );

  return alliedUnitsInSameRow as Unit[];
}

function getSameColumnAlliesTarget(bm: BoardManager, unit: Unit): Unit[] {
  const alliedUnitsInSameColumn = bm.getAllAliveUnitsInColumn(
    unit.owner,
    bm.getUnitColumn(unit)
  );

  return alliedUnitsInSameColumn as Unit[];
}

function getSideAllyTarget(bm: BoardManager, unit: Unit): Unit[] {
  const unitsInColumn = bm.getAllAliveUnitsInColumn(
    unit.owner,
    bm.getUnitColumn(unit)
  );

  const alliedUnitInColumn = unitsInColumn.filter(
    (alliedUnit) => alliedUnit.id !== unit.id
  );

  return alliedUnitInColumn as Unit[];
}

function getFrontAllyTarget(bm: BoardManager, unit: Unit): Unit[] {
  if (bm.getUnitColumn(unit) === COLUMN.FRONT) {
    return [];
  }

  const frontAlly = bm.getUnitByPosition(unit.owner, unit.position - 1);

  return frontAlly as Unit[];
}

function getBackAllyTarget(bm: BoardManager, unit: Unit): Unit[] {
  if (bm.getUnitColumn(unit) === COLUMN.BACK) {
    return [];
  }

  const backAlly = bm.getUnitByPosition(unit.owner, unit.position + 1);

  return backAlly as Unit[];
}

function getAdjacentAlliesTarget(bm: BoardManager, unit: Unit): Unit[] {
  const adjacentAllies = [
    ...getFrontAllyTarget(bm, unit),
    ...getBackAllyTarget(bm, unit),
    ...getSideAllyTarget(bm, unit),
  ];

  return adjacentAllies as Unit[];
}

function getDiagonalAlliesTarget(bm: BoardManager, unit: Unit): Unit[] {
  const alliedUnitsInAnotherRow = bm.getAllAliveUnitsInRow(
    unit.owner,
    bm.getUnitRow(unit) === ROW.BOT ? ROW.TOP : ROW.BOT
  );

  const diagonalAllies = alliedUnitsInAnotherRow.filter(
    (alliedUnit) =>
      bm.getUnitColumn(alliedUnit) === bm.getUnitColumn(unit) - 1 ||
      bm.getUnitColumn(alliedUnit) === bm.getUnitColumn(unit) + 1
  );

  return diagonalAllies as Unit[];
}

function getAllUnitsTarget(bm: BoardManager, unit: Unit): Unit[] {
  const allUnits = bm.getAllAliveUnits();

  return allUnits as Unit[];
}

function getAllAlliedUnitsTarget(bm: BoardManager, unit: Unit): Unit[] {
  const allAlliedUnits = bm.getAllAliveUnitsOfOwner(unit.owner);

  return allAlliedUnits as Unit[];
}

function getAllEnemyUnitsTarget(bm: BoardManager, unit: Unit): Unit[] {
  const allEnemyUnits = bm.getAllAliveUnitsOfOwner(
    bm.getEnemyOwner(unit.owner)
  );

  return allEnemyUnits as Unit[];
}

function getSelfTarget(bm: BoardManager, unit: Unit): Unit[] {
  return [unit];
}

function getLowestHealthAllyTarget(bm: BoardManager, unit: Unit): Unit[] {
  const allAlliedUnits = getAllAlliedUnitsTarget(bm, unit);

  const lowestHealthUnit = allAlliedUnits.reduce((prev, curr) => {
    if (curr.stats.hp < prev.stats.hp) {
      return curr;
    } else {
      return prev;
    }
  });

  return [lowestHealthUnit] as Unit[];
}

function getLowestHealthEnemyTarget(bm: BoardManager, unit: Unit): Unit[] {
  const allEnemyUnits = getAllEnemyUnitsTarget(bm, unit);

  const lowestHealthUnit = allEnemyUnits.reduce((prev, curr) => {
    if (curr.stats.hp < prev.stats.hp) {
      return curr;
    } else {
      return prev;
    }
  });

  return [lowestHealthUnit] as Unit[];
}
