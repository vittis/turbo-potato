import { ArmorData } from "./Armor";
import { BoardManager, OWNER, POSITION } from "./BoardManager";
import { Multipliers } from "./data/config";
import { WeaponData } from "./Weapon";

export interface UnitStats {
    str: number;
    dex: number;
    int: number;
    hp: number;
    maxHp: number;
    armorHp: number;
    maxArmorHp: number;
    def: number;
    attackSpeed: number;
    ap: number;
    skillRegen: number;
    sp: number;
    attackDamage: number;
    weight: number;
    level: number;
}

export interface RaceData {
    name: string;
    hpMultiplier: number;
    str: number;
    dex: number;
    int: number;
}

export interface ClassData {
    name: string;
    hp: number;
    str: number;
    dex: number;
    int: number;
    tier: number;
    statsBonus?: { armor?: number };
}

interface UnitData {
    race: RaceData;
    class: ClassData;
}

export interface Equipment {
    mainHandWeapon: WeaponData;
    chest: ArmorData;
    head: ArmorData;
}

export class Unit {
    stats: UnitStats;
    race: RaceData;
    class: ClassData;
    equipment: Equipment;
    owner: OWNER;
    position: POSITION;
    bm: BoardManager;

    TEST_attacksCounter = 0;

    constructor(
        bm: BoardManager,
        owner: OWNER,
        position: POSITION,
        race: RaceData,
        uClass: ClassData,
        equipment: Equipment
    ) {
        this.bm = bm;
        this.owner = owner;
        this.position = position;

        this.race = race;
        this.class = uClass;
        this.equipment = equipment;

        const finalStr = race.str + uClass.str;
        const finalDex = race.dex + uClass.dex;
        const finalInt = race.int + uClass.int;

        const finalHp = uClass.hp * race.hpMultiplier;

        const finalArmor = (equipment.chest.implicits?.armor || 0) + (equipment.head.implicits?.armor || 0);

        const finalDef = finalStr * Multipliers.defStrBonus;

        const finalAttackSpeed =
            this.equipment.mainHandWeapon.attackSpeed * (1 + (finalDex * Multipliers.asDexMult) / 100);

        const finalAttackDamage = Math.round(
            this.equipment.mainHandWeapon.damage *
                (1 +
                    (finalStr * this.equipment.mainHandWeapon.strScale +
                        finalDex * this.equipment.mainHandWeapon.dexScale +
                        finalInt * this.equipment.mainHandWeapon.intScale) /
                        100)
        );

        this.stats = {
            str: finalStr,
            dex: finalDex,
            int: finalInt,
            hp: finalHp,
            maxHp: finalHp,
            armorHp: finalArmor,
            maxArmorHp: finalArmor,
            def: finalDef,
            attackSpeed: finalAttackSpeed,
            ap: 0,
            skillRegen: 0,
            sp: 0,
            attackDamage: finalAttackDamage,
            weight: 10,
            level: 1
        };
    }

    serialize() {
        return {
            owner: this.owner,
            equipment: {
                mainHandWeapon: {
                    ...this.equipment.mainHandWeapon
                },
                chest: { ...this.equipment.chest },
                head: { ...this.equipment.head }
            },
            stats: {
                ...this.stats
            },
            position: this.position
        };
    }

    step() {
        this.stats.ap += this.stats.attackSpeed;
        if (this.canAttack()) {
            this.stats.ap -= 1000;
            this.TEST_attacksCounter++;

            const attackTarget = this.bm.getAttackTargetFor(this);
            if (!attackTarget) {
                throw Error("Undefined attack target for " + this.toString());
            }

            this.attackWithMainHand(attackTarget);
        }
    }

    attackWithMainHand(target: Unit) {
        target.receiveDamage(this.stats.attackDamage);
    }

    receiveDamage(damage: number) {
        const finalDamage = Math.round((damage * 100) / (this.stats.def + 100));

        if (this.stats.armorHp > 0) {
            this.stats.armorHp -= finalDamage;
            if (this.stats.armorHp < 0) {
                // If the armor is now depleted, apply any remaining damage to the unit's HP
                this.stats.hp += this.stats.armorHp;
                this.stats.armorHp = 0;
            }
        } else {
            this.stats.hp -= Math.round(finalDamage);
        }
    }

    canAttack() {
        return this.stats.ap >= 1000;
    }

    getName() {
        return `${this.race.name} ${this.class.name}`;
    }

    public toString = (): string => {
        return `${this.race.name.substring(0, 1)}${this.class.name.substring(0, 1)}`;
    };

    printAp() {
        console.log(this.stats.ap);
        let bar = "|";
        for (let i = 0; i < 20; i++) {
            if (i / 20 <= this.stats.ap / 1000) bar += "-";
            else bar += " ";
        }
        bar += "|";
        console.log(bar);
    }
}
