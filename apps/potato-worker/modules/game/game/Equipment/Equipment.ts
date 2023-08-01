import { EquipmentDataSchema } from "./EquipmentSchema";
import { EquipmentData } from "./EquipmentTypes";

export class Equipment {
  data: EquipmentData;

  constructor(data: EquipmentData) {
    const parsedData = EquipmentDataSchema.parse(data);
    this.data = parsedData;
  }
}
