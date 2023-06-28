import Phaser from "phaser";
import { GAME_LOOP_SPEED } from "../BattleScene";
import {
  BAR_WIDTH,
  createBars,
  createTexts,
  getUnitPos,
  setupUnitPointerEvents,
} from "./BattleUnitSetup";
import { onReceiveDamage } from "./BattleUnitEventHandler";

export class BattleUnit extends Phaser.GameObjects.Container {
  public id: string;
  public sprite: Phaser.GameObjects.Sprite;
  public hpBar: Phaser.GameObjects.Rectangle;
  public armorBar: Phaser.GameObjects.Rectangle;
  public apBar: Phaser.GameObjects.Rectangle;
  public spBar: Phaser.GameObjects.Rectangle;
  public boardPosition: number;
  public owner: number;
  public hpText: Phaser.GameObjects.Text;
  public armorText: Phaser.GameObjects.Text;

  public stats: any;
  public equipment: any;
  public unitName: string;

  public dataUnit: any;

  public isSelected = false;
  public apBarTween!: Phaser.Tweens.Tween;
  public spBarTween!: Phaser.Tweens.Tween;

  public isDead = false;

  constructor(scene: Phaser.Scene, texture: string, dataUnit: any) {
    const { x, y } = getUnitPos(dataUnit.position, dataUnit.owner);
    super(scene, x, y);
    this.id = dataUnit.id;
    this.boardPosition = dataUnit.position;
    this.dataUnit = dataUnit;

    this.unitName = dataUnit.name;
    this.stats = dataUnit.stats;
    this.equipment = dataUnit.equipment;
    this.owner = dataUnit.owner;

    this.sprite = scene.add.sprite(0, 0, texture);
    this.sprite.play("idle");
    this.add(this.sprite);

    setupUnitPointerEvents(this);

    const { hpBar, armorBar, apBar, spBar } = createBars(this);
    this.hpBar = hpBar;
    this.armorBar = armorBar;
    this.apBar = apBar;
    this.spBar = spBar;

    const { hpText, armorText } = createTexts(this, hpBar.x, hpBar.y);
    this.hpText = hpText;
    this.armorText = armorText;

    scene.add.existing(this);
  }

  public onSelected() {
    this.isSelected = true;
    this.sprite.setTint(0xffff44);
  }

  public onDeselected() {
    this.isSelected = false;
    this.sprite.clearTint();
  }

  public initalize(dataUnit: any) {
    const hp = Math.max(0, dataUnit.stats.hp);
    const armor = Math.max(0, dataUnit.stats.armorHp);
    this.hpText.setText(`${hp}`);
    this.armorText.setText(`${armor}`);

    const stepsInAttackAnimation = Math.ceil(
      dataUnit.stats.attackDelay / (10 + dataUnit.stats.attackSpeed / 10)
    );
    const timeInAttackAnimation = stepsInAttackAnimation * GAME_LOOP_SPEED;

    // create local animation
    this.sprite.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNumbers("warrior", {
        start: 12,
        end: 17,
      }),
      duration: timeInAttackAnimation,
    });
  }

  public playEvent(event: any) {
    if (event.type === "HAS_DIED") {
      this.onDeath();
    }
    if (event.type === "IS_PREPARING_ATTACK") {
      this.sprite.play("attack", true).chain("idle");
    }

    if (event.type === "ATTACK") {
      this.fillApBar(event.payload.currentAp);
    }

    if (event.type === "RECEIVED_DAMAGE") {
      onReceiveDamage(this, event);
    }
  }

  private fillApBar(currentAp: number, fromResume?: boolean) {
    const stepsToAttackFromZeroAP = Math.ceil(1000 / this.stats.attackSpeed);

    const willNeedOneLessStep =
      (stepsToAttackFromZeroAP - 1) * this.stats.attackSpeed + currentAp >=
      1000;

    const stepsToAttack =
      stepsToAttackFromZeroAP - (willNeedOneLessStep ? 1 : 0);

    const timeToAttack = stepsToAttack * GAME_LOOP_SPEED;

    let duration = 0;
    if (fromResume) {
      if (this.apBarTween) {
        duration = this.apBarTween.duration - this.apBarTween.elapsed;
      }
    } else {
      duration = timeToAttack;
    }

    this.apBarTween = this.scene.tweens.add({
      targets: this.apBar,
      width: { from: fromResume ? this.apBar.width : 0, to: BAR_WIDTH },
      duration: duration,
      ease: "Linear",
      onComplete: () => {
        this.apBarTween = null as any;
      },
    });
  }

  public onStartBattle({ fromResume = false }) {
    this.fillApBar(0, fromResume);
    this.sprite.anims.resume();
  }

  private onDeath() {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0,
      scaleY: 0,
      angle: 180,
      duration: 1400,
      delay: Math.min(250, GAME_LOOP_SPEED * 1.5),
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.setVisible(false);
        this.isDead = true;
      },
    });
  }
}
