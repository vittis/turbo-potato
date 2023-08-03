import { ClassData } from "./ClassTypes";
import { ClassDataSchema } from "./ClassSchema";
import { MOD_TYPE, Mod } from "../Equipment/EquipmentTypes";
import { getAbilityInstanceClass } from "../Ability/AbilityMap";

export class Class {
  data: ClassData;

  constructor(data: ClassData) {
    const parsedData = ClassDataSchema.parse(data);
    this.data = parsedData;
  }

  getClassBaseAbilities() {
    const baseAbilityMods = this.data.base.reduce((acc, node) => {
      const abilitiesOfNode = node.mods.filter(
        (mods) => mods.type === MOD_TYPE.GRANT_ABILITY
      ) as Mod<MOD_TYPE.GRANT_ABILITY>[];

      return [...acc, ...abilitiesOfNode];
    }, [] as Mod<MOD_TYPE.GRANT_ABILITY>[]);

    if (baseAbilityMods.length === 0) {
      return [];
    }

    return baseAbilityMods.map((mods) => {
      const AbilityClass = getAbilityInstanceClass(mods.payload.name);
      return new AbilityClass();
    });
  }
}
