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
  const RUN_DISTANCE = unit.owner === 0 ? 50 : -50;
  const DISTANCE_TO_ENEMY = unit.owner === 0 ? 70 : -70;
  const PUSHBACK_DISTANCE = unit.owner === 0 ? 40 : -40;

  const attackTweenChain = unit.scene.tweens.chain({
    delay: 150,
    targets: unit,
    onComplete: () => {
      unit.scene.time.delayedCall(150, onFinishAnimation);
    },
    tweens: [
      // pulinho
      {
        targets: unit.sprite,
        y: unit.sprite.y - 40,
        duration: 150,
        yoyo: true,
        ease: Phaser.Math.Easing.Bounce.InOut,
      },
      // corridinha indo
      {
        delay: 50,
        alpha: 0,
        x: unit.x + RUN_DISTANCE,
        duration: 150,
      },
      // corridinha chegando
      {
        delay: 100,
        alpha: 1,
        x: {
          from: target.startingX - (DISTANCE_TO_ENEMY + RUN_DISTANCE),
          to: target.startingX - DISTANCE_TO_ENEMY,
        },
        y: { from: target.startingY, to: target.startingY },
        duration: 150,
      },
      // attack (pushback)
      {
        delay: 200,
        x: target.startingX - PUSHBACK_DISTANCE,
        duration: 150,
        yoyo: true,
        ease: Phaser.Math.Easing.Bounce.InOut,
        onYoyo: () => {
          // receive damage pushback
          target.sprite.setTint(0xde3c45);
          target.scene.tweens.add({
            targets: target,
            x: target.owner === 0 ? target.x - 4 : target.x + 4,
            duration: 150,
            yoyo: true,
            ease: Phaser.Math.Easing.Bounce.InOut,
            onComplete: () => {
              target.sprite.clearTint();
            },
          });
        },
      },
      // corridinha vazando
      {
        delay: 100,
        alpha: 0,
        x: {
          from: target.startingX - DISTANCE_TO_ENEMY,
          to: target.startingX - (DISTANCE_TO_ENEMY + RUN_DISTANCE),
        },
        y: { from: target.startingY, to: target.startingY },
        duration: 150,
      },
      // corridinha chegando
      {
        alpha: 1,
        x: { from: unit.startingX + RUN_DISTANCE, to: unit.startingX },
        y: { from: unit.startingY, to: unit.startingY },
        duration: 150,
      },
    ],
  });

  return { attackTweenChain };
}
