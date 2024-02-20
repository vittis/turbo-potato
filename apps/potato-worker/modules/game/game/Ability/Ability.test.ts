import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Class } from "../Class/Class";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TRIGGER_EFFECT_TYPE, TriggerEffect } from "../Trigger/TriggerTypes";
import { Unit } from "../Unit/Unit";
import { Abilities, Classes, Weapons } from "../data";
import { Ability, VULNERABLE_LOSS_PER_HIT } from "./Ability";

function setupBoard() {
  const bm = new BoardManager();
  const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
  const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
  const unit3 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_MID, bm);
  const unit4 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_BACK, bm);
  bm.addToBoard(unit1);
  bm.addToBoard(unit2);
  bm.addToBoard(unit3);
  bm.addToBoard(unit4);
  return { bm, unit1, unit2, unit3, unit4 };
}

describe("Ability", () => {
  describe("Events", () => {
    describe("USE_ABILITY Event", () => {
      it("should generate main event info", () => {
        const { unit1, unit2 } = setupBoard();

        const ability = new Ability(Abilities.Thrust);
        const event = ability.use(unit1);

        expect(event.actorId).toBe(unit1.id);
        expect(event.payload.name).toBe(ability.data.name);
        expect(event.payload.targetsId).toEqual([unit2.id]);
      });

      describe("DAMAGE subEvent", () => {
        it("should generate DAMAGE subEvent", () => {
          const { unit1, unit2 } = setupBoard();

          const ability = new Ability(Abilities.Thrust);
          const event = ability.use(unit1);

          const effects = ability.data
            .effects as TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>[];

          expect(event.payload.subEvents).toHaveLength(1);
          expect(event.payload.subEvents[0]).toEqual({
            type: "INSTANT_EFFECT",
            payload: {
              type: "DAMAGE",
              targetId: unit2.id,
              payload: { value: effects[0].payload.value },
            },
          });
        });

        it("should calculate correct damage if target has damage reduction modifier", () => {
          const { unit1, unit2 } = setupBoard();

          // receives damage reduction
          unit2.setClass(new Class(Classes.Blacksmith));

          const ability = new Ability(Abilities.Thrust);
          const event = ability.use(unit1);

          const effects = ability.data
            .effects as TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>[];

          const rawDamage = effects[0].payload.value;
          const finalDamage =
            rawDamage +
            (rawDamage *
              (unit1.stats.attackDamageModifier -
                unit2.stats.damageReductionModifier)) /
              100;

          expect(event.payload.subEvents).toHaveLength(1);
          expect(event.payload.subEvents[0]).toEqual({
            type: "INSTANT_EFFECT",
            payload: {
              type: "DAMAGE",
              targetId: unit2.id,
              payload: {
                value: finalDamage,
              },
            },
          });
        });

        it("should calculate correct damage if target has damage reduction modifier and attacker has attack damage modifier", () => {
          const { unit1, unit2 } = setupBoard();

          unit1.equip(
            new Equipment(Weapons.ShortSpear),
            EQUIPMENT_SLOT.MAIN_HAND
          );

          // receives damage reduction
          unit2.setClass(new Class(Classes.Blacksmith));

          const ability = new Ability(Abilities.Thrust);
          const event = ability.use(unit1);

          const effects = ability.data
            .effects as TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>[];

          const rawDamage = effects[0].payload.value;
          const finalDamage =
            rawDamage +
            (rawDamage *
              (unit1.stats.attackDamageModifier -
                unit2.stats.damageReductionModifier)) /
              100;

          expect(event.payload.subEvents).toHaveLength(1);
          expect(event.payload.subEvents[0]).toEqual({
            type: "INSTANT_EFFECT",
            payload: {
              type: "DAMAGE",
              targetId: unit2.id,
              payload: {
                value: finalDamage,
              },
            },
          });
        });
      });
    });

    describe("Disarming Shot (Apply VULNERABLE on hit)", () => {
      it("should generate STATUS_EFFECT subEvent", () => {
        const { unit1, unit2 } = setupBoard();

        const ability = new Ability(Abilities.DisarmingShot);
        const event = ability.use(unit1);

        expect(event.payload.subEvents).toHaveLength(2);

        const effectVulnerable = ability.data
          .effects[1] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>;

        expect(event.payload.subEvents[1]).toEqual({
          type: "INSTANT_EFFECT",
          payload: {
            type: "STATUS_EFFECT",
            targetId: unit2.id,
            payload: [
              {
                name: "VULNERABLE",
                quantity: effectVulnerable.payload[0].quantity,
              },
            ],
          },
        });
      });

      // todo this mechanic might not exist anymore
      it.skip("should generate VULNERABLE loss subEvent when hit and has VULNERABLE", () => {
        const { unit1, unit2 } = setupBoard();
        unit2.statusEffectManager.applyStatusEffect({
          name: STATUS_EFFECT.VULNERABLE,
          quantity: 10,
        });

        const ability = new Ability(Abilities.DisarmingShot);
        const event = ability.use(unit1);

        expect(event.payload.subEvents).toHaveLength(3); // VULNERABLE loss, DAMAGE, VULNERABLE

        expect(event.payload.subEvents[0]).toEqual({
          type: "INSTANT_EFFECT",
          payload: {
            type: "STATUS_EFFECT",
            targetId: unit2.id,
            payload: [
              { name: "VULNERABLE", quantity: -VULNERABLE_LOSS_PER_HIT },
            ],
          },
        });
      });

      // todo this mechanic might not exist anymore
      it.skip("should generate correct VULNERABLE loss if unit has less than VULNERABLE_LOSS_PER_HIT", () => {
        const { unit1, unit2 } = setupBoard();
        unit2.statusEffectManager.applyStatusEffect({
          name: STATUS_EFFECT.VULNERABLE,
          quantity: 2,
        });

        const ability = new Ability(Abilities.DisarmingShot);
        const event = ability.use(unit1);

        expect(event.payload.subEvents).toHaveLength(3); // VULNERABLE loss, DAMAGE, VULNERABLE

        expect(event.payload.subEvents[0]).toEqual({
          type: "INSTANT_EFFECT",
          payload: {
            type: "STATUS_EFFECT",
            targetId: unit2.id,
            payload: [{ name: "VULNERABLE", quantity: -2 }],
          },
        });
      });
    });

    describe("Empowering Strike (Apply ATTACK_POWER on SELF on hit)", () => {
      it("should generate STATUS_EFFECT subEvent", () => {
        const { unit1 } = setupBoard();

        const ability = new Ability(Abilities.EmpoweringStrike);
        const event = ability.use(unit1);

        expect(event.payload.subEvents).toHaveLength(2);

        const effectAttackPower = ability.data
          .effects[1] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>;

        expect(event.payload.subEvents[1]).toEqual({
          type: "INSTANT_EFFECT",
          payload: {
            type: "STATUS_EFFECT",
            targetId: unit1.id,
            payload: [
              {
                name: "ATTACK_POWER",
                quantity: effectAttackPower.payload[0].quantity,
              },
            ],
          },
        });
      });
    });

    describe("Reinforce Allies (Apply SHIELD on ADJACENT_ALLIES on use)", () => {
      it("should generate SHIELD subEvent on multiple units", () => {
        const { unit1, unit3, unit4 } = setupBoard();

        const ability = new Ability(Abilities.ReinforceAllies);
        const event = ability.use(unit3);

        const effects = ability.data
          .effects as TriggerEffect<TRIGGER_EFFECT_TYPE.SHIELD>[];

        expect(event.actorId).toBe(unit3.id);
        expect(event.payload.name).toBe(ability.data.name);
        expect(event.payload.targetsId).toEqual([unit1.id, unit4.id]);
        expect(event.payload.subEvents[0]).toEqual({
          type: "INSTANT_EFFECT",
          payload: {
            type: "SHIELD",
            targetId: unit1.id,
            payload: {
              value: effects[0].payload.value,
            },
          },
        });
        expect(event.payload.subEvents[1].payload.targetId).toEqual(unit4.id);
        //expect(unit3.stats.shield).toBe(effects[0].payload.value);
      });
    });

    describe("Blessed Beacon (Apply HEAL and REGEN on ADJACENT_ALLIES on use)", () => {
      it("should generate HEAL and REGEN subEvents", () => {
        const { unit1, unit3 } = setupBoard();

        const ability = new Ability(Abilities.BlessedBeacon);
        const event = ability.use(unit1);

        const effectsStatusEffect = ability.data
          .effects as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>[];
        const effectsHeal = ability.data
          .effects as TriggerEffect<TRIGGER_EFFECT_TYPE.HEAL>[];

        expect(event.actorId).toBe(unit1.id);
        expect(event.payload.name).toBe(ability.data.name);
        expect(event.payload.targetsId).toEqual([unit3.id]);
        expect(event.payload.subEvents[0]).toEqual({
          type: "INSTANT_EFFECT",
          payload: {
            type: "STATUS_EFFECT",
            targetId: unit3.id,
            payload: [
              {
                name: "REGEN",
                quantity: effectsStatusEffect[0].payload[0].quantity,
              },
            ],
          },
        });
        expect(event.payload.subEvents[1]).toEqual({
          type: "INSTANT_EFFECT",
          payload: {
            type: "HEAL",
            targetId: unit3.id,
            payload: {
              value: effectsHeal[1].payload.value,
            },
          },
        });
      });
    });

    describe("Phalanx Fury (Apply DAMAGE on STANDARD_ROW on hit)", () => {
      it("should generate DAMAGE subEvent on multiple units", () => {
        const { unit1, unit2, unit3, unit4 } = setupBoard();

        unit1.setClass(new Class(Classes.Blacksmith));

        const ability = new Ability(Abilities.PhalanxFury);
        const event = ability.use(unit2);

        const effects = ability.data
          .effects as TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>[];

        const rawDamage = effects[0].payload.value;
        const finalDamageUnit1 =
          rawDamage +
          (rawDamage *
            (unit2.stats.attackDamageModifier -
              unit1.stats.damageReductionModifier)) /
            100;

        expect(event.actorId).toBe(unit2.id);
        expect(event.payload.name).toBe(ability.data.name);
        expect(event.payload.targetsId).toEqual([unit1.id, unit3.id, unit4.id]);
        expect(event.payload.subEvents[0]).toEqual({
          type: "INSTANT_EFFECT",
          payload: {
            type: "DAMAGE",
            targetId: unit1.id,
            payload: {
              value: finalDamageUnit1,
            },
          },
        });
        expect(event.payload.subEvents[1]).toEqual({
          type: "INSTANT_EFFECT",
          payload: {
            type: "DAMAGE",
            targetId: unit3.id,
            payload: {
              value: rawDamage,
            },
          },
        });
        expect(event.payload.subEvents[2].payload.targetId).toEqual(unit4.id);
      });
    });
  });
});
