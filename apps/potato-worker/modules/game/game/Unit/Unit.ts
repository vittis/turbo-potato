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
  Event,
  EVENT_TYPE,
  INSTANT_EFFECT_TYPE,
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
  stepEvents: Event[] = [];

  private statsManager: StatsManager;
  private equipmentManager: EquipmentManager;
  private classManager: ClassManager;
  private abilityManager: AbilityManager;
  private perkManager: PerkManager;
  public statusEffectManager: StatusEffectManager;
  private triggerManager: TriggerManager;

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

    this.perkManager.addPerksFromSource(equip.getGrantedPerks(), equip.id);
    // todo add triggers from perks

    this.triggerManager.addTriggerEffectsFromSource(
      equip.getTriggerEffects(),
      equip.id
    );
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

    // todo add perks
    // todo add triggers effects
  }

  serialize() {
    return {
      id: this.id,
      owner: this.owner,
      name: this.getName(),
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
      if (subEvent.payload.type === INSTANT_EFFECT_TYPE.DAMAGE) {
        const target = this.bm.getUnitById(subEvent.payload.targetsId[0]);
        target.receiveDamage(subEvent.payload.payload.value);
      }

      if (subEvent.payload.type === INSTANT_EFFECT_TYPE.STATUS_EFFECT) {
        const target = this.bm.getUnitById(subEvent.payload.targetsId[0]);

        subEvent.payload.payload.forEach((statusEffect) => {
          target.statusEffectManager.applyStatusEffect(statusEffect);
        });

        target.statsManager.recalculateStatsFromStatusEffects(
          target.statusEffects
        );
      }
    });
  }

  applyEvent(event: Event) {
    if (event.type === EVENT_TYPE.USE_ABILITY) {
      this.applySubEvents((event as UseAbilityEvent).payload.subEvents);
    }
    if (event.type === EVENT_TYPE.TRIGGER_EFFECT) {
      this.applySubEvents((event as TriggerEffectEvent).subEvents);
    }
  }

  onBattleStart() {
    const battleStartEffects = this.triggerManager.getAllEffectsForTrigger(
      TRIGGER.BATTLE_START
    );

    let subEvents: SubEvent[] = [];

    battleStartEffects.forEach((activeEffect) => {
      const targets = this.bm.getTarget(this, activeEffect.effect.target);

      if (activeEffect.effect.type === TRIGGER_EFFECT_TYPE.STATUS_EFFECT) {
        subEvents.push({
          type: SUBEVENT_TYPE.INSTANT_EFFECT,
          payload: {
            type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
            targetsId: targets.map((target) => target.id),
            payload: activeEffect.effect.payload.map((statusEffect) => ({
              name: statusEffect.name,
              quantity: statusEffect.quantity as number,
            })),
          },
        });
      } else if (activeEffect.effect.type === TRIGGER_EFFECT_TYPE.DAMAGE) {
        subEvents.push({
          type: SUBEVENT_TYPE.INSTANT_EFFECT,
          payload: {
            type: INSTANT_EFFECT_TYPE.DAMAGE,
            targetsId: targets.map((target) => target.id),
            payload: { value: activeEffect.effect.payload.value },
          },
        });
      }
    });

    if (subEvents.length > 0) {
      const event: TriggerEffectEvent = {
        actorId: this.id,
        step: this.currentStep,
        type: EVENT_TYPE.TRIGGER_EFFECT,
        subEvents,
      };

      this.stepEvents.push(event);
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
        newShield = 0;
      }
    } else {
      newHp -= Math.round(finalDamage);
    }

    this.stats = { ...this.stats, hp: newHp, shield: newShield };

    this.statsManager.recalculateStatsFromStatusEffects(this.statusEffects);
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
    return `${this.owner}${this.position} ${this.classManager?.class?.data?.name}`;
  }

  public toString = (): string => {
    return `${this.owner}${this.position} ${this.classManager?.class?.data?.name}`;
  };
}
