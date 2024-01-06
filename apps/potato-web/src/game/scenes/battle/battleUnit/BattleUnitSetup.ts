import { useGameStore } from "../../../../services/state/game";
import { BattleUnit } from "./BattleUnit";

export function setupUnitPointerEvents(unit: BattleUnit) {
  unit.sprite.setInteractive();

  unit.sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
    if (!unit.isSelected) {
      useGameStore.getState().setSelectedEntity(`${unit.owner}${unit.boardPosition}`);
    } else {
      useGameStore.getState().setSelectedEntity(null);
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
