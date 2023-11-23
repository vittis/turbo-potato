import { useGameStore } from "../../../../services/state/game";
import { BattleUnit } from "./BattleUnit";

export const BAR_WIDTH = 45;

export function createBars(unit: BattleUnit) {
  const spriteOffsetX = unit.owner === 0 ? -4 : 4;

  const width = BAR_WIDTH;
  const height = 7;
  const borderWidth = 3;
  const yOffset = 50 + 10 + 10;
  const spBarHeight = 5;
  const spBarYOffset = 9;
  const apBarHeight = 5;
  const apBarYOffset = 18;

  const shieldBarWidth = (unit.stats.shield / unit.stats.maxHp) * BAR_WIDTH;

  const shieldBar = new Phaser.GameObjects.Rectangle(
    unit.scene,
    unit.sprite.x + borderWidth / 2 - width / 2 + spriteOffsetX,
    unit.sprite.y + yOffset + borderWidth / 2,
    shieldBarWidth,
    height,
    0xa7a7a7
  );

  const hpBar = new Phaser.GameObjects.Rectangle(
    unit.scene,
    unit.sprite.x + borderWidth / 2 - width / 2 + spriteOffsetX,
    unit.sprite.y + yOffset + borderWidth / 2,
    width,
    height,
    0xde3c45
  );

  const hpBarBorder = new Phaser.GameObjects.Rectangle(
    unit.scene,
    unit.sprite.x - width / 2 + spriteOffsetX,
    unit.sprite.y + yOffset,
    width + borderWidth,
    height + borderWidth,
    0x232422,
    0.75
  );
  hpBarBorder.setStrokeStyle(borderWidth, 0x390908, 1);

  const spBar = new Phaser.GameObjects.Rectangle(
    unit.scene,
    unit.sprite.x + borderWidth / 2 - width / 2 + spriteOffsetX,
    unit.sprite.y + yOffset + borderWidth / 2 + spBarYOffset,
    0,
    spBarHeight,
    0x3679d8
  );

  const spRectBorder = new Phaser.GameObjects.Rectangle(
    unit.scene,
    unit.sprite.x - width / 2 + spriteOffsetX,
    unit.sprite.y + yOffset + spBarYOffset,
    width + borderWidth,
    spBarHeight + borderWidth,
    0x232422,
    0.75
  );
  spRectBorder.setStrokeStyle(borderWidth, 0x390908, 1);

  const apBar = new Phaser.GameObjects.Rectangle(
    unit.scene,
    unit.sprite.x + borderWidth / 2 - width / 2 + spriteOffsetX,
    unit.sprite.y + yOffset + borderWidth / 2 + apBarYOffset,
    0,
    apBarHeight,
    0xd4b320
  );

  const apRectBorder = new Phaser.GameObjects.Rectangle(
    unit.scene,
    unit.sprite.x - width / 2 + spriteOffsetX,
    unit.sprite.y + yOffset + apBarYOffset,
    width + borderWidth,
    apBarHeight + borderWidth,
    0x232422,
    0.75
  );
  apRectBorder.setStrokeStyle(borderWidth, 0x390908, 1);

  hpBar.setOrigin(0);
  hpBar.setDepth(1);
  shieldBar.setOrigin(0);
  shieldBar.setDepth(1);
  hpBarBorder.setOrigin(0);
  hpBarBorder.setDepth(1);
  spBar.setOrigin(0);
  spBar.setDepth(1);
  spRectBorder.setOrigin(0);
  spRectBorder.setDepth(1);
  apBar.setOrigin(0);
  apBar.setDepth(1);
  apRectBorder.setOrigin(0);
  apRectBorder.setDepth(1);

  unit.add(hpBarBorder);
  unit.add(hpBar);
  unit.add(shieldBar);
  /* unit.add(spRectBorder);
  unit.add(spBar);
  unit.add(apRectBorder);
  unit.add(apBar); */

  return { hpBar, shieldBar, spBar, apBar };
}

export function createTexts(unit: BattleUnit, x: number, y: number) {
  const hpText = unit.scene.add.text(x + 12, y + 55, "0", {
    fontSize: "18px",
    color: "#ff121d",
    fontFamily: "IM Fell DW Pica",
    stroke: "#000000",
    strokeThickness: 2,
    fontStyle: "bold",
    shadow: {
      offsetX: 0,
      offsetY: 1,
      color: "#000",
      blur: 0,
      stroke: true,
    },
  });
  const shieldText = unit.scene.add.text(x + 42, y + 55, "0", {
    fontSize: "18px",
    color: "#a7a7a7",
    fontFamily: "IM Fell DW Pica",
    stroke: "#000000",
    strokeThickness: 2,
    fontStyle: "bold",
    shadow: {
      offsetX: 0,
      offsetY: 1,
      color: "#000",
      blur: 0,
      stroke: true,
    },
  });
  hpText.setOrigin(0.5);
  shieldText.setOrigin(0.5);

  unit.add(hpText);
  unit.add(shieldText);
  return { hpText, shieldText };
}

export function setupUnitAnimations(scene: Phaser.Scene) {
  return;
  scene.anims.create({
    key: "walk",
    frames: scene.anims.generateFrameNumbers("warrior", {
      start: 6,
      end: 11,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: "idle",
    frames: scene.anims.generateFrameNumbers("warrior", {
      start: 0,
      end: 5,
    }),
    frameRate: 8,
    repeat: -1,
  });

  scene.anims.create({
    key: "skill",
    frames: scene.anims.generateFrameNumbers("warrior", {
      start: 12,
      end: 13,
    }),
    duration: 1000,
    //repeat: 1,
    // repeatDelay: 2000
  });
}

export function setupUnitPointerEvents(unit: BattleUnit) {
  unit.sprite.setInteractive();

  unit.sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
    if (!unit.isSelected) {
      useGameStore.getState().setSelectedEntity(`${unit.owner}${unit.boardPosition}`);
    } else {
      useGameStore.getState().setSelectedEntity(null);
    }
  });

  /*   unit.sprite.on("pointerup", () => {
  }); */

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

export function getUnitPos(position, owner) {
  const UNIT_OFFSET = {
    x: 75,
    y: 60,
    tile: 109,
    yOffset: -35,
  };
  const getUnitPosX = () => {
    let tileOffset;
    if (position === 0 || position === 3) tileOffset = 0;
    else if (position === 1 || position === 4) tileOffset = 1;
    else tileOffset = 2;
    return (UNIT_OFFSET.x + UNIT_OFFSET.tile * tileOffset) * (owner ? 1 : -1);
  };
  const getUnitPosY = () => {
    const isTop = position === 0 || position === 1 || position === 2 ? true : false;
    return UNIT_OFFSET.y * (isTop ? -1 : 1) + UNIT_OFFSET.yOffset;
  };
  return { x: getUnitPosX(), y: getUnitPosY() };
}
