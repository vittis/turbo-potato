import { ArmorData } from "./Armor";
import { BoardManager, OWNER, POSITION } from "./BoardManager";
import { Multipliers } from "./data/config";
import { HealingWord } from "./HealingWord";
//import { Skill } from "./Skill";
import { WeaponData } from "./Weapon";

export enum EVENT_TYPE {
  ATTACK = "ATTACK",
  IS_PREPARING_ATTACK = "IS_PREPARING_ATTACK",
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
  armorHp: number;
  maxArmorHp: number;
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

interface StepEvent {
  type: EVENT_TYPE;
  id: string;
  payload?: any;
  step: number;
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
  // RSRS
  skill: HealingWord;

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

    const finalStr = race.str + uClass.str;
    const finalDex = race.dex + uClass.dex;
    const finalInt = race.int + uClass.int;

    const finalHp = uClass.hp * race.hpMultiplier;

    const finalArmor =
      (equipment.chest.implicits?.armor || 0) +
      (equipment.head.implicits?.armor || 0);

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
      armorHp: finalArmor,
      maxArmorHp: finalArmor,
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

    // RSRS
    this.skill = new HealingWord(bm);
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
      // RSRS
      //skill: { ...this.skill },
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

    /* if (this.isPreparingSkill) {
      this.skillDelayBuffer += 10 + this.stats.skillRegen / 10;

      if (this.skillDelayBuffer >= this.stats.skillDelay) {
        this.isPreparingSkill = false;
        this.skillDelayBuffer = 0;

        this.TEST_skillsCounter++;

        this.stats.sp -= 1000;
        this.castSkill();
      }
    }

    if (
      !this.isPreparingSkill &&
      this.canCastSkill() &&
      !this.isPreparingAttack
    ) {
      this.isPreparingSkill = true;
      this.stepEvents.push({
        id: this.id,
        type: EVENT_TYPE.IS_PREPARING_SKILL,
        payload: { skillDelay: this.stats.skillDelay },
        step: this.currentStep,
      });
    } */

    /* if (this.isPreparingAttack) {
      this.attackDelayBuffer += 10 + this.stats.attackSpeed / 10;

      if (this.attackDelayBuffer >= this.stats.attackDelay) {
        this.isPreparingAttack = false;
        this.attackDelayBuffer = 0;

        this.TEST_attacksCounter++;

        const attackTarget = this.bm.getAttackTargetFor(this);
        if (!attackTarget) {
          throw Error("Undefined attack target for " + this.toString());
        }

        this.stats.ap -= 1000;
        this.attackWithMainHand(attackTarget);
      }
    } else {
      if (!this.isPreparingSkill) {
        this.stats.ap += this.stats.attackSpeed;
      }
    }
    if (!this.isPreparingAttack && this.canAttack() && !this.isPreparingSkill) {
      this.TEST_stepsCounter = 0;
      this.isPreparingAttack = true;
      this.stepEvents.push({
        id: this.id,
        type: EVENT_TYPE.IS_PREPARING_ATTACK,
        payload: { attackDelay: this.stats.attackDelay },
        step: this.currentStep,
      });
    } */

    this.stats.ap += this.stats.attackSpeed;
    // this.stats.sp += this.stats.skillRegen;

    if (this.canAttack()) {
      const attackTarget = this.bm.getAttackTargetFor(this);
      if (!attackTarget) {
        throw Error("Undefined attack target for " + this.toString());
      }
      this.stats.ap -= 1000;
      this.attackWithMainHand(attackTarget);
    } else if (this.canCastSkill()) {
      this.castSkill();
    }
  }

  attackWithMainHand(target: Unit) {
    const spGained =
      this.stats.skillRegen * Multipliers.srAtkBase +
      this.stats.skillRegen * this.stats.attackDamage * Multipliers.srAtkMult;
    this.stats.sp += spGained;

    this.stepEvents.push({
      id: this.id,
      type: EVENT_TYPE.ATTACK,
      payload: {
        target: target.id,
        currentAp: this.stats.ap,
        sp: this.stats.sp,
        spGained,
      },
      step: this.currentStep,
    });

    target.receiveDamage(this.stats.attackDamage, this.currentStep);
  }

  castSkill() {
    // RSRS
    this.skill.cast(this);
    this.stats.sp = 0;

    /* this.stepEvents.push({
      id: this.id,
      type: EVENT_TYPE.CAST_SKILL,
      payload: { name: "", sp: this.stats.sp, currentAp: this.stats.ap },
      step: this.currentStep,
    });

    const newHp = Math.min(this.stats.hp + 100, this.stats.maxHp);
    const hpHealed = newHp - this.stats.hp;
    this.stats.hp = newHp;

    this.stepEvents.push({
      id: this.id,
      type: EVENT_TYPE.RECEIVED_HEAL,
      payload: { hp: this.stats.hp, hpHealed },
      step: this.currentStep,
    }); */
  }

  receiveDamage(damage: number, stepItWasAttacked: number) {
    const finalDamage = Math.round((damage * 100) / (this.stats.def + 100));

    if (this.stats.armorHp > 0) {
      this.stats.armorHp -= finalDamage;
      if (this.stats.armorHp < 0) {
        // If the armor is now depleted, apply any remaining damage to the unit's HP
        this.stats.hp += this.stats.armorHp;
        this.stats.armorHp = 0;
      }
    } else {
      this.stats.hp -= Math.round(finalDamage);
    }

    const spGained =
      this.stats.skillRegen * Multipliers.srReceiveDamageBase +
      this.stats.skillRegen * damage * Multipliers.srReceiveDamageMult;
    this.stats.sp += spGained;

    this.stepEvents.push({
      id: this.id,
      type: EVENT_TYPE.RECEIVED_DAMAGE,
      payload: {
        hp: this.stats.hp,
        armorHp: this.stats.armorHp,
        damage: finalDamage,
        sp: this.stats.sp,
        spGained,
      },
      step: stepItWasAttacked,
    });
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

  getName() {
    return `${this.race.name} ${this.class.name}`;
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
}
