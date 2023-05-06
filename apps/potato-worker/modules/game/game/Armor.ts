export enum ARMOR_SLOT_TYPE {
    CHEST = "CHEST",
    HEAD = "HEAD"
}

interface ArmorStats {
    implicits: {
        armor: number;
    };
    weight: number;
    slot: ARMOR_SLOT_TYPE;
}

export interface ArmorData extends ArmorStats {
    name: string;
}

export abstract class Armor {
    data: ArmorData;

    constructor(data: ArmorData) {
        this.data = data;
    }
}
