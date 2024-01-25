import { ClassData } from "./ClassTypes";
import { ClassDataSchema } from "./ClassSchema";
import { getAbilitiesInstancesFromMods } from "../Ability/AbilityUtils";
import { Ability } from "../Ability/Ability";
import { Mod, MOD_TYPE } from "../Mods/ModsTypes";
import { filterStatsMods } from "../Stats/StatsUtils";
import { getPerksInstancesFromMods } from "../Perk/PerkUtils";
import { Perk } from "../Perk/Perk";

export class Class {
  data: ClassData;

  constructor(data: ClassData) {
    // todo fix blacksmith and uncomment this
    /* const parsedData = ClassDataSchema.parse(data);
    this.data = parsedData; */
    this.data = data;
  }

  getBaseHp() {
    return this.data.hp;
  }

  getStatsMods(): Mod<MOD_TYPE.GRANT_BASE_STAT>[] {
    return this.data.base.reduce(
      (acc, node) => [...acc, ...filterStatsMods(node.mods)],
      [] as Mod<MOD_TYPE.GRANT_BASE_STAT>[]
    );
  }

  getClassBaseAbilities() {
    return this.data.base.reduce((acc, node) => {
      const abilitiesOfNode = getAbilitiesInstancesFromMods(node.mods);

      return [...acc, ...abilitiesOfNode];
    }, [] as Ability[]);
  }

  getPerks() {
    return this.data.base.reduce((acc, node) => {
      return [...acc, ...getPerksInstancesFromMods(node.mods)];
    }, [] as Perk[]);
  }
}
