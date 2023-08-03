import { BoardManager, OWNER, POSITION } from "./BoardManager";
import { EVENT_TYPE, Unit } from "./Unit";

import Races from "./data/races";
import Classes from "./data/classes";
import Weapons from "./data/weapons";
import Chests from "./data/chests";
import Heads from "./data/heads";

import { WeaponData } from "./Weapon";
import { ArmorData } from "./Armor";
import { UnitNew } from "./Unit/UnitNew";
import { Equipment } from "./Equipment/Equipment";
import { EQUIPMENT_SLOT } from "./Equipment/EquipmentTypes";
export class Game {
  boardManager: BoardManager;
  history: any[] = [];
  eventHistory: any[] = [];

  constructor() {
    this.boardManager = new BoardManager();

    const unitTest = new UnitNew(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

    unitTest.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

    this.boardManager.addToBoard(
      new Unit(
        this.boardManager,
        OWNER.TEAM_ONE,
        POSITION.TOP_FRONT,
        Races.Human,
        Classes.Ranger,
        {
          mainHandWeapon: Weapons.Greatsword as WeaponData,
          chest: Chests.PlateMail as ArmorData,
          head: Heads.LeatherHat as ArmorData,
        }
      )
    );

    this.boardManager.addToBoard(
      new Unit(
        this.boardManager,
        OWNER.TEAM_ONE,
        POSITION.BOT_BACK,
        Races.Dwarf,
        Classes.Ranger,
        {
          mainHandWeapon: Weapons.Dagger as WeaponData,
          chest: Chests.LeatherShirt as ArmorData,
          head: Heads.ClothHat as ArmorData,
        }
      )
    );

    /* this.boardManager.addToBoard(
      new Unit(
        this.boardManager,
        OWNER.TEAM_ONE,
        POSITION.BOT_MID,
        Races.Elf,
        Classes.Ranger,
        {
          mainHandWeapon: Weapons.Greatsword as WeaponData,
          chest: Chests.LeatherShirt as ArmorData,
          head: Heads.PlateHelmet as ArmorData,
        }
      )
    ); */

    /* this.boardManager.addToBoard(
      new Unit(
        this.boardManager,
        OWNER.TEAM_TWO,
        POSITION.BOT_FRONT,
        Races.Dwarf,
        Classes.Knight,
        {
          mainHandWeapon: Weapons.Greatsword as WeaponData,
          chest: Chests.ClothRobe as ArmorData,
          head: Heads.PlateHelmet as ArmorData,
        }
      )
    ); */

    this.boardManager.addToBoard(
      new Unit(
        this.boardManager,
        OWNER.TEAM_TWO,
        POSITION.BOT_BACK,
        Races.Elf,
        Classes.Cleric,
        {
          mainHandWeapon: Weapons.Greatsword as WeaponData,
          chest: Chests.ClothRobe as ArmorData,
          head: Heads.PlateHelmet as ArmorData,
        }
      )
    );

    this.boardManager.addToBoard(
      new Unit(
        this.boardManager,
        OWNER.TEAM_TWO,
        POSITION.BOT_MID,
        Races.Dwarf,
        Classes.Knight,
        {
          mainHandWeapon: Weapons.Greatsword as WeaponData,
          chest: Chests.LeatherShirt as ArmorData,
          head: Heads.ClothHat as ArmorData,
        }
      )
    );

    // this.boardManager.printBoard();
  }

  /* 
    Function to sort events by type in order CAST_SKILL -> ATTACK
    Maybe add other criterias in the future, for example should unit x cast skill before unit y?
  */
  sortEventsByType(events: any[]) {
    events.sort(function (a, b) {
      if (a.type === "CAST_SKILL" && b.type === "ATTACK") {
        return -1;
      } else if (a.type === "ATTACK" && b.type === "CAST_SKILL") {
        return 1;
      } else {
        return 0;
      }
    });

    return events;
  }

  executeStepEvents(events: any[]) {
    events.forEach((event) => {
      this.boardManager
        .getUnitById(event.actorId)
        .applyStatsModifiersAfterEvent(event);

      if (event.subEvents) {
        event.subEvents.forEach((subEvent: any) => {
          this.boardManager
            .getUnitById(subEvent.actorId)
            .applyStatsModifiersAfterEvent(subEvent);
        });
      }
    });

    return events;
  }

  async startGame() {
    const serializedUnits = this.boardManager
      .getAllUnits()
      .map((unit) => unit.serialize());
    this.history.push({ units: serializedUnits });

    let currentStep = 1;
    do {
      this.boardManager.getAllAliveUnits().forEach((unit) => {
        unit.step(currentStep);
      });

      const stepEvents: any[] = [];

      this.boardManager.getAllAliveUnits().forEach((unit) => {
        stepEvents.push(...unit.serializeEvents());
      });

      const orderedEvents = this.sortEventsByType(stepEvents);

      this.executeStepEvents(orderedEvents);

      orderedEvents.forEach((event) => {
        this.eventHistory.push(event);
      });

      this.boardManager.getAllAliveUnits().forEach((unit) => {
        if (!unit.isDead && unit.hasDied()) {
          unit.markAsDead();
          this.eventHistory.push({
            actorId: unit.id,
            type: EVENT_TYPE.HAS_DIED,
            step: currentStep,
          });
        }
      });

      const serializedUnits = this.boardManager
        .getAllUnits()
        .map((unit) => unit.serialize());

      this.history.push({ units: serializedUnits });
      currentStep++;
    } while (!this.hasGameEnded());

    const unit1 = this.boardManager.getAllUnits()[0];
    const unit2 = this.boardManager.getAllUnits()[1];

    this.boardManager.getAllUnits().forEach((unit) => {
      console.log(unit.getName(), unit.TEST_attacksCounter);
    });

    // @ts-ignore
    console.table([
      {
        name: unit1?.getName(),
        hp: unit1.stats.hp + "/" + unit1.stats.maxHp,
        shield: unit1.stats.shield,
        def: unit1.stats.def,
        ap: unit1.stats.ap,
        attackSpeed: unit1.stats.attackSpeed,
        weapon: unit1.equipment.mainHandWeapon.name,
        attackDamage: unit1.stats.attackDamage,
        sp: unit1.stats.sp,
        skillRegen: unit1.stats.skillRegen,
        str: unit1.stats.str,
        dex: unit1.stats.dex,
        int: unit1.stats.int,
        attacks: unit1.TEST_attacksCounter,
      },
      {
        name: unit2?.getName(),
        hp: unit2.stats.hp + "/" + unit2.stats.maxHp,
        shield: unit2.stats.shield,
        def: unit2.stats.def,
        ap: unit2.stats.ap,
        attackSpeed: unit2.stats.attackSpeed,
        weapon: unit2.equipment.mainHandWeapon.name,
        attackDamage: unit2.stats.attackDamage,
        sp: unit2.stats.sp,
        skillRegen: unit2.stats.skillRegen,
        str: unit2.stats.str,
        dex: unit2.stats.dex,
        int: unit2.stats.int,
        attacks: unit2.TEST_attacksCounter,
      },
    ]);
  }

  hasGameEnded() {
    return (
      this.boardManager
        .getAllUnitsOfOwner(OWNER.TEAM_ONE)
        .every((unit) => unit.isDead) ||
      this.boardManager
        .getAllUnitsOfOwner(OWNER.TEAM_TWO)
        .every((unit) => unit.isDead)
    );
  }
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
