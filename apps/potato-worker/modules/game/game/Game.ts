import { BoardManager, OWNER, POSITION } from "./BoardManager";
import { Unit } from "./Unit/Unit";

import Races from "./data/races";
import Classes from "./data/classes";
import Weapons from "./data/weapons";
import Chests from "./data/chests";
import Heads from "./data/heads";

import { Equipment } from "./Equipment/Equipment";
import { EQUIPMENT_SLOT } from "./Equipment/EquipmentTypes";
import { EVENT_TYPE } from "./Event/EventTypes";
import { sortAndExecuteEvents } from "./Event/EventUtils";
import { Class } from "./Class/Class";
export class Game {
  boardManager: BoardManager;

  constructor() {
    this.boardManager = new BoardManager();

    const unit1 = new Unit(
      OWNER.TEAM_ONE,
      POSITION.TOP_FRONT,
      this.boardManager
    );
    unit1.setClass(new Class(Classes.Ranger));
    unit1.equip(new Equipment(Weapons.ShortBow), EQUIPMENT_SLOT.MAIN_HAND);

    unit1.equip(new Equipment(Chests.LeatherShirt), EQUIPMENT_SLOT.CHEST);
    unit1.equip(new Equipment(Heads.LeatherHat), EQUIPMENT_SLOT.HEAD);

    const unit2 = new Unit(
      OWNER.TEAM_TWO,
      POSITION.BOT_BACK,
      this.boardManager
    );
    unit2.setClass(new Class(Classes.Blacksmith));

    unit2.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

    unit2.equip(new Equipment(Chests.LeatherShirt), EQUIPMENT_SLOT.CHEST);
    unit2.equip(new Equipment(Heads.LeatherHat), EQUIPMENT_SLOT.HEAD);

    const unit3 = new Unit(
      OWNER.TEAM_ONE,
      POSITION.TOP_BACK,
      this.boardManager
    );
    unit3.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
    unit3.equip(new Equipment(Chests.LeatherShirt), EQUIPMENT_SLOT.CHEST);
    unit3.equip(new Equipment(Heads.LeatherHat), EQUIPMENT_SLOT.HEAD);
    unit3.setClass(new Class(Classes.Ranger));

    const unit4 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_MID, this.boardManager);
    unit4.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
    unit4.equip(new Equipment(Chests.LeatherShirt), EQUIPMENT_SLOT.CHEST);
    unit4.equip(new Equipment(Heads.LeatherHat), EQUIPMENT_SLOT.HEAD);

    const unit5 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_MID, this.boardManager);
    unit5.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);
    unit5.equip(new Equipment(Chests.LeatherShirt), EQUIPMENT_SLOT.CHEST);
    unit5.equip(new Equipment(Heads.LeatherHat), EQUIPMENT_SLOT.HEAD);

    const unit6 = new Unit(
      OWNER.TEAM_TWO,
      POSITION.BOT_FRONT,
      this.boardManager
    );
    unit6.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);
    unit6.equip(new Equipment(Chests.LeatherShirt), EQUIPMENT_SLOT.CHEST);
    unit6.equip(new Equipment(Heads.LeatherHat), EQUIPMENT_SLOT.HEAD);

    const unit7 = new Unit(
      OWNER.TEAM_TWO,
      POSITION.TOP_FRONT,
      this.boardManager
    );
    unit7.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);
    unit7.equip(new Equipment(Chests.LeatherShirt), EQUIPMENT_SLOT.CHEST);
    unit7.equip(new Equipment(Heads.LeatherHat), EQUIPMENT_SLOT.HEAD);

    const unit8 = new Unit(
      OWNER.TEAM_ONE,
      POSITION.BOT_FRONT,
      this.boardManager
    );
    unit8.equip(new Equipment(Weapons.ShortBow), EQUIPMENT_SLOT.MAIN_HAND);
    unit8.equip(new Equipment(Chests.LeatherShirt), EQUIPMENT_SLOT.CHEST);
    unit8.equip(new Equipment(Heads.LeatherHat), EQUIPMENT_SLOT.HEAD);

    this.boardManager.addToBoard(unit1);
    this.boardManager.addToBoard(unit2);
    this.boardManager.addToBoard(unit3);
    this.boardManager.addToBoard(unit4);
    this.boardManager.addToBoard(unit5);
    this.boardManager.addToBoard(unit6);
    this.boardManager.addToBoard(unit7);
    this.boardManager.addToBoard(unit8);
  }

  startGame() {
    const { totalSteps, eventHistory, firstStep } = runGame(this.boardManager);

    return { totalSteps, eventHistory, firstStep };
  }
}

