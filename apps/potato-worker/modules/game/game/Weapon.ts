export enum WEAPON_SLOT_TYPE {
    MAIN_HAND = "MAIN_HAND",
    OFF_HAND = "OFF_HAND",
    TWO_HANDED = "TWO_HANDED"
}

export interface WeaponStats {
    damage: number;
    weight: number;
    attackSpeed: number;
    slot: WEAPON_SLOT_TYPE[];
    strScale: number;
    dexScale: number;
    intScale: number;
}

export interface WeaponData extends WeaponStats {
    name: string;
}

export abstract class Weapon {
    data: WeaponData;

    constructor(data: WeaponData) {
        this.data = data;
    }
}
