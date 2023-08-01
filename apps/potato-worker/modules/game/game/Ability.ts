import { z, ZodError } from "zod";

export enum ABILITY_CATEGORY {
  ATTACK = "ATTACK",
  SPELL = "SPELL",
}

export enum ABILITY_TAG {
  WEAPON_ABILITY = "WEAPON_ABILITY",
  USE_WEAPON_ABILITY = "USE_WEAPON_ABILITY",
  SUMMON = "SUMMON",
  BUFF = "BUFF",
}

export enum TARGET {
  STANDARD = "STANDARD",
  FURTHEST = "FURTHEST",
}

export interface AbilityData {
  name: string;
  type: ABILITY_CATEGORY;
  tags: ABILITY_TAG[];
  target: TARGET;
  baseDamage: number;
  cooldown: number;
}

const AbilityDataSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(ABILITY_CATEGORY),
  tags: z.array(z.nativeEnum(ABILITY_TAG)),
  target: z.nativeEnum(TARGET),
  baseDamage: z.number(),
  cooldown: z.number(),
}) satisfies z.ZodType<AbilityData>;

export /* abstract */ class Ability {
  data: AbilityData;
  progress = 0;

  constructor(data: AbilityData) {
    const parsedData = AbilityDataSchema.parse(data);
    this.data = parsedData;
  }

  step() {
    this.progress += 1;
  }

  canActivate() {
    return this.progress >= this.data.cooldown;
  }
}
