import { BoardManager, ROW } from "./BoardManager";
import { STATUS_EFFECT_TYPE, Skill } from "./Skill";
import { EVENT_TYPE, Unit } from "./Unit";

/*
  Class - Knight
  Effect - Damages and stuns enemy
*/

export class HeadCrush extends Skill {
  name = "Head Crush";
  description = "Damages and stuns enemy";

  // Temporary - check where should we set these values
  dmgMultiplier = 1.5;
  stunDurationInSteps = 20;

  // Always cast ?
  shouldCast(): boolean {
    return true;
  }

  // Prioritize closest enemy unit
  getTarget(unit: Unit, bm: BoardManager): Unit {
    return bm.getClosestAttackTarget(unit);
  }

  getDamageValue(unit: Unit): number {
    return unit.stats.attackDamage * this.dmgMultiplier;
  }

  cast(unit: Unit, bm: BoardManager) {
    const target = this.getTarget(unit, bm);
    const damageValue = this.getDamageValue(unit);

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

    target.receiveDamage(damageValue, unit.currentStep);

    target.applyStatusEffect(STATUS_EFFECT_TYPE.STUN, this.stunDurationInSteps);
  }
}
