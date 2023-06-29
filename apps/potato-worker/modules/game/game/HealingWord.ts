import { BoardManager } from "./BoardManager";
import { Skill } from "./Skill";
import { EVENT_TYPE, Unit } from "./Unit";

/*
  Class - Cleric
  Effect - Heals single lowest % health ally or self
*/

export class HealingWord extends Skill {
  name = "Healing Word";

  // Temporary - check where should we set these values
  baseHeal = 60;
  intMultiplier = 4;

  constructor(bm: BoardManager) {
    super(bm);
  }

  /*
    Future - implement check function to see if skill should be cast
    Example - if all allies are full health, should the unit even cast the skill?
  */

  getTarget(unit: Unit) {
    const allyUnits = this.bm.getAllUnitsOfOwner(unit.owner);

    const lowestHealthAlly = allyUnits.reduce(
      (target, ally) =>
        ally.stats.hp / ally.stats.maxHp < target.stats.hp / target.stats.maxHp
          ? ally
          : target,
      allyUnits[0]
    );

    return lowestHealthAlly;
  }

  getHealValue(unit: Unit) {
    return this.baseHeal + this.intMultiplier * unit.stats.int;
  }

  cast(unit: Unit) {
    const target = this.getTarget(unit);
    const healValue = this.getHealValue(unit);

    const newHp = Math.min(target.stats.hp + healValue, target.stats.maxHp);
    const hpHealed = newHp - target.stats.hp;

    target.stats.hp = newHp;

    unit.stepEvents.push({
      id: unit.id,
      type: EVENT_TYPE.CAST_SKILL,
      payload: {
        skillName: this.name,
        sp: unit.stats.sp,
        currentAp: unit.stats.ap,
        skillTarget: target.id,
      },
      step: unit.currentStep,
    });

    target.stepEvents.push({
      id: target.id,
      type: EVENT_TYPE.RECEIVED_HEAL,
      payload: { hp: target.stats.hp, hpHealed },
      step: target.currentStep,
    });
  }
}
