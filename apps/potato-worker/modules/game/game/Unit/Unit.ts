import { Ability } from "../Ability/Ability";
import { AbilityManager } from "../Ability/AbilityManager";
import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Class } from "../Class/Class";
import { ClassManager } from "../Class/ClassManager";
import { Multipliers } from "../data/config";
import { Equipment } from "../Equipment/Equipment";
import { EquipmentManager } from "../Equipment/EquipmentManager";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { StatsManager } from "../Stats/StatsManager";
import { UnitStats } from "../Stats/StatsTypes";

export enum EVENT_TYPE {
  ATTACK = "ATTACK",
  RECEIVED_DAMAGE = "RECEIVED_DAMAGE",
  HAS_DIED = "HAS_DIED",
  CAST_SKILL = "CAST_SKILL",
  RECEIVED_HEAL = "RECEIVED_HEAL",
  RECEIVED_DISABLE = "RECEIVED_DISABLE",
}

// use for better perfomance
/* export enum EVENT_TYPE {
  ATTACK = 0,
  IS_PREPARING_ATTACK = 1,
  RECEIVED_DAMAGE = 2,
  HAS_DIED = 3,
} */

type SubStepEvent = Omit<StepEvent, "step" | "subEvents">;

interface StepEvent {
  actorId: string;
  type: EVENT_TYPE;
  payload?: any;
  step: number;
  subEvents?: SubStepEvent[];
}

export class Unit {
  id: string;
  owner: OWNER;
  position: POSITION;
  bm: BoardManager;

  isDead = false;

  currentStep = 0;
  stepEvents: StepEvent[] = [];

  statsManager: StatsManager;
  equipmentManager: EquipmentManager;
  classManager: ClassManager;
  abilityManager: AbilityManager;

  get stats() {
    return this.statsManager.getStats();
  }

  set stats(stats: UnitStats) {
    this.statsManager.setStats(stats);
  }

  get equipment() {
    return this.equipmentManager.equips;
  }

  get abilities() {
    return this.abilityManager.getAbilities();
  }

  constructor(owner: OWNER, position: POSITION, bm?: BoardManager) {
    this.statsManager = new StatsManager();
    this.equipmentManager = new EquipmentManager();
    this.classManager = new ClassManager();
    this.abilityManager = new AbilityManager();
    this.bm = bm as BoardManager;

    this.id = `${owner}${position}`;
    this.owner = owner;
    this.position = position;

    const finalHp = 200;

    const finalShield = 0;

    this.statsManager.initializeStats({
      hp: finalHp,
      maxHp: finalHp,
      shield: finalShield,
      attackCooldownModifier: 0,
      attackDamageModifier: 0,
      spellCooldownModifier: 0,
      spellDamageModifier: 0,
      damageReductionModifier: 0,
    });
  }

  equip(equip: Equipment, slot: EQUIPMENT_SLOT) {
    this.equipmentManager.equip(equip, slot);
    this.abilityManager.addAbilities(equip.getGrantedAbilities());
  }

  setClass(unitClass: Class) {
    this.classManager.setClass(unitClass);
    this.abilityManager.addAbilities(this.classManager.getClassAbilities());
  }

  serialize() {
    return {
      id: this.id,
      owner: this.owner,
      name: this.getName(),
      stats: {
        ...this.stats,
      },
      position: this.position,
    };
  }

  serializeEvents() {
    const events = [...this.stepEvents];
    this.stepEvents = [];
    return events;
  }

  step(stepNumber: number) {
    this.currentStep = stepNumber;

    //this.decreaseDisables();

    this.abilities.forEach((ability) => {
      ability.step();
      if (ability.canActivate()) {
        ability.use(this);
      }
    });

    // add step logic
  }

  applyStatsModifiersAfterEvent(event: any) {
    if (event.payload.modifiers?.hp) {
      this.stats.hp += event.payload.modifiers.hp;
    }
    if (event.payload.modifiers?.shield) {
      this.stats.shield += event.payload.modifiers.shield;
    }
    /* if (event.type === EVENT_TYPE.RECEIVED_DISABLE) {
      if (event.payload.apply) {
        this.disables.push({
          type: event.payload.disableName,
          duration: event.payload.stats.duration,
        });
      } else {
        this.disables.forEach((disable) => {
          if (disable.type === event.payload.disableName) {
            disable.duration += event.payload.modifiers.duration;
          }
        });
      }
    } */
  }

