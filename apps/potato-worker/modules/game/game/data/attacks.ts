import { AbilityData } from "../Ability/AbilityTypes";

import * as Thrust from "../../data/abilities/attacks/Thrust.json";
import * as Slash from "../../data/abilities/attacks/Slash.json";
import * as DisarmingShot from "../../data/abilities/attacks/DisarmingShot.json";

type AbilitiesMap = {
  [key: string]: AbilityData;
};

const Attacks = {
  Thrust: Thrust as AbilityData,
  Slash: Slash as AbilityData,
  DisarmingShot: DisarmingShot as AbilityData,
};

export default Attacks as typeof Attacks & AbilitiesMap;
