import Phaser from "phaser";

export class Healthbar extends Phaser.GameObjects.Container {
  private hpBar!: Phaser.GameObjects.Rectangle;
  private armorBar!: Phaser.GameObjects.Rectangle;
  private apBar!: Phaser.GameObjects.Rectangle;
  private hpText!: Phaser.GameObjects.Text;
  private armorText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite) {
    super(scene);

    this.createHealthBars(scene, sprite);
    this.createTextLabels(scene);

    this.add([
      this.hpBar,
      this.armorBar,
      this.apBar,
      this.hpText,
      this.armorText,
    ]);
    scene.add.existing(this);
  }

  private createHealthBars(
    scene: Phaser.Scene,
    sprite: Phaser.GameObjects.Sprite
  ) {
    const width = 65;
    const height = 7;
    const borderWidth = 3;
    const yOffset = 50;
    const apBarHeight = 5;
    const apBarYOffset = 9;

    this.hpBar = this.createRectangle(
      sprite.x + borderWidth / 2 - width / 2,
      sprite.y + yOffset + borderWidth / 2,
      width,
      height,
      0xde3c45,
      scene
    );

    this.armorBar = this.createRectangle(
      sprite.x + borderWidth / 2 - width / 2,
      sprite.y + yOffset + borderWidth / 2,
      width,
      height,
      0xa7a7a7,
      scene
    );

    this.apBar = this.createRectangle(
      sprite.x + borderWidth / 2 - width / 2,
      sprite.y + yOffset + borderWidth / 2 + apBarYOffset,
      0,
      apBarHeight,
      0x3679d8,
      scene
    );

    const apRectBorder = this.createRectangle(
      sprite.x - width / 2,
      sprite.y + yOffset + apBarYOffset,
      width + borderWidth,
      apBarHeight + borderWidth,
      0x232422,
      scene,
      0.75
    );
    apRectBorder.setStrokeStyle(borderWidth, 0x390908, 1);
    this.add(apRectBorder);

    const hpRectBar = this.createRectangle(
      sprite.x - width / 2,
      sprite.y + yOffset,
      width + borderWidth,
      height + borderWidth,
      0x232422,
      scene,
      0.75
    );
    hpRectBar.setStrokeStyle(borderWidth, 0x390908, 1);
    this.add(hpRectBar);
  }

  private createTextLabels(scene: Phaser.Scene) {
    const rect = this.hpBar.getBounds();
    this.hpText = this.createText(rect.x, rect.y + 13, "0", "#ff121d", scene);
    this.armorText = this.createText(
      rect.x + 40,
      rect.y + 13,
      "0",
      "#a7a7a7",
      scene
    );
  }

  public updateHealthBars(stats: any) {
    this.hpText.setText(stats.hp < 0 ? 0 : stats.hp);
    this.armorText.setText(stats.armorHp < 0 ? 0 : stats.armorHp);

    const newHpBarValue = (stats.hp / stats.maxHp) * 65;
    this.scene.tweens.add({
      targets: this.hpBar,
      width: newHpBarValue <= 0 ? 0 : newHpBarValue,
      duration: 80,
      ease: "Linear",
    });

    const newArmorHpValue = (stats.armorHp / stats.maxArmorHp) * 65;
    this.scene.tweens.add({
      targets: this.armorBar,
      width: newArmorHpValue <= 0 ? 0 : newArmorHpValue,
      duration: 80,
      ease: "Linear",
    });

    const newApBarValue = (stats.ap / stats.maxAp) * 65;
    this.scene.tweens.add({
      targets: this.apBar,
      width: newApBarValue <= 0 ? 0 : newApBarValue,
      duration: 80,
      ease: "Linear",
    });
  }

  public updateDamageTaken(stats: any) {
    const damageTween = this.scene.tweens.add({
      targets: [this.hpBar, this.armorBar],
      alpha: 0.2,
      duration: 40,
      ease: "Linear",
      yoyo: true,
      repeat: 1,
    });

    this.hpText.setText(stats.hp < 0 ? 0 : stats.hp);
    this.armorText.setText(stats.armorHp < 0 ? 0 : stats.armorHp);

    const newHpBarValue = (stats.hp / stats.maxHp) * 65;
    this.hpBar.width = newHpBarValue <= 0 ? 0 : newHpBarValue;

    const newArmorHpValue = (stats.armorHp / stats.maxArmorHp) * 65;
    this.armorBar.width = newArmorHpValue <= 0 ? 0 : newArmorHpValue;
  }

  private createRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    color: number,
    scene: Phaser.Scene,
    alpha = 1
  ) {
    const rect = new Phaser.GameObjects.Rectangle(
      scene,
      x,
      y,
      width,
      height,
      color,
      alpha
    );
    return rect;
  }

  private createText(
    x: number,
    y: number,
    text: string,
    color: string,
    scene: Phaser.Scene
  ) {
    const textConfig = { fontFamily: "Arial", fontSize: "12px", color };
    const textObj = new Phaser.GameObjects.Text(scene, x, y, text, textConfig);
    return textObj;
  }
}
