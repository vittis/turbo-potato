import * as FocusedMind from "../../data/perks/FocusedMind.json";
import * as DesperateWill from "../../data/perks/DesperateWill.json";
import { PerkData } from "../Perk/PerkTypes";

type PerksMap = {
  [key: string]: PerkData;
};

const Perks = {
  FocusedMind: FocusedMind as PerkData,
  DesperateWill: DesperateWill as PerkData,
};

export default Perks as typeof Perks & PerksMap;
