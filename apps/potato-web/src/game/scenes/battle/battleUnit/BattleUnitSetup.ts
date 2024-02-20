import { useGameState } from "../../../../services/state/useGameState";
import { BattleUnit } from "./BattleUnit";

export function setupUnitPointerEvents(unit: BattleUnit) {
  unit.sprite.setInteractive();

  unit.sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
    if (!unit.isSelected) {
      useGameState.getState().setSelectedEntity(`${unit.owner}${unit.boardPosition}`);
    } else {
      useGameState.getState().setSelectedEntity(null);
    }
  });

  unit.sprite.on("pointerover", () => {
    unit.scene.game.canvas.style.cursor = "pointer";
    if (unit.glow) unit.glow.setActive(true);
  });

  unit.sprite.on("pointerout", () => {
    unit.scene.game.canvas.style.cursor = "default";
    if (!unit.isSelected) {
      if (unit.glow) unit.glow.setActive(false);
    }
  });
}

export function getUnitPos(position, owner, tiles: Phaser.GameObjects.Sprite[]) {
  const heightOffset = -35;

  const tileId = position + 6 * owner;

  const x = tiles[tileId].x;
  const y = tiles[tileId].y + heightOffset;

  return { x, y };
}

export function createShadow(unit: BattleUnit, scene: Phaser.Scene) {
  const spriteOffsetX = unit.owner === 0 ? -4 : 4;

  const shadowContainer = scene.add.container();
  const shadowColor = 0x000000;
  const shadowAlpha = 0.4;
  const shadowWidth = 65;
  const shadowHeight = 25;
  const shadowCircle = scene.add.graphics();
  shadowCircle.fillStyle(shadowColor, shadowAlpha);
  shadowCircle.fillEllipse(0, 0, shadowWidth, shadowHeight);
  shadowContainer.add(shadowCircle);
  shadowContainer.setPosition(unit.sprite.x + spriteOffsetX, unit.sprite.y + 63);
  unit.add(shadowContainer);
}
