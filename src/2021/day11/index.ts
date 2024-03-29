import { readLinesFromAFile } from "../utils";

const fileLines = readLinesFromAFile("./day11/data.txt");

type Board = number[][];

export class OctopusFlasher {
  private board: Board;
  private flashedTimes = 0;
  private flashedTimesThisStep = 0;

  constructor(private input: string[]) {
    this.board = input.map((row) => row.split("").map(Number));
  }

  public run(steps: number) {
    this.getBoardAfterXSteps(steps);
    return this.flashedTimes;
  }

  public getStepWhenAllFlash() {
    let step = 0;
    do {
      this.flashedTimesThisStep = 0;
      this.incrementAllBoardByOne(this.board);
      while (this.checkIfHasTens(this.board)) {
        this.flashTens(this.board);
      }
      step++;
    } while (this.flashedTimesThisStep !== 100);
    return step;
  }

  public getBoardAfterXSteps(steps: number) {
    for (let i = 0; i < steps; i++) {
      this.incrementAllBoardByOne(this.board);
      while (this.checkIfHasTens(this.board)) {
        this.flashTens(this.board);
      }
    }

    return this.stringifyBoard(this.board);
  }

  private incrementAllBoardByOne(board: Board) {
    const modifiedBoard: Board = [];

    for (const row of board) {
      const modifiedRow: number[] = [];
      for (const num of row) {
        modifiedRow.push(num + 1);
      }
      modifiedBoard.push(modifiedRow);
    }

    this.board = modifiedBoard;
  }

  private checkIfHasTens(board: Board) {
    for (const row of board) {
      if (row.some((num) => num === 10)) {
        return true;
      }
    }
    return false;
  }

  private flashTens(board: Board) {
    let y = 0;
    for (const row of board) {
      let x = 0;
      for (const num of row) {
        if (num === 10) {
          this.board[y][x] = 0;
          this.incrementAllAround(x, y);
          this.flashedTimesThisStep++;
          this.flashedTimes++;
          debugger;
        }
        x++;
      }
      y++;
    }
  }

  private incrementAllAround(x: number, y: number) {
    for (const xOffset of [-1, 0, 1]) {
      for (const yOffset of [-1, 0, 1]) {
        const xToPop = x + xOffset;
        const yToPop = y + yOffset;

        let point = null;
        try {
          point = this.board[yToPop][xToPop];
        } catch (err) {}

        if (point !== null && point <= 9 && point !== 0) {
          this.board[yToPop][xToPop] = point + 1;
        }
      }
    }
  }

  private stringifyBoard(board: Board) {
    return board.map((row) => row.join("")).join("\n");
  }
}

export const main = () => {
  console.time(OctopusFlasher.name);
  const calc = new OctopusFlasher(fileLines);
  const result = calc.getStepWhenAllFlash();
  console.timeEnd(OctopusFlasher.name);
  return result;
};
