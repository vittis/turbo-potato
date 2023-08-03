import { EquipmentData } from "../Equipment/EquipmentTypes";
import * as ShortSpear from "../../data/weapons/ShortSpear.json";
import * as Sword from "../../data/weapons/Sword.json";

import Dagger from "../../data/equipment/weapons/dagger.json";
import Greatsword from "../../data/equipment/weapons/greatsword.json";
import Wand from "../../data/equipment/weapons/wand.json";

export default {
  Dagger,
  Greatsword,
  Wand,
  ShortSpear: ShortSpear as EquipmentData,
  Sword: Sword as EquipmentData,
};
