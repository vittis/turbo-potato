import * as FocusedMind from "../../data/perks/FocusedMind.json";
import { PerkData } from "../Perk/PerkTypes";

type PerksMap = {
  [key: string]: PerkData;
};

const Perks = {
  FocusedMind: FocusedMind as PerkData,
};

export default Perks as typeof Perks & PerksMap;