function hasGameEnded(boardManager: BoardManager) {
  return (
    boardManager
      .getAllUnitsOfOwner(OWNER.TEAM_ONE)
      .every((unit) => unit.isDead) ||
    boardManager.getAllUnitsOfOwner(OWNER.TEAM_TWO).every((unit) => unit.isDead)
  );
}

export function runGame(boardManager: BoardManager) {
  let firstStep: any;
  const eventHistory: any[] = [];

  const serializedUnits = boardManager
    .getAllUnits()
    .map((unit) => unit.serialize());
  firstStep = { units: serializedUnits };

  let currentStep = 1;
  do {
    boardManager.getAllAliveUnits().forEach((unit) => {
      unit.step(currentStep);
    });

    const stepEvents: any[] = [];

    boardManager.getAllAliveUnits().forEach((unit) => {
      stepEvents.push(...unit.serializeEvents());
    });

    const orderedEvents = sortAndExecuteEvents(boardManager, stepEvents);

    orderedEvents.forEach((event) => {
      eventHistory.push(event);
    });

    boardManager.getAllAliveUnits().forEach((unit) => {
      if (!unit.isDead && unit.hasDied()) {
        unit.markAsDead();
        eventHistory.push({
          actorId: unit.id,
          type: EVENT_TYPE.FAINT,
          step: currentStep,
        });
      }
    });

    const serializedUnits = boardManager
      .getAllUnits()
      .map((unit) => unit.serialize());

    currentStep++;
  } while (!hasGameEnded(boardManager));

  return { totalSteps: currentStep - 1, eventHistory, firstStep };
}

/* 
Ideia:
 - Implicit weapons aplicam debuff. Ex: 
    - bow: apply 1 weak on hit,
    - greatmace: apply 1 stunned on hit
    - dagger: start: gain 3 fast


  - stunned X: dont add ap for X turns


RAÇA
CLASSE
EQUIP
COMBATE

ATTACK SPEED:
(BASE + B) * (1 + (DEX * 5) / 100)

DANO TOTAL:
(BASE_ARMA + B) * (1 + (STR * strScale + DEX * dexScale + INT * intScale) / 100)
 */

/* +3% / str */

/* 

   


    Batalha baseada em buffs/debuffs tipo super auto battlemon


___________________________________________________________________________________________________

dex = each point increase X% attack speed (X is a constant, like 5 (5%)) 
OR start with X fast



STATUS EFFECTS

REGEN = heal 1 hp per stack per 5 steps and remove 1 stack
FAST = increase 1 attack speed per stack and remove 1 per attack
FOCUS)= increase 1 skill speed per stack and remove 1 per skill used
ATTACK POWER = increase 1 attack damage per stack and remove 1 per attack
SPELL POTENCY = increase 1 skill damage per stack and remove 1 per skill use
POISON = deal 1 dmg per stack per 5 steps and remove 1 stack
SLOW = reduce 1 attack speed per stack per 5 steps and remove 1 stack per attack
VULNERABLE = increase 1% damage taken per stack, remove all on hit
STURDY = reduce 1% damage taken per stack, remove 1 stack on hit
THORN = deal 1 dmg per stack on hit and remove 1 stack
TAUNT = force enemy units to attack this unit, remove 1 stack on hit
MULTISTRIKE = on weapon attack/skill immediately trigger the attack again more X times and remove all stacks

DISABLES

STUN = barrinha (duração em step) e icone


INSTANT EFFECTS

DAMAGE = deal X dmg
HEAL = heal X hp
APPLY SHIELD = gain X shield









XP

cada round player tem um número específico de xp disponivel
por ex. round 1 = 1, round 5 = 10 etc
xp pode ser utilizado pra ganhar uma perk de uma unidade, como uma skill tree
é possivel colocar e tirar pontos de qualquer unidade livremente entre os rounds


SKILLS

ULT = skill da barra

EX:
- PASSIVA APLICA POISON ON HIT
- COMEÇA COM 20 THORN STACKS
- TRIGGER (30%- HP) CASTA SKILL DOIDA


CLASS

PERKS ROGUE
- PASSIVA APLICA POISON ON HIT
- SE TIVER NA BACKLINE, GANHA 20% DAMAGE


RACE

PERKS ANÃO
- +10 DEF
- COMEÇA COM 20 THORN STACKS


PERKS CATEGORIES

- PASSIVA
EX: APLICA POISON ON HIT

- STATS BUFF
EX: BATTLE START: GAIN 20 FAST

- INSTANT EFFECT
EX: HEAL X HP ON TRIGGER


PERKS

PARKS HAVE TIERS (1, 2, 3, 4, 5) THAT CAN BE STACKED THROUGH DIFERRENT SOURCES
EX: GAIN AGILE PERK LVL 1 FROM CLASS, AND LVL 2 FROM DAGGER, THEN UNIT HAS AGILE PERK LVL 3

 */

