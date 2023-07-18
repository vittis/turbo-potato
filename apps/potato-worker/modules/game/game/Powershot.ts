import { BoardManager, ROW } from "./BoardManager";
import { Skill } from "./Skill";
import { EVENT_TYPE, Unit } from "./Unit";

/*
  Class - Ranger
  Effect - Damages all enemies in one row
*/

export class Powershot extends Skill {
  name = "Powershot";
  description = "Damages all enemies in one row";

  // Temporary - check where should we set these values
  dmgMultiplier = 1.5;

  // Always cast ?
  shouldCast(): boolean {
    return true;
  }

  // Prioritize row with more units, then row with units closer to dying, then same row
  getTarget(unit: Unit, bm: BoardManager): Unit[] {
    const enemiesTopRow = bm.getAllUnitsInRow(
      bm.getEnemyOwner(unit.owner),
      ROW.TOP
    );
    const enemiesBotRow = bm.getAllUnitsInRow(
      bm.getEnemyOwner(unit.owner),
      ROW.BOT
    );

    if (enemiesTopRow.length > enemiesBotRow.length) return enemiesTopRow;
    if (enemiesBotRow.length > enemiesTopRow.length) return enemiesBotRow;

    const enemiesTopRowPercentageHp = enemiesTopRow.reduce(
      (target, enemy) => target + enemy.getPercentageHp(),
      0
    );

    const enemiesBotRowPercentageHp = enemiesBotRow.reduce(
      (target, enemy) => target + enemy.getPercentageHp(),
      0
    );

    if (enemiesTopRowPercentageHp < enemiesBotRowPercentageHp)
      return enemiesTopRow;
    if (enemiesBotRowPercentageHp < enemiesTopRowPercentageHp)
      return enemiesBotRow;

    return bm.getUnitRow(unit) === ROW.TOP ? enemiesTopRow : enemiesBotRow;
  }

  getDamageValue(unit: Unit): number {
    return unit.stats.attackDamage * this.dmgMultiplier;
  }

  cast(unit: Unit, bm: BoardManager) {
    const targets = this.getTarget(unit, bm);
    const damageValue = this.getDamageValue(unit);

    const receiveDamageEvents = targets.map((target) =>
      target.receiveDamage(damageValue)
    );

    unit.stepEvents.push({
      actorId: unit.id,
      type: EVENT_TYPE.CAST_SKILL,
      payload: {
        skillName: this.name,
        targetsId: targets.map((target) => target.id),
        modifiers: {
          sp: unit.stats.sp * -1,
        },
      },
      step: unit.currentStep,
      subEvents: receiveDamageEvents,
    });
  }
}
