import { BoardManager } from "../BoardManager";
import { EQUIPMENT_SLOT, EQUIPMENT_TAG } from "../Equipment/EquipmentTypes";
import { TARGET_TYPE } from "../Target/TargetTypes";
import { Unit } from "../Unit/Unit";
import { BOARD_POSITION } from "./TriggerTypes";

export function isPositionConditionValid(
  bm: BoardManager,
  unit: Unit,
  target: TARGET_TYPE,
  position: BOARD_POSITION
) {
  const targetUnits = bm.getTarget(unit, target);

  if (targetUnits.length === 0) {
    return false;
  }

  const targetUnit = targetUnits[0];

  if (position === BOARD_POSITION.FRONT) {
    return bm.getUnitColumn(targetUnit) === 0;
  }

  if (position === BOARD_POSITION.BACK) {
    return bm.getUnitColumn(targetUnit) === 2;
  }

  return true;
}

export function isEquipmentConditionValid(
  bm: BoardManager,
  unit: Unit,
  target: TARGET_TYPE,
  slots: EQUIPMENT_SLOT[],
  tags: EQUIPMENT_TAG[]
) {
  const targetUnits = bm.getTarget(unit, target);

  if (targetUnits.length === 0) {
    return false;
  }

  const targetUnit = targetUnits[0];

  let isValid = false;

  targetUnit.equips.forEach((equip) => {
    if (
      slots.includes(equip.slot) &&
      tags.every((tag) => equip.equip.data.tags.includes(tag))
    ) {
      isValid = true;
    }
  });

  return isValid;
}
