import { ClassData } from "./ClassTypes";
import { ClassDataSchema } from "./ClassSchema";

export class Class {
  data: ClassData;

  constructor(data: ClassData) {
    const parsedData = ClassDataSchema.parse(data);
    this.data = parsedData;
  }
}
