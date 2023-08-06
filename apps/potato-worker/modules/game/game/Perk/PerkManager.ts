import { Class } from "../Class/Class";
import { EquippedItem } from "../Equipment/EquipmentManager";
import { Perk } from "./Perk";

type PerkSource = EquippedItem | Class;

interface ActivePerk {
  perk: Perk;
  source: PerkSource;
}

export class PerkManager {
  private activePerks: ActivePerk[] = [];

  constructor() {}

  get perks() {
    return this.getPerks();
  }

  removeAllPerks() {
    this.activePerks = [];
  }

  addPerksFromSource(perks: Perk[], source: PerkSource) {
    perks.forEach((perk) => {
      this.activePerks.push({ perk, source });
    });
  }

  removePerksFromSource(source: PerkSource) {
    this.activePerks = this.activePerks.filter(
      (perk) => perk.source !== source
    );
  }

  getPerks() {
    return this.activePerks.map((perk) => perk.perk);
  }
}
