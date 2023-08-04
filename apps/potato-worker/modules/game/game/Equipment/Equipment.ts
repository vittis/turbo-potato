import { Ability } from "../Ability/Ability";
import { getAbilitiesInstancesFromMods } from "../Ability/AbilityUtils";
import { EquipmentDataSchema } from "./EquipmentSchema";
import { EquipmentData } from "./EquipmentTypes";

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
