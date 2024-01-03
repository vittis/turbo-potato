import { loadCurrentAssets, loadAssets } from "./PreloadImages";

export function preloadBattle(scene: Phaser.Scene) {
  loadCurrentAssets(scene);
  loadAssets(scene);
}

export function setupBattle(scene: Phaser.Scene) {
  const boardImage = scene.add.image(0, 0, "board");
  boardImage.setScale(1.3);
  const castle = scene.add.image(0, -300, "castle");
  castle.setScale(1.2);

  const trees = addTrees(scene);
  const tiles = addTiles(scene);

  const board = scene.add.container(
    scene.cameras.main.centerX,
    // scene.cameras.main.centerY
    -280
  );

  board.add([boardImage, castle, ...trees, ...tiles]);
  // scene.board = board;

  scene.tweens.add({
    targets: board,
    y: scene.cameras.main.centerY,
    duration: 800,
    ease: Phaser.Math.Easing.Cubic.Out,
  });

  return { board, tiles };
}

function addTrees(scene: Phaser.Scene) {
  const tree = scene.add.sprite(395, -330, "tree");
  const tree2 = scene.add.sprite(450, -300, "tree");
  const tree3 = scene.add.sprite(-395, -330, "tree");
  const tree4 = scene.add.sprite(-450, -300, "tree");
  tree.setScale(1.45);
  tree2.setScale(1.45);
  tree3.setScale(1.45);
  tree4.setScale(1.45);

  scene.anims.create({
    key: "tree_idle",
    frames: scene.anims.generateFrameNumbers("tree", {
      start: 0,
      end: 3,
    }),
    frameRate: 6,
    repeat: -1,
  });

  scene.anims.play("tree_idle", [tree, tree2, tree3, tree4]);

  tree.on(Phaser.Animations.Events.ANIMATION_REPEAT, () => {
    tree.anims.repeatDelay = Math.ceil(Phaser.Math.Between(1500, 7000));
    tree2.anims.repeatDelay = Math.ceil(Phaser.Math.Between(1500, 7000));
    tree3.anims.repeatDelay = Math.ceil(Phaser.Math.Between(1500, 7000));
    tree4.anims.repeatDelay = Math.ceil(Phaser.Math.Between(1500, 7000));
  });

  return [tree, tree2, tree3, tree4];
}

function addTiles(scene: Phaser.Scene) {
  const widthFromCenter = 130;
  const heightFromCenter = -80;
  const widthBetweenTiles = 80;
  const heightBetweenTiles = 100;
  const scale = 1.2;

  function generateTiles(team: number) {
    const tiles: Phaser.GameObjects.Sprite[] = [];

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const tile = scene.add.sprite(0, 0, "floor");
        tile.x = (col * (widthBetweenTiles + tile.width) + widthFromCenter) * (team ? -1 : 1);
        tile.y = row * (heightBetweenTiles + tile.height) + heightFromCenter;
        tile.scale = scale;
        tiles.push(tile);
      }
    }

    return tiles;
  }

  const tileset: Phaser.GameObjects.Sprite[] = [...generateTiles(1), ...generateTiles(0)];

  return tileset;
}
