import { AbilityData } from "../Ability/AbilityTypes";

// todo any way to make this import/export dynamically?
// would be nice

// Attacks
import * as BalancedStrike from "../../data/abilities/attacks/BalancedStrike.json";
import * as BreakWill from "../../data/abilities/attacks/BreakWill.json";
import * as DisarmingShot from "../../data/abilities/attacks/DisarmingShot.json";
import * as EmpoweringStrike from "../../data/abilities/attacks/EmpoweringStrike.json";
import * as LongShot from "../../data/abilities/attacks/LongShot.json";
import * as PhalanxFury from "../../data/abilities/attacks/PhalanxFury.json";
import * as Powershot from "../../data/abilities/attacks/Powershot.json";
import * as QuickAttack from "../../data/abilities/attacks/QuickAttack.json";
import * as Slash from "../../data/abilities/attacks/Slash.json";
import * as Stab from "../../data/abilities/attacks/Stab.json";
import * as Thrust from "../../data/abilities/attacks/Thrust.json";
import * as WeakSpot from "../../data/abilities/attacks/WeakSpot.json";

// Spells
import * as BastionBond from "../../data/abilities/spells/BastionBond.json";
import * as BlessedBeacon from "../../data/abilities/spells/BlessedBeacon.json";
import * as CarefulPreparation from "../../data/abilities/spells/CarefulPreparation.json";
import * as DarkBolt from "../../data/abilities/spells/DarkBolt.json";
import * as DecayStrike from "../../data/abilities/spells/DecayStrike.json";
import * as DivineIntervention from "../../data/abilities/spells/DivineIntervention.json";
import * as KiFocus from "../../data/abilities/spells/KiFocus.json";
import * as ReinforceAllies from "../../data/abilities/spells/ReinforceAllies.json";
import * as SummonBoar from "../../data/abilities/spells/SummonBoar.json";
import * as SummonCrab from "../../data/abilities/spells/SummonCrab.json";
import * as SummonHellDog from "../../data/abilities/spells/SummonHellDog.json";
import * as SummonRabbit from "../../data/abilities/spells/SummonRabbit.json";

type AbilitiesMap = {
  [key: string]: AbilityData;
};

const Abilities = {
  BalancedStrike: BalancedStrike as AbilityData,
  BreakWill: BreakWill as AbilityData,
  DisarmingShot: DisarmingShot as AbilityData,
  EmpoweringStrike: EmpoweringStrike as AbilityData,
  LongShot: LongShot as AbilityData,
  PhalanxFury: PhalanxFury as AbilityData,
  Powershot: Powershot as AbilityData,
  QuickAttack: QuickAttack as AbilityData,
  Slash: Slash as AbilityData,
  Stab: Stab as AbilityData,
  Thrust: Thrust as AbilityData,
  WeakSpot: WeakSpot as AbilityData,
  BastionBond: BastionBond as AbilityData,
  BlessedBeacon: BlessedBeacon as AbilityData,
  CarefulPreparation: CarefulPreparation as AbilityData,
  DarkBolt: DarkBolt as AbilityData,
  DecayStrike: DecayStrike as AbilityData,
  DivineIntervention: DivineIntervention as AbilityData,
  KiFocus: KiFocus as AbilityData,
  ReinforceAllies: ReinforceAllies as AbilityData,
  SummonBoar: SummonBoar as AbilityData,
  SummonCrab: SummonCrab as AbilityData,
  SummonHellDog: SummonHellDog as AbilityData,
  SummonRabbit: SummonRabbit as AbilityData,
};

export default Abilities as typeof Abilities & AbilitiesMap;
