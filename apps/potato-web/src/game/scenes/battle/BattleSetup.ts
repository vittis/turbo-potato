import { loadCurrentAssets, loadAssets } from "./PreloadImages";

export function preloadBattle(scene: Phaser.Scene) {
  loadCurrentAssets(scene);
  loadAssets(scene);
}

export function setupBattle(scene: Phaser.Scene) {
  const boardImage = scene.add.image(0, 0, "board");
  const castle = scene.add.image(0, -230, "castle");

  const trees = addTrees(scene);

  const board = scene.add.container(
    scene.cameras.main.centerX,
    // scene.cameras.main.centerY
    -280
  );

  board.add([boardImage, castle, ...trees]);
  // scene.board = board;

  scene.tweens.add({
    targets: board,
    y: scene.cameras.main.centerY,
    duration: 800,
    ease: Phaser.Math.Easing.Cubic.Out,
  });

  return { board };
}

function addTrees(scene: Phaser.Scene) {
  const tree = scene.add.sprite(295, -220, "tree");
  const tree2 = scene.add.sprite(350, -200, "tree");
  const tree3 = scene.add.sprite(-295, -220, "tree");
  const tree4 = scene.add.sprite(-350, -200, "tree");
  tree.setScale(1.25);
  tree2.setScale(1.25);
  tree3.setScale(1.25);
  tree4.setScale(1.25);

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
