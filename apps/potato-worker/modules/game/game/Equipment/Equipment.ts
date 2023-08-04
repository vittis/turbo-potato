import { Ability } from "../Ability/Ability";
import {
  AbilityClassMap,
  getAbilitiesInstancesFromMods,
} from "../Ability/AbilityUtils";
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

  getGrantedAbilities(): Ability[] {
    return getAbilitiesInstancesFromMods(this.data.mods);
  }
}
