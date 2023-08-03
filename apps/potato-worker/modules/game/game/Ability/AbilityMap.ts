import { Ability } from "./Ability";
import { Slash } from "./Attacks/Slash";
import { Thrust } from "./Attacks/Thrust";

export const AbilityClassMap: { [key: string]: typeof Ability } = {
  Thrust: Thrust,
  Slash: Slash,
};

export function getAbilityInstanceClass(name: string) {
  const AbilityClass = AbilityClassMap[name];
  if (AbilityClass) {
    return AbilityClass;
  } else {
    throw new Error(`Unknown ability: ${name}`);
  }
}
