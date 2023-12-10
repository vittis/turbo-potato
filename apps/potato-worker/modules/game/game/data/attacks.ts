import { AbilityData } from "../Ability/AbilityTypes";

// todo any way to make this import/export dynamically?

import * as Thrust from "../../data/abilities/attacks/Thrust.json";
import * as Slash from "../../data/abilities/attacks/Slash.json";
import * as DisarmingShot from "../../data/abilities/attacks/DisarmingShot.json";
import * as EmpoweringStrike from "../../data/abilities/attacks/EmpoweringStrike.json";

type AbilitiesMap = {
  [key: string]: AbilityData;
};

const Attacks = {
  Thrust: Thrust as AbilityData,
  Slash: Slash as AbilityData,
  DisarmingShot: DisarmingShot as AbilityData,
  EmpoweringStrike: EmpoweringStrike as AbilityData,
};

export default Attacks as typeof Attacks & AbilitiesMap;
