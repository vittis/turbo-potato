import { nanoid } from "nanoid";
import { Ability } from "../Ability/Ability";
import { AbilityManager } from "../Ability/AbilityManager";
import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Class } from "../Class/Class";
import { ClassManager } from "../Class/ClassManager";
import { Equipment } from "../Equipment/Equipment";
import { EquipmentManager } from "../Equipment/EquipmentManager";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import {
  EVENT_TYPE,
  FaintEvent,
  INSTANT_EFFECT_TYPE,
  PossibleEvent,
  SubEvent,
  SUBEVENT_TYPE,
  TriggerEffectEvent,
  UseAbilityEvent,
} from "../Event/EventTypes";
import { PerkManager } from "../Perk/PerkManager";
import { StatsManager } from "../Stats/StatsManager";
import { UnitStats } from "../Stats/StatsTypes";
import { StatusEffectManager } from "../StatusEffect/StatusEffectManager";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TriggerManager } from "../Trigger/TriggerManager";
import { TRIGGER, TRIGGER_EFFECT_TYPE } from "../Trigger/TriggerTypes";

// use for better perfomance
/* export enum EVENT_TYPE {
  ATTACK = 0,
  IS_PREPARING_ATTACK = 1,
  RECEIVED_DAMAGE = 2,
  HAS_DIED = 3,
} */

export class Unit {
  id: string;
  owner: OWNER;
  position: POSITION;
  bm: BoardManager;

  isDead = false;

  currentStep = 1;
  stepEvents: PossibleEvent[] = [];

  private statsManager: StatsManager;
  private equipmentManager: EquipmentManager;
  private classManager: ClassManager;
  private abilityManager: AbilityManager;
  private perkManager: PerkManager;
  public statusEffectManager: StatusEffectManager;
  public triggerManager: TriggerManager;

  get stats() {
    return this.statsManager.getStats();
  }
  set stats(stats: UnitStats) {
    this.statsManager.setStats(stats);
  }

  // todo better stats merge
  get statsFromMods() {
    return this.statsManager.getStatsFromMods();
  }

  get triggerEffects() {
    return this.triggerManager.triggerEffects;
  }

  get equips() {
    return this.equipmentManager.equips;
  }

  get equipment() {
    return this.equipmentManager.equips;
  }

  get abilities() {
    return this.abilityManager.abilities;
  }

  get perks() {
    return this.perkManager.perks;
  }

  get statusEffects() {
    return this.statusEffectManager.activeStatusEffects;
  }

  constructor(owner: OWNER, position: POSITION, bm?: BoardManager) {
    this.statsManager = new StatsManager();
    this.equipmentManager = new EquipmentManager();
    this.classManager = new ClassManager();
    this.abilityManager = new AbilityManager();
    this.perkManager = new PerkManager();
    this.statusEffectManager = new StatusEffectManager();
    this.triggerManager = new TriggerManager();
    this.bm = bm as BoardManager;

    this.id = nanoid(8);
    this.owner = owner;
    this.position = position;

    const finalHp = 100;

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

    this.abilityManager.addAbilitiesFromSource(
      equip.getGrantedAbilities(),
      equip.id
    );

    this.abilityManager.applyCooldownModifierFromMods(
      equip.getCooldownModifierStatsMods()
    );

    this.statsManager.addMods(equip.getStatsMods());

    this.triggerManager.addTriggerEffectsFromSource(
      equip.getTriggerEffects(),
      equip.id
    );

    const grantedPerks = equip.getGrantedPerks();
    this.perkManager.addPerksFromSource(grantedPerks, equip.id);
    grantedPerks.forEach((perk) => {
      this.triggerManager.addTriggerEffectsFromSource(
        perk.getTriggerEffects(),
        perk.id
      );
    });
  }

  unequip(slot: EQUIPMENT_SLOT) {
    const equippedItem = this.equipmentManager.unequip(slot);
    this.abilityManager.removeAbilitiesFromSource(equippedItem.equip.id);
    this.statsManager.removeMods(equippedItem.equip.getStatsMods());
    this.perkManager.removePerksFromSource(equippedItem.equip.id);
  }

  setClass(unitClass: Class) {
    this.classManager.setClass(unitClass);
    this.statsManager.setBaseHp(unitClass.getBaseHp());
    this.statsManager.addMods(unitClass.getStatsMods());

    this.abilityManager.addAbilitiesFromSource(
      this.classManager.getClassAbilities(),
      unitClass.data.name
    );

    const grantedPerks = unitClass.getPerks();
    this.perkManager.addPerksFromSource(grantedPerks, unitClass.data.name);
    grantedPerks.forEach((perk) => {
      this.triggerManager.addTriggerEffectsFromSource(
        perk.getTriggerEffects(),
        perk.id
      );
    });
  }

