import { TARGET_TYPE } from "../Target/TargetTypes";
import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { sortAndExecuteEvents } from "../Event/EventUtils";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { Unit } from "../Unit/Unit";
import { Weapons } from "../data";
import { TriggerManager } from "./TriggerManager";
import { TRIGGER, TRIGGER_EFFECT_TYPE, TriggerEffect } from "./TriggerTypes";

const effectsMock: TriggerEffect[] = [
  {
    type: TRIGGER_EFFECT_TYPE.GRANT_STATUS_EFFECT,
    trigger: TRIGGER.ON_HIT,
    target: TARGET_TYPE.HIT_TARGET,
    payload: [
      {
        name: STATUS_EFFECT.VULNERABLE,
        quantity: 20,
      },
    ],
  },
  {
    type: TRIGGER_EFFECT_TYPE.GRANT_STATUS_EFFECT,
    trigger: TRIGGER.BATTLE_START,
    target: TARGET_TYPE.SELF,
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

      expect(unit.triggerEffects).toHaveLength(2);

      expect(unit.triggerEffects[0].effect).toEqual({
        type: "GRANT_STATUS_EFFECT",
        trigger: "ON_HIT",
        target: "HIT_TARGET",
        payload: [
          {
            name: "VULNERABLE",
            quantity: 20,
          },
        ],
      });
    });
  });

  describe("BATTLE_START", () => {
    it("should generate event and apply trigger effect on battle start (from AXE)", () => {
      const bm = new BoardManager();

      const unit = new Unit(OWNER.TEAM_ONE, POSITION.BOT_MID, bm);
      bm.addToBoard(unit);

      unit.equip(new Equipment(Weapons.Axe), EQUIPMENT_SLOT.MAIN_HAND);

      unit.onBattleStart();

      sortAndExecuteEvents(bm, unit.serializeEvents());

      expect(unit.statusEffects).toHaveLength(2);
    });
  });
});