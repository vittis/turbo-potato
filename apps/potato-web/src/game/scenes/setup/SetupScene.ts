import Phaser from "phaser";
import { preloadBattle } from "../battle/BattleSetup";
import { useSetupState } from "@/services/state/useSetupState";

export class Setup extends Phaser.Scene {
  rogue!: Phaser.GameObjects.Image;
  box!: HTMLElement | null;

  constructor() {
    super("SetupScene");
  }

  preload() {
    preloadBattle(this);
    this.load.image("rogue", "assets/units/rogue.png");
  }

  create() {
    this.box = document.getElementById("unit-box");

    this.rogue = this.add.sprite(200, 200, "rogue");
    this.rogue.setInteractive({ draggable: true });

    this.rogue.on("pointerover", () => {
      this.rogue.setTint(0xff0000);
      this.rogue.scene.game.canvas.style.cursor = "pointer";
    });

    this.rogue.on("pointerout", () => {
      this.rogue.scene.game.canvas.style.cursor = "default";
      this.rogue.clearTint();
    });

    this.rogue.on(Phaser.Input.Events.DRAG, (pointer, dragX, dragY) =>
      this.rogue.setPosition(dragX, dragY)
    );

    this.rogue.setDisplaySize(240, 240); // Set the size of the image

    this.rogue.preFX?.addShine(1, 0.6, 6);

    const fx = this.rogue.preFX?.addDisplacement("distort", 0);
    this.tweens.add({
      targets: fx,
      x: { from: -0.004, to: 0.004 },
      y: { from: -0.011, to: 0.011 },
      yoyo: true,
      loop: -1,
      duration: Phaser.Math.Between(500, 700) * 0.8,
      ease: Phaser.Math.Easing.Sine.InOut,
    });

    useSetupState.subscribe(
      (state) => state.isTeamValid,
      (isTeamValid) => {
        console.log(isTeamValid);
        console.log("go to next scene");
        console.log(this.scene.key);
        this.scene.start("BattleScene");
      }
    );
  }

  update(/* time: number, delta: number */): void {}
}
