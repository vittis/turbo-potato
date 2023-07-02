import { BoardManager } from "./BoardManager";
import { Skill } from "./Skill";
import { EVENT_TYPE, Unit } from "./Unit";

/*
  Class - Cleric
  Effect - Heals single lowest % health ally or self
*/

export class HealingWord extends Skill {
  name = "Healing Word";
  description = "Heals single lowest % health ally or self";

  // Temporary - check where should we set these values
  baseHeal = 10;
  intMultiplier = 1;

  // Check if there is at least one ally who lost HP, if not skill shouldn't be cast
  shouldCast(unit: Unit, bm: BoardManager): boolean {
    const allyUnits = bm.getAllUnitsOfOwner(unit.owner);

    const hasUnitToHeal = allyUnits.some((ally) => ally.getPercentageHp() < 1);

    return hasUnitToHeal;
  }

  getTarget(unit: Unit, bm: BoardManager): Unit {
    const allyUnits = bm.getAllUnitsOfOwner(unit.owner);

    const lowestHealthAlly = allyUnits.reduce(
      (target, ally) =>
        ally.getPercentageHp() < target.getPercentageHp() ? ally : target,
      allyUnits[0]
    );

    return lowestHealthAlly;
  }

  getHealValue(unit: Unit): number {
    return this.baseHeal + this.intMultiplier * unit.stats.int;
  }

  cast(unit: Unit, bm: BoardManager) {
    const target = this.getTarget(unit, bm);
    const healValue = this.getHealValue(unit);

    unit.stepEvents.push({
      id: unit.id,
      type: EVENT_TYPE.CAST_SKILL,
      payload: {
        skillName: this.name,
        sp: unit.stats.sp,
        skillTarget: target.id,
      },
      step: unit.currentStep,
    });

    unit.receiveHeal(healValue, unit.currentStep);
  }
}
