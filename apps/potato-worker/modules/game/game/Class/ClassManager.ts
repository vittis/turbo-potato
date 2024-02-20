import { EquippedItem } from "../Equipment/EquipmentManager";
import { Class } from "./Class";
import { ClassNode } from "./ClassTypes";

export class ClassManager {
  class!: Class;
  activeNodes: ClassNode[] = [];

  constructor() {}

  setClass(unitClass: Class) {
    this.class = unitClass;
  }

  getClassAbilities() {
    // check activenodes as well
    return this.class.getClassBaseAbilities();
  }
}
