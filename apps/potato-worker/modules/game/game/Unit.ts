import { ArmorData } from "./Armor";
import { BoardManager, OWNER, POSITION } from "./BoardManager";
import { Multipliers } from "./data/config";
import { HeadCrush } from "./HeadCrush";
import { HealingWord } from "./HealingWord";
import { Powershot } from "./Powershot";
import { SKILL, STATUS_EFFECT_TYPE, StatusEffect } from "./Skill";
import { WeaponData } from "./Weapon";

export enum EVENT_TYPE {
  ATTACK = "ATTACK",
  RECEIVED_DAMAGE = "RECEIVED_DAMAGE",
  HAS_DIED = "HAS_DIED",
  CAST_SKILL = "CAST_SKILL",
  IS_PREPARING_SKILL = "IS_PREPARING_SKILL",
  RECEIVED_HEAL = "RECEIVED_HEAL",
}

// use for better perfomance
/* export enum EVENT_TYPE {
  ATTACK = 0,
  IS_PREPARING_ATTACK = 1,
  RECEIVED_DAMAGE = 2,
  HAS_DIED = 3,
} */

export interface UnitStats {
  str: number;
  dex: number;
  int: number;
  hp: number;
  maxHp: number;
  shield: number;
  def: number;
  attackSpeed: number;
  attackDelay: number;
  ap: number;
  skillRegen: number;
  skillDelay: number;
  sp: number;
  attackDamage: number;
  weight: number;
  level: number;
}

export interface RaceData {
  name: string;
  hpMultiplier: number;
  str: number;
  dex: number;
  int: number;
}

export interface ClassData {
  name: string;
  hp: number;
  str: number;
  dex: number;
  int: number;
  tier: number;
  statsBonus?: { armor?: number };
  defaultSkill: SKILL | string;
}

interface UnitData {
  race: RaceData;
  class: ClassData;
}

