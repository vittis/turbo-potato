import { TARGET_TYPE } from "../Target/TargetTypes";
import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { sortAndExecuteEvents } from "../Event/EventUtils";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { Unit } from "../Unit/Unit";
import { Weapons } from "../data";
import { TriggerManager } from "./TriggerManager";
import {
  PossibleTriggerEffect,
  TRIGGER,
  TRIGGER_EFFECT_TYPE,
} from "./TriggerTypes";

const effectsMock: PossibleTriggerEffect[] = [
  {
    type: TRIGGER_EFFECT_TYPE.STATUS_EFFECT,
    trigger: TRIGGER.ON_HIT,
    target: TARGET_TYPE.HIT_TARGET,
    conditions: [],
    payload: [
      {
        name: STATUS_EFFECT.VULNERABLE,
        quantity: 20,
      },
    ],
  },
  {
    type: TRIGGER_EFFECT_TYPE.STATUS_EFFECT,
    trigger: TRIGGER.BATTLE_START,
    target: TARGET_TYPE.SELF,
    conditions: [],
    payload: [
      {
        name: STATUS_EFFECT.ATTACK_POWER,
        quantity: 20,
      },
    ],
  },
];

describe("Triggers", () => {
  describe("TriggerManager", () => {
    test("should add", () => {
      const manager = new TriggerManager();
      manager.addTriggerEffectsFromSource(effectsMock, "sourceId");
      expect(manager.triggerEffects).toHaveLength(2);
    });

    test("should remove", () => {
      const manager = new TriggerManager();

      manager.addTriggerEffectsFromSource(effectsMock, "sourceId");
      manager.removeTriggerEffectsFromSource("sourceId");

      expect(manager.triggerEffects).toHaveLength(0);
    });

    test("should get all trigers of type", () => {
      const manager = new TriggerManager();

      manager.addTriggerEffectsFromSource(effectsMock, "sourceId");
      const effects = manager.getAllEffectsForTrigger(TRIGGER.BATTLE_START);

      expect(effects).toHaveLength(1);
    });
  });

  describe("From equipment", () => {
    test("should add trigger effect for AXE", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.BOT_MID);

      unit.equip(new Equipment(Weapons.Axe), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.triggerEffects).toHaveLength(3);

      expect(unit.triggerEffects[0].effect).toEqual({
        type: "STATUS_EFFECT",
        trigger: "ON_HIT",
        target: "HIT_TARGET",
        conditions: [],
        payload: [
          {
            name: "VULNERABLE",
            quantity: 20,
          },
        ],
      });
    });
  });

  describe("From perk", () => {
    // todo fix this test by using a weapon that only gives focused mind
    test.skip("should add trigger effect from FOCUSED MIND (from WAND)", () => {
      const unit = new Unit(OWNER.TEAM_ONE, POSITION.BOT_MID);

      unit.equip(new Equipment(Weapons.Wand), EQUIPMENT_SLOT.MAIN_HAND);

      expect(unit.triggerEffects).toHaveLength(1);

      expect(unit.triggerEffects[0].effect).toEqual({
        type: "STATUS_EFFECT",
        trigger: "BATTLE_START",
        target: "SELF",
        payload: [{ name: "FOCUS", quantity: 5 }],
      });
    });
  });

  describe("BATTLE_START", () => {
    it("should generate event and apply trigger effect on battle start (from AXE)", () => {
      const bm = new BoardManager();

      const unit = new Unit(OWNER.TEAM_ONE, POSITION.BOT_MID, bm);
      bm.addToBoard(unit);

      unit.equip(new Equipment(Weapons.Axe), EQUIPMENT_SLOT.MAIN_HAND);

      unit.triggerManager.onTrigger(TRIGGER.BATTLE_START, unit, bm);

      sortAndExecuteEvents(bm, unit.serializeEvents());

      expect(unit.statusEffects).toHaveLength(2);

      expect(unit.stats.hp).toBe(unit.stats.maxHp - 50);
    });
  });
});
