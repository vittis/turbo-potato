import { Class } from "../Class/Class";
import { Equipment } from "../Equipment/Equipment";
import { Perk } from "./Perk";

interface ActivePerk {
  perk: Perk;
  sourceId: string;
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

  addPerksFromSource(perks: Perk[], sourceId: string) {
    perks.forEach((perk) => {
      this.activePerks.push({ perk, sourceId });
    });
  }

  removePerksFromSource(sourceId: string) {
    this.activePerks = this.activePerks.filter(
      (perk) => perk.sourceId !== sourceId
    );
  }

  getPerks() {
    return this.activePerks.map((perk) => perk.perk);
  }
}
