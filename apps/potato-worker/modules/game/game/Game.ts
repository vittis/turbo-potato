import { BoardManager, OWNER, POSITION } from "./BoardManager";
import { EVENT_TYPE, Unit } from "./Unit";

import Races from "./data/races";
import Classes from "./data/classes";
import Weapons from "./data/weapons";
import Chests from "./data/chests";
import Heads from "./data/heads";

import { WeaponData } from "./Weapon";
import { ArmorData } from "./Armor";

export class Game {
  boardManager: BoardManager;
  history: any[] = [];
  eventHistory: any[] = [];

  constructor() {
    this.boardManager = new BoardManager();

    this.boardManager.addToBoard(
      new Unit(
        this.boardManager,
        OWNER.TEAM_ONE,
        POSITION.TOP_FRONT,
        Races.Human,
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
        OWNER.TEAM_TWO,
        POSITION.TOP_FRONT,
        Races.Dwarf,
        Classes.Knight,
        {
          mainHandWeapon: Weapons.Greatsword as WeaponData,
          chest: Chests.ClothRobe as ArmorData,
          head: Heads.PlateHelment as ArmorData,
        }
      )
    ); */

    /* this.boardManager.addToBoard(
      new Unit(
        this.boardManager,
        OWNER.TEAM_ONE,
        POSITION.BOT_MID,
        Races.Elf,
        Classes.Ranger,
        {
          mainHandWeapon: Weapons.Greatsword as WeaponData,
          chest: Chests.PlateMail as ArmorData,
          head: Heads.PlateHelment as ArmorData,
        }
      )
    ); */

    this.boardManager.addToBoard(
      new Unit(
        this.boardManager,
        OWNER.TEAM_TWO,
        POSITION.BOT_MID,
        Races.Dwarf,
        Classes.Ranger,
        {
          mainHandWeapon: Weapons.Greatsword as WeaponData,
          chest: Chests.PlateMail as ArmorData,
          head: Heads.PlateHelment as ArmorData,
        }
      )
    );

    // this.boardManager.printBoard();
  }

  async startGame() {
    const serializedUnits = this.boardManager
      .getAllUnits()
      .map((unit) => unit.serialize());
    this.history.push({ units: serializedUnits });

    let currentStep = 1;
    do {
      this.boardManager.getAllUnits().forEach((unit) => {
        if (!unit.isDead) {
          unit.step(currentStep);
        }
      });

      this.boardManager.getAllUnits().forEach((unit) => {
        if (!unit.isDead) {
          this.eventHistory.push(...unit.serializeEvents());

          if (!unit.isDead && unit.hasDied()) {
            unit.markAsDead();
            this.eventHistory.push({
              id: unit.id,
              type: EVENT_TYPE.HAS_DIED,
              step: currentStep,
            });
          }
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
        armorHp: unit1.stats.armorHp + "/" + unit1.stats.maxArmorHp,
        def: unit1.stats.def,
        ap: unit1.stats.ap,
        attackSpeed: unit1.stats.attackSpeed,
        weapon: unit1.equipment.mainHandWeapon.name,
        attackDamage: unit1.stats.attackDamage,
        sp: unit1.stats.sp,
        skillRegen: unit1.stats.skillRegen,
        // weight: unit1.stats.weight,
        str: unit1.stats.str,
        dex: unit1.stats.dex,
        int: unit1.stats.int,
        attacks: unit1.TEST_attacksCounter,
      },
      {
        name: unit2?.getName(),
        hp: unit2.stats.hp + "/" + unit2.stats.maxHp,
        armorHp: unit2.stats.armorHp + "/" + unit2.stats.maxArmorHp,
        def: unit2.stats.def,
        ap: unit2.stats.ap,
        attackSpeed: unit2.stats.attackSpeed,
        weapon: unit2.equipment.mainHandWeapon.name,
        attackDamage: unit2.stats.attackDamage,
        sp: unit2.stats.sp,
        skillRegen: unit2.stats.skillRegen,
        // weight: unit2.stats.weight,
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

    MOD PENETRATION
    T1: + 5 
    T2: + 10
    T3: + 15
    T4: + 20

    MOD DEX
    T1: + 2
    T2: + 4
    T3: + 7
    T4: + 10

    MOD Damage
    T1: + 10
    T2: + 15
    T3: + 25
    T4: + 35


    Longsword TBlueprint
    Sem Mods

    Longsword T1:
    DexT1

    Longsword T2:
    DamageT2 + DexT1

    Longsword T3:
    DamageT3 + PenT1 + DexT1

    Longsword T4:
    DamageT4 + Pen2 + DexT1

    Longsword T5:
    DamageT5 + PenT3 + DexT1 ou DamageT5 + PenT4 


    Item sempre vai ter um MOD do próprio tier
    Os outros mods vão ser randomizados e somados tem valor de TierDoItem - 1
    Cada Mod tem seu peso de raridade

    
    Weapon blueprint: One handed sword, One handed mace
    Weapon Example: Katana, Gladius, Great axe

    Na blueprint é definido os possíveis modifiers q podem ser rollados no item.


    Batalha baseada em buffs/debuffs tipo super auto battlemon

*/
