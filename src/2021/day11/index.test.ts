import { OctopusFlasher } from ".";
import { clearTestInputData } from "../utils";

describe("day 10", () => {
  describe(OctopusFlasher.name, () => {
    const input = `
    5483143223
    2745854711
    5264556173
    6141336146
    6357385478
    4167524645
    2176841721
    6882881134
    4846848554
    5283751526`;

    it.each([
      {
        step: 1,
        board: `
        6594254334
        3856965822
        6375667284
        7252447257
        7468496589
        5278635756
        3287952832
        7993992245
        5957959665
        6394862637
      `,
      },
      {
        step: 2,
        board: `
        8807476555
        5089087054
        8597889608
        8485769600
        8700908800
        6600088989
        6800005943
        0000007456
        9000000876
        8700006848
      `,
      },
      {
        step: 3,
        board: `
        0050900866
        8500800575
        9900000039
        9700000041
        9935080063
        7712300000
        7911250009
        2211130000
        0421125000
        0021119000
      `,
      },
      {
        step: 6,
        board: `
        5595255111
        3155255222
        3364444605
        2263444496
        2298414396
        2275744344
        2264583342
        7754463344
        3754469433
        3354452433
      `,
      },
      {
        step: 10,
        board: `
        0481112976
        0031112009
        0041112504
        0081111406
        0099111306
        0093511233
        0442361130
        5532252350
        0532250600
        0032240000
      `,
      },
      {
        step: 100,
        board: `
        0397666866
        0749766918
        0053976933
        0004297822
        0004229892
        0053222877
        0532222966
        9322228966
        7922286866
        6789998766
      `,
      },
    ])("calculates correctly $step step", ({ step, board }) => {
      const data = clearTestInputData(input);
      const calculator = new OctopusFlasher(data);
      expect(calculator.getBoardAfterXSteps(step)).toEqual(
        clearTestInputData(board).join("\n")
      );
    });

    it("returns correct number of flashes after 100 steps", () => {
      const data = clearTestInputData(input);
      const calculator = new OctopusFlasher(data);
      expect(calculator.run(100)).toEqual(1656);
    });

    it("returns correct step when all flashed", () => {
      const data = clearTestInputData(input);
      const calculator = new OctopusFlasher(data);
      expect(calculator.getStepWhenAllFlash()).toEqual(195);
    });
  });
});
