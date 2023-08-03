import { Ability } from "../Ability/Ability";
import Attacks from "../data/attacks";
import { EquipmentDataSchema } from "./EquipmentSchema";
import { EquipmentData, IMPLICIT_TYPE, Implicit } from "./EquipmentTypes";

export class Equipment {
  data: EquipmentData;

  constructor(data: EquipmentData) {
    const parsedData = EquipmentDataSchema.parse(data);
    console.log("oi");
    this.data = data;
  }

  getAbilities(): Ability[] {
    const abilityImplicits = this.data.implicits.filter(
      (implicit) => implicit.type === IMPLICIT_TYPE.GRANT_ABILITY
    ) as Implicit<IMPLICIT_TYPE.GRANT_ABILITY>[];

    if (abilityImplicits.length === 0) {
      return [];
    }

    return abilityImplicits.map(
      (implicit) =>
        new Ability(Attacks[implicit.payload.name as keyof typeof Attacks])
    );
  }
}
