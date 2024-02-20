import * as Blacksmith from "../../data/classes/blacksmith.json";
import * as Paladin from "../../data/classes/paladin.json";
import * as Ranger from "../../data/classes/ranger.json";
import * as Rogue from "../../data/classes/rogue.json";
import * as Warlock from "../../data/classes/warlock.json";
import * as Warrior from "../../data/classes/warrior.json";
import { ClassData } from "../Class/ClassTypes";

export default {
  Blacksmith: Blacksmith as ClassData,
  Paladin: Paladin as ClassData,
  Ranger: Ranger as ClassData,
  Rogue: Rogue as ClassData,
  Warlock: Warlock as ClassData,
  Warrior: Warrior as ClassData,
};
