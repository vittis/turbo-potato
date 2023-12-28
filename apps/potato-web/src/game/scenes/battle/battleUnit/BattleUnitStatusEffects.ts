interface StatusEffect {
  name: string; // TODO maybe use enum?
  quantity: number;
  container: Phaser.GameObjects.Container;
  icon: Phaser.GameObjects.Image;
  text: Phaser.GameObjects.Text;
}

export class BattleUnitStatusEffects extends Phaser.GameObjects.Container {
  public statusEffects: StatusEffect[] = [];
  public dataUnit: any;

  constructor(scene: Phaser.Scene, dataUnit: any) {
    super(scene);

    this.dataUnit = dataUnit;
  }

  addStatusEffect({ name, quantity }: any) {
    const statusEffectAlreadyExists = this.statusEffects.find((statusEffect) => statusEffect.name === name);

    if (statusEffectAlreadyExists) {
      statusEffectAlreadyExists.quantity += quantity;
      statusEffectAlreadyExists.text.setText(`${statusEffectAlreadyExists.quantity}`);
      return;
    }

    const statusEffectContainer = this.scene.add.container(
      this.dataUnit.owner === 0 ? -60 : 44,
      -10 + this.statusEffects.length * 25
    );

    const statusEffect = this.scene.add.image(0, 0, "statusEffect_" + name.toLowerCase().replace(/\s/g, "_"));

    statusEffect.scale = 0.3;

    statusEffectContainer.add(statusEffect);

    const statusEffectText = this.scene.add.text(10, -13, quantity, {
      fontSize: "18px",
      color: "#fff",
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

    statusEffectContainer.add(statusEffectText);

    this.add(statusEffectContainer);

    this.statusEffects.push({
      name,
      quantity,
      container: statusEffectContainer,
      icon: statusEffect,
      text: statusEffectText,
    });

    this.repositionStatusEffect();
  }

  removeStatusEffect({ name, quantity }: any) {
    const statusEffectToRemove = this.statusEffects.find((statusEffect) => statusEffect.name === name);

    console.log({ statusEffectToRemove });
    if (!statusEffectToRemove) return;

    statusEffectToRemove.quantity -= quantity;

    console.log(statusEffectToRemove.quantity);
    if (statusEffectToRemove.quantity <= 0) {
      statusEffectToRemove.container.destroy();
      this.statusEffects = this.statusEffects.filter((statusEffect) => statusEffect.name !== name);
      this.repositionStatusEffect();
    } else {
      statusEffectToRemove.text.setText(`${statusEffectToRemove.quantity}`);
    }
  }

  repositionStatusEffect() {
    this.statusEffects.sort(this.reorderStatusEffects);

    this.statusEffects.forEach((statusEffect, index) => {
      statusEffect.container.setPosition(this.dataUnit.owner === 0 ? -60 : 44, -10 + index * 25);
    });
  }

  reorderStatusEffects(a: StatusEffect, b: StatusEffect) {
    // Set custom order
    const customOrder = [
      "taunt",
      "attack_power",
      "fast",
      "spell_potency",
      "focus",
      "regen",
      "sturdy",
      "multistrike",
      "thorn",
      "vulnerable",
      "slow",
      "poison",
    ];

    const indexA = customOrder.indexOf(a.name.toLocaleLowerCase());
    const indexB = customOrder.indexOf(b.name.toLocaleLowerCase());

    // If both elements are in the custom order, compare their indices
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If one element is in the custom order and the other is not,
    // prioritize the one in the custom order
    if (indexA !== -1) {
      return -1;
    }
    if (indexB !== -1) {
      return 1;
    }

    // If neither element is in the custom order, use default order
    return 0;
  }
}