  serialize() {
    return {
      id: this.id,
      owner: this.owner,
      name: this.getName(),
      class: `${this.classManager?.class?.data?.name}`,
      stats: {
        ...this.stats,
      },
      abilities: this.abilities,
      equipment: this.equipment,
      position: this.position,
      statusEffects: [...this.statusEffects],
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
        const event = ability.use(this);
        if (event) {
          this.stepEvents.push(event);
        }
      }
    });

    // add step logic
  }

  applySubEvents(subEvents: SubEvent[]) {
    subEvents.forEach((subEvent) => {
      const target = this.bm.getUnitById(subEvent.payload.targetId);

      if (subEvent.payload.type === INSTANT_EFFECT_TYPE.DAMAGE) {
        target.receiveDamage(subEvent.payload.payload.value);
      }

      if (subEvent.payload.type === INSTANT_EFFECT_TYPE.STATUS_EFFECT) {
        subEvent.payload.payload.forEach((statusEffect) => {
          if (statusEffect.quantity > 0) {
            target.statusEffectManager.applyStatusEffect(statusEffect);
          } else {
            target.statusEffectManager.removeStacks(
              statusEffect.name,
              statusEffect.quantity * -1
            );
          }
        });

        target.statsManager.recalculateStatsFromStatusEffects(
          target.statusEffects
        );
      }

      if (subEvent.payload.type === INSTANT_EFFECT_TYPE.SHIELD) {
        target.receiveShield(subEvent.payload.payload.value);
      }

      if (subEvent.payload.type === INSTANT_EFFECT_TYPE.HEAL) {
        target.receiveHeal(subEvent.payload.payload.value);
      }
    });
  }

  applyEvent(event: PossibleEvent) {
    if (event.type === EVENT_TYPE.USE_ABILITY) {
      this.applySubEvents((event as UseAbilityEvent).payload.subEvents);
    }
    if (event.type === EVENT_TYPE.TRIGGER_EFFECT) {
      this.applySubEvents((event as TriggerEffectEvent).subEvents);
    }
  }

  receiveDamage(damage: number) {
    let newHp = this.stats.hp;
    let newShield = this.stats.shield;

    const finalDamage = damage;

    if (newShield > 0) {
      newShield -= finalDamage;
      if (newShield < 0) {
        // If the armor is now depleted, apply any remaining damage to the unit's HP
        newHp += newShield;
        newHp += newShield;
        newShield = 0;
      }
    } else {
      newHp = Math.max(newHp - finalDamage, 0);
    }

    this.stats = { ...this.stats, hp: newHp, shield: newShield };

    this.statsManager.recalculateStatsFromStatusEffects(this.statusEffects);
  }

  receiveShield(shieldAmount: number) {
    const newShield = this.stats.shield + shieldAmount;

    this.stats.shield = newShield;
  }

  receiveHeal(healAmount: number) {
    const newHp = Math.min(this.stats.hp + healAmount, this.stats.maxHp);

    this.stats.hp = newHp;
  }

  onDeath() {
    if (this.isDead) {
      throw Error(`Unit ${this.toString()} is already dead`);
    }
    this.isDead = true;

    // todo add other death triggers

    const teamUnits = this.bm.getAllUnitsOfOwner(this.owner);
    teamUnits.forEach((teamUnit) => {
      if (!teamUnit.isDead && teamUnit.id !== this.id) {
        teamUnit.triggerManager.onTrigger(
          TRIGGER.ALLY_FAINT,
          teamUnit,
          this.bm
        );
      }
    });

    this.triggerManager.onTrigger(TRIGGER.SELF_FAINT, this, this.bm);

    this.stepEvents.push({
      actorId: this.id,
      type: EVENT_TYPE.FAINT,
      step: this.currentStep,
    });
  }

  hasDied() {
    return this.stats.hp <= 0;
  }

  getPercentageHp() {
    return this.stats.hp / this.stats.maxHp;
  }

  getName() {
    return `${this.owner}${this.position} ${this.classManager?.class?.data?.name}`;
  }

  public toString = (): string => {
    return `${this.owner}${this.position} ${this.classManager?.class?.data?.name}`;
  };
}
