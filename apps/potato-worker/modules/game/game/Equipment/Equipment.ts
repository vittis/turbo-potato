import { Ability } from "../Ability/Ability";
import {
  AbilityClassMap,
  getAbilityInstanceClass,
} from "../Ability/AbilityMap";
import { Slash } from "../Ability/Attacks/Slash";
import { Thrust } from "../Ability/Attacks/Thrust";
import Attacks from "../data/attacks";
import { EquipmentDataSchema } from "./EquipmentSchema";
import { EquipmentData, MOD_TYPE, Mod } from "./EquipmentTypes";

export class Equipment {
  data: EquipmentData;

  constructor(data: EquipmentData) {
    const parsedData = EquipmentDataSchema.parse(data);
    this.data = parsedData;
  }

  getEquipmentAbilities(): Ability[] {
    const abilityMods = this.data.mods.filter(
      (mods) => mods.type === MOD_TYPE.GRANT_ABILITY
    ) as Mod<MOD_TYPE.GRANT_ABILITY>[];

    if (abilityMods.length === 0) {
      return [];
    }

    return abilityMods.map((mods) => {
      const AbilityClass = getAbilityInstanceClass(mods.payload.name);
      return new AbilityClass();
    });
  }
}
