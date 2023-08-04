import { ClassData } from "./ClassTypes";
import { ClassDataSchema } from "./ClassSchema";
import { getAbilitiesInstancesFromMods } from "../Ability/AbilityUtils";
import { Ability } from "../Ability/Ability";

export class Class {
  data: ClassData;

  constructor(data: ClassData) {
    const parsedData = ClassDataSchema.parse(data);
    this.data = parsedData;
  }

  getClassBaseAbilities() {
    return this.data.base.reduce((acc, node) => {
      const abilitiesOfNode = getAbilitiesInstancesFromMods(node.mods);

      return [...acc, ...abilitiesOfNode];
    }, [] as Ability[]);
  }
}
