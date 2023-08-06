import { Ability } from "../Ability/Ability";
import { getAbilitiesInstancesFromMods } from "../Ability/AbilityUtils";
import { MOD_TYPE, Mod } from "../Mods/ModsTypes";
import { Perk } from "../Perk/Perk";
import { getPerksInstancesFromMods } from "../Perk/PerkUtils";
import { filterStatsMods } from "../Stats/StatsUtils";
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

  getStatsMods(): Mod<MOD_TYPE.GRANT_BASE_STAT>[] {
    return filterStatsMods(this.data.mods);
  }

  getGrantedPerks(): Perk[] {
    return getPerksInstancesFromMods(this.data.mods);
  }
}
