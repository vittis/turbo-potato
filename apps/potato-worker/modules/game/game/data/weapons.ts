import { EquipmentData } from "../Equipment/EquipmentTypes";
import * as ShortSpear from "../../data/equipment/weapons/ShortSpear.json";
import * as Sword from "../../data/equipment/weapons/Sword.json";
import * as Shortbow from "../../data/equipment/weapons/Shortbow.json";
import * as Axe from "../../data/equipment/weapons/Axe.json";
import * as Wand from "../../data/equipment/weapons/Wand.json";

// todo any way to make this import/export dynamically?

export default {
  ShortSpear: ShortSpear as EquipmentData,
  Sword: Sword as EquipmentData,
  Shortbow: Shortbow as EquipmentData,
  Axe: Axe as EquipmentData,
  Wand: Wand as EquipmentData,
};