  /* attack(target: Unit) {
    let newSp = this.stats.sp;

    const spGained =
      this.stats.skillRegen * Multipliers.srAtkBase +
      this.stats.skillRegen * this.stats.attackDamage * Multipliers.srAtkMult;
    newSp += spGained;

    const receiveDamageEvent = target.receiveDamage(this.stats.attackDamage);

    this.stepEvents.push({
      actorId: this.id,
      type: EVENT_TYPE.ATTACK,
      payload: {
        targetsId: [target.id],
        stats: {
          ap: this.stats.ap,
          sp: newSp,
        },
        modifiers: {
          ap: -1000, // sepa criar variavel pra isso
          sp: spGained,
        },
      },
      step: this.currentStep,
      subEvents: [receiveDamageEvent],
    });
  } */

  receiveDamage(damage: number) {
    let newHp = this.stats.hp;
    let newShield = this.stats.shield;

    const finalDamage = Math.round(damage);

    if (newShield > 0) {
      newShield -= finalDamage;
      if (newShield < 0) {
        // If the armor is now depleted, apply any remaining damage to the unit's HP
        newHp += newShield;
        newShield = 0;
      }
    } else {
      newHp -= Math.round(finalDamage);
    }

    const receiveDamageEvent: SubStepEvent = {
      actorId: this.id,
      type: EVENT_TYPE.RECEIVED_DAMAGE,
      payload: {
        stats: {
          hp: newHp,
          shield: newShield,
        },
        modifiers: {
          hp: (this.stats.hp - newHp) * -1,
          shield: (this.stats.shield - newShield) * -1,
        },
      },
    };

    return receiveDamageEvent;
  }

  receiveHeal(healValue: number) {
    let newHp = this.stats.hp;

    const hpAfterHeal = Math.min(this.stats.hp + healValue, this.stats.maxHp);
    const hpHealed = hpAfterHeal - this.stats.hp;

    newHp = hpAfterHeal;

    const receiveHealEvent: SubStepEvent = {
      actorId: this.id,
      type: EVENT_TYPE.RECEIVED_HEAL,
      payload: {
        stats: {
          hp: newHp,
        },
        modifiers: {
          hp: hpHealed,
        },
      },
    };

    return receiveHealEvent;
  }

  markAsDead() {
    if (this.isDead) {
      throw Error("Unit is already dead");
    }
    this.isDead = true;
  }

  hasDied() {
    return this.stats.hp <= 0;
  }

  getPercentageHp() {
    return this.stats.hp / this.stats.maxHp;
  }

  getName() {
    return `Unit New`;
  }

  /* receiveDisable(type: DISABLE_TYPE, duration: number) {
    let newDuration = duration;
    let modifiedDuration = duration;

    const sameTypeAlreadyApplied = this.disables.find(
      (disable) => disable.type === type
    );

    if (sameTypeAlreadyApplied) {
      if (duration > sameTypeAlreadyApplied.duration) {
        modifiedDuration -= sameTypeAlreadyApplied.duration;
      } else {
        newDuration = sameTypeAlreadyApplied.duration;
        modifiedDuration = 0;
      }
    }

    const receiveDisableEvent: SubStepEvent = {
      actorId: this.id,
      type: EVENT_TYPE.RECEIVED_DISABLE,
      payload: {
        disableName: DISABLE_TYPE.STUN,
        apply: !!!sameTypeAlreadyApplied, //check if working
        stats: {
          duration: newDuration,
        },
        modifiers: {
          duration: modifiedDuration,
        },
      },
    };

    return receiveDisableEvent;
  }

  decreaseDisables() {
    if (!this.disables) return;

    this.disables.forEach((disable) => {
      disable.duration -= 1;
    });

    this.disables = this.disables.filter((disable) => disable.duration > 0);
  }

  hasDisable(type: DISABLE_TYPE) {
    return !!this.disables.find((disable) => disable.type === type);
  } */

  public toString = (): string => {
    return `unit new`;
  };
}
