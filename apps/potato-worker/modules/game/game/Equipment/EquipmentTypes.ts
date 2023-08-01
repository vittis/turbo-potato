export enum EQUIPMENT_SLOT {
  MAIN_HAND = "MAIN_HAND",
  OFF_HAND = "OFF_HAND",
  TWO_HANDED = "TWO_HANDED",
}

export enum IMPLICIT_TYPE {
  GRANT_ABILITY = "GRANT_ABILITY",
  GRANT_PERK = "GRANT_PERK",
  GRANT_BASE_STAT = "GRANT_BASE_STAT",
}

interface GrantAbilityPayload {
  name: string;
}

interface GrantPerkPayload {
  name: string;
  tier?: number;
}

interface GrantBaseStatPayload {
  stat: string; // todo use a enum
  value: number;
}

type ImplicitPayloadMap = {
  [IMPLICIT_TYPE.GRANT_ABILITY]: GrantAbilityPayload;
  [IMPLICIT_TYPE.GRANT_PERK]: GrantPerkPayload;
  [IMPLICIT_TYPE.GRANT_BASE_STAT]: GrantBaseStatPayload;
};

interface Implicit<T extends IMPLICIT_TYPE> {
  type: T;
  payload: ImplicitPayloadMap[T];
}

// this represents the JSON of the equipment
export interface EquipmentData {
  name: string;
  slot: EQUIPMENT_SLOT[];
  implicits: Array<
    | Implicit<IMPLICIT_TYPE.GRANT_ABILITY>
    | Implicit<IMPLICIT_TYPE.GRANT_PERK>
    | Implicit<IMPLICIT_TYPE.GRANT_BASE_STAT>
  >;
}
