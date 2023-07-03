import { BattleUnit } from "./BattleUnit";

export function createAttackAnimation({
  unit,
  target,
  onFinishAnimation,
}: {
  unit: BattleUnit;
  target: BattleUnit;
  onFinishAnimation: Function;
}) {
  const RUN_DISTANCE = unit.owner === 0 ? 70 : -70;
  const DISTANCE_TO_ENEMY = unit.owner === 0 ? 70 : -70;
  const PUSHBACK_DISTANCE = unit.owner === 0 ? 30 : -30;

  unit.scene.tweens.chain({
    targets: unit,
    onComplete: () => {
      onFinishAnimation();
    },
    tweens: [
      // corridinha indo
      {
        alpha: 0,
        x: unit.x + RUN_DISTANCE,
        duration: 200,
      },
      // corridinha chegando
      {
        delay: 200,
        alpha: 1,
        x: {
          from: target.startingX - (DISTANCE_TO_ENEMY + RUN_DISTANCE),
          to: target.startingX - DISTANCE_TO_ENEMY,
        },
        y: { from: target.startingY, to: target.startingY },
        duration: 200,
      },
      // attack (pushback)
      {
        delay: 100,
        x: target.startingX - PUSHBACK_DISTANCE,
        duration: 150,
        yoyo: true,
        ease: Phaser.Math.Easing.Bounce.InOut,
      },
      // corridinha vazando
      {
        delay: 200,
        alpha: 0,
        x: {
          from: target.startingX - DISTANCE_TO_ENEMY,
          to: target.startingX - (DISTANCE_TO_ENEMY + RUN_DISTANCE),
        },
        y: { from: target.startingY, to: target.startingY },
        duration: 200,
      },
      // corridinha chegando
      {
        alpha: 1,
        x: { from: unit.startingX + RUN_DISTANCE, to: unit.startingX },
        y: { from: unit.startingY, to: unit.startingY },
        duration: 200,
      },
    ],
  });
}