export interface Equipment {
  mainHandWeapon: WeaponData;
  chest: ArmorData;
  head: ArmorData;
}

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
  stats: UnitStats;
  race: RaceData;
  class: ClassData;
  equipment: Equipment;
  owner: OWNER;
  position: POSITION;
  bm: BoardManager;

  isPreparingAttack = false;
  attackDelayBuffer = 0;

  isPreparingSkill = false;
  skillDelayBuffer = 0;
  isDead = false;

  TEST_attacksCounter = 0;
  TEST_skillsCounter = 0;
  TEST_stepsCounter = 0;

  currentStep = 0;
  stepEvents: StepEvent[] = [];

  // Fix - use type Skill ?
  skill: HealingWord | Powershot | HeadCrush;

  statusEffects: StatusEffect[] = [];

  constructor(
    bm: BoardManager,
    owner: OWNER,
    position: POSITION,
    race: RaceData,
    uClass: ClassData,
    equipment: Equipment
  ) {
    this.id = `${owner}${position}`;
    this.bm = bm;
    this.owner = owner;
    this.position = position;

    this.race = race;
    this.class = uClass;
    this.equipment = equipment;

    this.skill = this.getSkillByName(uClass.defaultSkill);

    const finalStr = race.str + uClass.str;
    const finalDex = race.dex + uClass.dex;
    const finalInt = race.int + uClass.int;

    const finalHp = uClass.hp * race.hpMultiplier;

    const finalShield =
      (equipment.chest.implicits?.shield || 0) +
      (equipment.head.implicits?.shield || 0);

    const finalDef = finalStr * Multipliers.defStrBonus;

    const finalAttackSpeed =
      this.equipment.mainHandWeapon.attackSpeed *
      (1 + (finalDex * Multipliers.asDexMult) / 100);

    const finalAttackDelay = this.equipment.mainHandWeapon.attackDelay;

    const finalAttackDamage = Math.round(
      this.equipment.mainHandWeapon.damage *
        (1 +
          (finalStr * this.equipment.mainHandWeapon.strScale +
            finalDex * this.equipment.mainHandWeapon.dexScale +
            finalInt * this.equipment.mainHandWeapon.intScale) /
            100)
    );

    const finalSkillRegen = 10 * (1 + (finalInt * Multipliers.srIntMult) / 100);

    const finalSkillDelay = 10 * finalSkillRegen; // temporary

    this.stats = {
      str: finalStr,
      dex: finalDex,
      int: finalInt,
      hp: finalHp,
      maxHp: finalHp,
      shield: finalShield,
      def: finalDef,
      attackSpeed: finalAttackSpeed,
      attackDelay: finalAttackDelay,
      ap: 0,
      skillRegen: finalSkillRegen,
      skillDelay: finalSkillDelay,
      sp: 0,
      attackDamage: finalAttackDamage,
      weight: 10,
      level: 1,
    };
  }

  serialize() {
    return {
      id: this.id,
      owner: this.owner,
      name: this.getName(),
      equipment: {
        mainHandWeapon: {
          ...this.equipment.mainHandWeapon,
        },
        chest: { ...this.equipment.chest },
        head: { ...this.equipment.head },
      },
      stats: {
        ...this.stats,
      },
      position: this.position,
      skill: {
        name: this.skill.name,
        description: this.skill.description,
      },
      class: {
        name: this.class.name,
      },
      race: {
        name: this.race.name,
      },
    };
  }

  serializeEvents() {
    const events = [...this.stepEvents];
    this.stepEvents = [];
    return events;
  }

  step(stepNumber: number) {
    if (stepNumber === 0) console.log(this);
    this.currentStep = stepNumber;
    this.TEST_stepsCounter++;

    this.checkStatusEffects();

    if (this.hasStatusEffect(STATUS_EFFECT_TYPE.STUN)) return;

    this.stats.ap += this.stats.attackSpeed;

    if (this.canCastSkill()) {
      this.castSkill();
    } else if (this.canAttack()) {
      const attackTarget = this.bm.getClosestAttackTarget(this);
      if (!attackTarget) {
        throw Error("Undefined attack target for " + this.toString());
      }
      this.stats.ap -= 1000;
      this.attack(attackTarget);
    }
  }

  attack(target: Unit) {
    const spGained =
      this.stats.skillRegen * Multipliers.srAtkBase +
      this.stats.skillRegen * this.stats.attackDamage * Multipliers.srAtkMult;
    this.stats.sp += spGained;

    const receiveDamageEvent = target.receiveDamage(
      this.stats.attackDamage,
      this.currentStep
    );

    this.stepEvents.push({
      actorId: this.id,
      type: EVENT_TYPE.ATTACK,
      payload: {
        targetsId: [target.id],
        stats: {
          ap: this.stats.ap,
          sp: this.stats.sp,
        },
        modifiers: {
          sp: spGained,
        },
      },
      step: this.currentStep,
      subEvents: [receiveDamageEvent],
    });
  }

  castSkill() {
    if (this.skill.shouldCast(this, this.bm)) {
      this.skill.cast(this, this.bm);
      this.skill.afterExecute(this);
    }
  }

  receiveDamage(damage: number, stepItWasAttacked: number) {
    const finalDamage = Math.round((damage * 100) / (this.stats.def + 100));

    if (this.stats.shield > 0) {
      this.stats.shield -= finalDamage;
      if (this.stats.shield < 0) {
        // If the armor is now depleted, apply any remaining damage to the unit's HP
        this.stats.hp += this.stats.shield;
        this.stats.shield = 0;
      }
    } else {
      this.stats.hp -= Math.round(finalDamage);
    }

    const spGained =
      this.stats.skillRegen * Multipliers.srReceiveDamageBase +
      this.stats.skillRegen * damage * Multipliers.srReceiveDamageMult;
    this.stats.sp += spGained;

    const receiveDamageEvent: SubStepEvent = {
      actorId: this.id,
      type: EVENT_TYPE.RECEIVED_DAMAGE,
      payload: {
        stats: {
          hp: this.stats.hp,
          shield: this.stats.shield,
          sp: this.stats.sp,
        },
        modifiers: {
          hp: finalDamage * -1,
          sp: spGained,
        },
      },
    };

    return receiveDamageEvent;
  }

  receiveHeal(healValue: number, stepItWasHealed: number) {
    const newHp = Math.min(this.stats.hp + healValue, this.stats.maxHp);
    const hpHealed = newHp - this.stats.hp;

    this.stats.hp = newHp;

    const receiveHealEvent: SubStepEvent = {
      actorId: this.id,
      type: EVENT_TYPE.RECEIVED_HEAL,
      payload: {
        stats: {
          hp: this.stats.hp,
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

  canAttack() {
    return this.stats.ap >= 1000;
  }

  canCastSkill() {
    return this.stats.sp >= 1000;
  }

  getPercentageHp() {
    return this.stats.hp / this.stats.maxHp;
  }

  getName() {
    return `${this.race.name} ${this.class.name}`;
  }

  applyStatusEffect(
    type: STATUS_EFFECT_TYPE,
    durationInSteps: number,
    value?: number
  ) {
    const sameTypeAlreadyApplied = this.statusEffects.find(
      (statusEffect) => statusEffect.type === type
    );

    if (
      (sameTypeAlreadyApplied &&
        durationInSteps > sameTypeAlreadyApplied.durationInSteps) ||
      !sameTypeAlreadyApplied
    ) {
      let newArrStatusEffects = this.statusEffects;

      if (sameTypeAlreadyApplied) {
        newArrStatusEffects = this.statusEffects.filter(
          (statusEffect) => statusEffect.type !== type
        );
      }

      const newStatusEffect = {
        type,
        durationInSteps,
        ...(value && { value }),
      };

      newArrStatusEffects.push(newStatusEffect);

      this.statusEffects = newArrStatusEffects;
    }
  }

  checkStatusEffects() {
    this.statusEffects.forEach((statusEffect) => {
      statusEffect.durationInSteps -= 1;
    });

    this.statusEffects = this.statusEffects.filter(
      (statusEffect) => statusEffect.durationInSteps > 0
    );
  }

  hasStatusEffect(type: STATUS_EFFECT_TYPE) {
    return !!this.statusEffects.find(
      (statusEffect) => statusEffect.type === type
    );
  }

  public toString = (): string => {
    return `${this.race.name.substring(0, 1)}${this.class.name.substring(
      0,
      1
    )}`;
  };

  printAp() {
    console.log(this.stats.ap);
    let bar = "|";
    for (let i = 0; i < 20; i++) {
      if (i / 20 <= this.stats.ap / 1000) bar += "-";
      else bar += " ";
    }
    bar += "|";
    console.log(bar);
  }

  //Temporary - move function elsewhere
  getSkillByName(name: string) {
    switch (name) {
      case SKILL.HEALING_WORD:
        return new HealingWord();
      case SKILL.POWERSHOT:
        return new Powershot();
      case SKILL.HEAD_CRUSH:
        return new HeadCrush();
      default:
        return new HealingWord();
    }
  }
}
