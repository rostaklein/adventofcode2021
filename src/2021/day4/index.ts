import { readLinesFromAFile } from "../utils";

const fileLines = readLinesFromAFile("./day4/data.txt");

class Board {
  private columns = new Map<number, number[]>();
  public rows = new Map<number, number[]>();

  constructor(private input: string[]) {
    this.parseRows();
    this.parseColumns();
  }

  private parseRows() {
    let rowIndex = 0;
    for (const row of this.input) {
      const parsedRow = row.split(" ").filter(Boolean).map(Number);
      this.rows.set(rowIndex, parsedRow);
      rowIndex++;
    }
  }

  private parseColumns() {
    const columnLength = 5;

    let columnIndex = 0;
    while (columnIndex < columnLength) {
      const column: number[] = [];
      this.rows.forEach((value) => {
        column.push(value[columnIndex]);
      });

      this.columns.set(columnIndex, column);
      columnIndex++;
    }
  }

  public matchesWholeRow(guesses: number[]) {
    for (const row of [...this.rows.values()]) {
      if (row.every((value) => guesses.includes(value))) {
        return row;
      }
    }
  }

  public matchesWholeColumn(guesses: number[]) {
    for (const column of [...this.columns.values()]) {
      if (column.every((value) => guesses.includes(value))) {
        return column;
      }
    }
  }

  public getSumOfAllUnmarkedNumbers(guesses: number[]) {
    const unmarkedNumbers: number[] = [];
    for (const row of [...this.rows.values()]) {
      row.forEach((value) => {
        if (!guesses.includes(value)) {
          unmarkedNumbers.push(value);
        }
      });
    }

    return unmarkedNumbers.reduce((acc, curr) => (acc += curr), 0);
  }
}

export class BingoPlayer {
  private readonly guesses: number[];
  private boards = new Map<number, Board>();

  constructor(rawInput: string[]) {
    const [rawGuesses, ...rawBoards] = rawInput;
    this.guesses = rawGuesses.split(",").map(Number);
    this.createBoards(rawBoards.filter(Boolean)).forEach((board, i) => {
      this.boards.set(i, board);
    });
  }

  public run(): number {
    const drawnNumbers: number[] = [];

    const matches = [];
    let lastSum = 0;

    for (const guess of this.guesses) {
      drawnNumbers.push(guess);
      for (const [boardIndex, board] of this.boards) {
        const rowMatches = board.matchesWholeRow(drawnNumbers);
        const columnMatches = board.matchesWholeColumn(drawnNumbers);
        if (rowMatches || columnMatches) {
          matches.push(guess);
          const sumUnmarked = board.getSumOfAllUnmarkedNumbers(drawnNumbers);
          this.boards.delete(boardIndex);
          lastSum = guess * sumUnmarked;
        }
      }
    }

    return lastSum;
  }

  private createBoards(boardsInput: string[]): Board[] {
    const totalBoards = boardsInput.length / 5;

    const boards: Board[] = [];

    let i = 1;
    while (i <= totalBoards) {
      const boardInput = boardsInput.slice((i - 1) * 5, i * 5);
      boards.push(new Board(boardInput));
      i++;
    }

    return boards;
  }
}

export const main = () => {
  const result = new BingoPlayer(fileLines).run();
  return result;
};