/* 

Classes brainstorm



------------------------------------------------------------------
Blacksmith
- Gain skill: 
  - Reinforce Allies: Give adjacent allies 20 SHIELD / CD: X

- Skill Trees (or subclasses) 
  - Weaponsmith
    - Tier 1:
      - ???: "Reinforce Allies" also gives 5 FAST to adjacents allies
      - ???: "Reinforce Allies" also gives 10 DAMAGE and 10 FAST to FRONT ally
    - Tier 2 (req 2):
      - ???: "Reinforce Allies" also gives 1 MULTISTRIKE to FRONT ally
  - Armorsmith
    - Tier 1:
      - ???: "Reinforce Allies" also gives gives 15 more SHIELD to adjacents allies
      - ???: "Reinforce Allies" give 10 STURDY and 20 more SHIELD to FRONT ally
    - Tier 2 (req 2):
      - ???: "Reinforce Allies": Give 2 TAUNT and 25 THORN to FRONT ally

    - Utility skills 
      - "Reinforce Allies" don't affect adjacents units anymore. Apply the same amount to self
      - BATTLE START: Trigger base skill 
      - DEATH: Trigger base skill 
------------------------------------------------------------------

RANGER
  - Gain attack: 
    - Weak Spot: Attack furthest enemy and apply 10 Slow / CD: 7s
  - Skill Trees
    - Sniper
      - Tier 1: 
        - Gain 1 Ranged Proficiency
        - Gain 1 Open Field Tactics
      - Tier 2 (req 2): 
        - Gain attack: POWERSHOT: Attack all enemies on a row with 70% attack damage. Requires physical ranged weapon
    - Hunter
      - Tier 1: 
        - Gain skill: Summon Crab: Give adjacent allies 5 STURDY and 5 THORN / CD: 8
        - Gain skill: Summon Rabbit: Give adjacent allies 10 FAST / CD: X
        - Gain skill: Summon Boar: Attack X damage and apply 10 STUN on hit / CD: X
      - Tier 2 (req 1):
        - All team summon skills 15% less base cooldown
      - Tier 3 (req 3):
        - DEATH: Trigger all summons skill

  - Utility tree
    - Desperate Will: ALLY DEATH: Gain 5 A. DAMAGE
    - Surprise Assault: BATTLE START: Give 5 SLOW to all enemies
    - Nature Insight: BATTLE START: Gain 15 FOCUS

---------------------------------------------------------------------------



BOW MODS POOL: 
  - Gain X Ranged Profiency (Specialized)
  - Gain X Field Tactics ()
  - Gain X Coat In Poison (Serpent)
  - Gain X Heavy Puncher
  - Gain X Swift Spellcasting
  - Gain attack: Weak Spot: Attack furthest enemy and apply 10 Slow / CD: 7s


---------------------------------------------------------------------------
PERKS: 
  - Ranged Proficiency: BATTLE START: Gain X FAST if using ranged physical weapons
  - Open Field Tactics: BATTLE START: Gain X FAST if no ally in front
  - Coat In Poison: On Attack Hit: Apply X Poison
  - Penetrating Attack: ON WEAPON HIT: DEALS X% damage to enemy behind the target
  - Disarming Blow: ON ATTACK HIT: Apply X VULNERABLE
  - Heavy Puncher: BATTLE START: GAIN 10 A. DAMAGE
  - Arcane Potency: BATTLE START: GAIN 10 S. DAMAGE
  - Swift Spellcasting: BATTLE START: GAIN 10 FOCUS

---------------------------------------------------------------------------
POSSIBLE BOWS:
  - T0
    - Longbow
      - Gain attack: Deals BASE_DAMAGE / CD: X 
      - Gain 1 Ranged Proficiency (implicit)
    - Shortbow (T0)
      - Gain attack: Deals BASE_DAMAGE / CD: X
      - Gain 1 Disarming Blow (implicit)
    - Viscous Bow
      - Gain attack: Deals BASE_DAMAGE / CD: X
      - Gain 1 Coat In Poison (implicit)

BOWS T1:
  - Specialized Longbow (T1)
    - Gain attack: Deals BASE_DAMAGE / CD: X (implicit)
    - Gain 1 Ranged Proficiency (implicit)
    - Gain 1 Ranged Proficiency (MOD T1)
  - Arcane Shortbow (T1)
    - Gain attack: Deals BASE_DAMAGE  / CD: X (implicit)
    - Gain 1 Disarming Blow (implicit)
    - Gain 1 Swift Spellcasting (MOD T1)

BOWS T2:
 - Tactical Longbow 
    - Gain attack: Deals BASE_DAMAGE / CD: X (implicit)
    - Gain 1 Ranged Proficiency (implicit)
    - Gain 2 Open Field Tactics (MOD T2)
    - Gain 1 Heavy Puncher (MOD T1)

BOWS T3:
  - Fatal Viscous Bow 
    - Gain attack: Deals BASE_DAMAGE / CD: X (implicit)
    - Gain 1 Coat In Poison (implicit)
    - Gain 3 Disarming Blow (MOD T3)
    - Gain 2 Coat In Poison (MOD T2)
  - Impaler Viscous Bow 
    - Gain attack: Deals BASE_DAMAGE / CD: X (implicit)
    - Gain 1 Coat In Poison (implicit)
    - Gain 3 Penetrating Attack (MOD T3)
    - Gain 1 Coat In Poison (MOD T1)
    - Gain 1 Heavy Puncher (MOD T1)


ITEMS:
    Gain X Ranged Proficiency


    Longsword TBlueprint
    Sem Mods

    Longsword T1:
    DexT1

    Longsword T2:
    DamageT2 + DexT1

    Longsword T3:
    DamageT3 + PenT1 + DexT1 ou DamageT3 + PenT2

    Longsword T4:
    DamageT4 + Pen2 + DexT1

    Longsword T5:
    DamageT5 + PenT3 + DexT1 ou DamageT5 + PenT4 


    Item sempre vai ter um MOD do próprio tier
    Os outros mods vão ser randomizados e somados tem valor de TierDoItem - 1
    Cada Mod tem seu peso de raridade

    
    Weapon blueprint: One handed sword, One handed mace, bow
    Weapon Example: Katana, Gladius, Great axe

    Na blueprint é definido os possíveis modifiers q podem ser rollados no item.



    Longbow T0 (base)
    Sem Mods

    Longbow T1:
    DexT1

    Longbow T2:
    DamageT2 + DexT1

    Longbow T3:
    DamageT3 + PenT1 + DexT1

    Longbow T4:
    DamageT4 + Pen2 + DexT1

    Longbow T5:
    DamageT5 + PenT3 + DexT1 ou DamageT5 + PenT4 





RAÇAS, bonuses que liberam qdo upa

RACIAL BONUS LV 1: 
RACIAL BONUS LV 3:  
RACIAL BONUS LV 5: 









- NEXT STEPS:

VITU: 
- obsidian bonito
- remover mecanicas antigas
- implementar novo sistema de ataques/skills
- status effects

GULM
- Arrumar front (usar render texture)
- Classes/Perks
- ajudar vitu






*/
