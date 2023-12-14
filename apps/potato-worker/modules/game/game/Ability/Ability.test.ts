import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TRIGGER_EFFECT_TYPE, TriggerEffect } from "../Trigger/TriggerTypes";
import { Unit } from "../Unit/Unit";
import { Attacks } from "../data";
import { Ability, VULNERABLE_LOSS_PER_HIT } from "./Ability";

function setupBoard() {
  const bm = new BoardManager();
  const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
  const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
  bm.addToBoard(unit1);
  bm.addToBoard(unit2);
  return { bm, unit1, unit2 };
}

describe("Ability", () => {
  describe("Events", () => {
    describe("USE_ABILITY Event", () => {
      it("should generate main event info", () => {
        const { unit1, unit2 } = setupBoard();

        const ability = new Ability(Attacks.Thrust);
        const event = ability.use(unit1);

        expect(event.actorId).toBe(unit1.id);
        expect(event.payload.name).toBe(ability.data.name);
        expect(event.payload.targetsId).toEqual([unit2.id]);
      });

      it("should generate DAMAGE subEvent", () => {
        const { unit1, unit2 } = setupBoard();

        const ability = new Ability(Attacks.Thrust);
        const event = ability.use(unit1);

        expect(event.payload.subEvents).toHaveLength(1);
        expect(event.payload.subEvents[0]).toEqual({
          type: "INSTANT_EFFECT",
          payload: {
            type: "DAMAGE",
            targetsId: [unit2.id],
            payload: { value: ability.data.baseDamage },
          },
        });
      });
    });

    describe("Disarming Shot (Apply VULNERABLE on hit)", () => {
      it("should generate STATUS_EFFECT subEvent", () => {
        const { unit1, unit2 } = setupBoard();

        const ability = new Ability(Attacks.DisarmingShot);
        const event = ability.use(unit1);

        expect(event.payload.subEvents).toHaveLength(2);

        const effects = ability.data
          .effects as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>[];

        expect(event.payload.subEvents[1]).toEqual({
          type: "INSTANT_EFFECT",
          payload: {
            type: "STATUS_EFFECT",
            targetsId: [unit2.id],
            payload: [
              {
                name: "VULNERABLE",
                quantity: effects[0].payload[0].quantity,
              },
            ],
          },
        });
      });

      it("should generate VULNERABLE loss subEvent when hit and has VULNERABLE", () => {
        const { unit1, unit2 } = setupBoard();
        unit2.statusEffectManager.applyStatusEffect({
          name: STATUS_EFFECT.VULNERABLE,
          quantity: 10,
        });

        const ability = new Ability(Attacks.DisarmingShot);
        const event = ability.use(unit1);

        expect(event.payload.subEvents).toHaveLength(3); // Damage, VULNERABLE, VULNERABLE loss

        expect(event.payload.subEvents[2]).toEqual({
          type: "INSTANT_EFFECT",
          payload: {
            type: "STATUS_EFFECT",
            targetsId: [unit2.id],
            payload: [
              { name: "VULNERABLE", quantity: -VULNERABLE_LOSS_PER_HIT },
            ],
          },
        });
      });

      it("should generate correct VULNERABLE loss if unit has less than VULNERABLE_LOSS_PER_HIT", () => {
        const { unit1, unit2 } = setupBoard();
        unit2.statusEffectManager.applyStatusEffect({
          name: STATUS_EFFECT.VULNERABLE,
          quantity: 2,
        });

        const ability = new Ability(Attacks.DisarmingShot);
        const event = ability.use(unit1);

        expect(event.payload.subEvents).toHaveLength(3); // Damage, VULNERABLE, VULNERABLE loss

        expect(event.payload.subEvents[2]).toEqual({
          type: "INSTANT_EFFECT",
          payload: {
            type: "STATUS_EFFECT",
            targetsId: [unit2.id],
            payload: [{ name: "VULNERABLE", quantity: -2 }],
          },
        });
      });
    });

    describe("Empowering Strike (Apply ATTACK_POWER on SELF on hit)", () => {
      it("should generate STATUS_EFFECT subEvent", () => {
        const { unit1 } = setupBoard();

        const ability = new Ability(Attacks.EmpoweringStrike);
        const event = ability.use(unit1);

        expect(event.payload.subEvents).toHaveLength(2);

        const effects = ability.data
          .effects as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>[];

        expect(event.payload.subEvents[1]).toEqual({
          type: "INSTANT_EFFECT",
          payload: {
            type: "STATUS_EFFECT",
            targetsId: [unit1.id],
            payload: [
              {
                name: "ATTACK_POWER",
                quantity: effects[0].payload[0].quantity,
              },
            ],
          },
        });
      });
    });
  });
});
