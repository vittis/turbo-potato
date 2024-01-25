import Phaser from "phaser";

export const PHASER_CONFIG = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#47aba9",
  /* dom: {
    createContainer: true,
  }, */
  transparent: true,
  //pixelArt: true,
  antialias: true,
  roundPixels: false,
  /* physics: {
      default: "arcade",
      arcade: {
         debug: true,
         gravity: { y: 200 },
      },
   }, */
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: "game",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  /*  scale: {
      width: 1200,
      height: 600,
      mode: Phaser.Scale.NONE,
      // autoCenter: Phaser.Scale.CENTER_BOTH,
      // expandParent: false,
   }, */
} as Phaser.Types.Core.GameConfig;
