import { Unit } from "./Unit";

export enum OWNER {
  TEAM_ONE = 0,
  TEAM_TWO = 1,
}

export enum POSITION {
  TOP_FRONT = 0,
  TOP_MID = 1,
  TOP_BACK = 2,
  BOT_FRONT = 3,
  BOT_MID = 4,
  BOT_BACK = 5,
}

export enum ROW {
  TOP = 0,
  BOT = 1,
}

export enum COLUMN {
  FRONT = 0,
  MID = 1,
  BACK = 2,
}

type Board = [
  [
    Unit | undefined,
    Unit | undefined,
    Unit | undefined,
    Unit | undefined,
    Unit | undefined,
    Unit | undefined
  ],
  [
    Unit | undefined,
    Unit | undefined,
    Unit | undefined,
    Unit | undefined,
    Unit | undefined,
    Unit | undefined
  ]
];

// return unit if it not died
function checkForDead(unit?: Unit) {
  return !unit?.isDead ? unit : undefined;
}

export class BoardManager {
  private board: Board;

  constructor() {
    this.board = [
      [undefined, undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined],
    ];
  }

  addToBoard(unit: Unit) {
    const position = unit.position;
    const owner = unit.owner;

    if (this.board[owner][position]) {
      throw Error(`Ja tem cara ai ${owner} ${position}`);
    }
    this.board[owner][position] = unit;
  }

  getUnit(owner: OWNER, position: POSITION): Unit {
    if (!this.board[owner][position]) {
      throw Error(`Tried to getUnit ${owner} ${position} that doesnt exist`);
    }

    return this.board[owner][position] as Unit;
  }

  getAllUnits(): Unit[] {
    return this.board[0]
      .concat(this.board[1])
      .filter((tile) => !!tile) as Unit[];
  }

  getAllUnitsOfOwner(owner: OWNER): Unit[] {
    return this.board[owner].filter((tile) => !!tile) as Unit[];
  }

  getEnemyOwner(owner: OWNER): OWNER {
    if (owner === OWNER.TEAM_ONE) return OWNER.TEAM_TWO;
    else return OWNER.TEAM_ONE;
  }

  getUnitRow(unit: Unit): number {
    const isTop =
      unit.position === 0 || unit.position === 1 || unit.position === 2;

    return isTop ? ROW.TOP : ROW.BOT;
  }

  getUnitColumn(unit: Unit): number {
    const isFront = unit.position === 0 || unit.position === 3;
    const isMid = unit.position === 1 || unit.position === 4;
    return isFront ? COLUMN.FRONT : isMid ? COLUMN.MID : COLUMN.BACK;
  }

  getAllUnitsInRow(owner: OWNER, row: number): Unit[] {
    const unitsInRow = this.getAllUnitsOfOwner(owner).filter(
      (unit) => this.getUnitRow(unit) === row
    );

    return unitsInRow;
  }

  getAllUnitsInColumn(owner: OWNER, column: number): Unit[] {
    const unitsInColumn = this.getAllUnitsOfOwner(owner).filter(
      (unit) => this.getUnitColumn(unit) === column
    );

    return unitsInColumn;
  }

  getAttackTargetFor(unit: Unit): Unit {
    const otherBoard = this.board[unit.owner === 1 ? 0 : 1];

    const isTop = this.getUnitRow(unit) === ROW.TOP;
    let target;
    if (isTop) {
      target =
        checkForDead(otherBoard[0]) ||
        checkForDead(otherBoard[3]) ||
        checkForDead(otherBoard[1]) ||
        checkForDead(otherBoard[4]) ||
        checkForDead(otherBoard[2]) ||
        checkForDead(otherBoard[5]);
      return target as Unit;
    } else {
      target =
        checkForDead(otherBoard[3]) ||
        checkForDead(otherBoard[0]) ||
        checkForDead(otherBoard[4]) ||
        checkForDead(otherBoard[1]) ||
        checkForDead(otherBoard[5]) ||
        checkForDead(otherBoard[2]);
    }

    return target as Unit;
  }

  // todo update
  /* printBoard() {
        const firstLine = "";

        

        process.stdout.write(
            `${this.getUnit("P1", POSITION.BACK_UP)}           ${this.getUnit("P2", POSITION.BACK_UP)}`
        );
        process.stdout.write(`\n`);
        process.stdout.write(
            `   ${this.getUnit("P1", POSITION.FRONT_UP)}     ${this.getUnit("P2", POSITION.FRONT_UP)}  `
        );
        process.stdout.write(`\n`);
        process.stdout.write(
            `${this.getUnit("P1", POSITION.BACK_MID)}           ${this.getUnit("P2", POSITION.BACK_MID)}`
        );
        process.stdout.write(`\n`);
        process.stdout.write(
            `   ${this.getUnit("P1", POSITION.FRONT_DOWN)}     ${this.getUnit("P2", POSITION.FRONT_DOWN)}  `
        );
        process.stdout.write(`\n`);
        process.stdout.write(
            `${this.getUnit("P1", POSITION.BACK_DOWN)}           ${this.getUnit("P2", POSITION.BACK_DOWN)}`
        );
        process.stdout.write(`\n`);
        console.log("----------------------------------------");
    } */
}

/* 
    2 1 0   0 1 2
    5 4 3   3 4 5
*/

/* 
U       U
  U   U  
U       U
  U   U
U       U
 */
