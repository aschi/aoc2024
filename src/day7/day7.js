import { sum, readInputLines } from "../helper/helper.js";

const parseLine = (line) => {
  const split = line.split(": ");
  const expectedResult = split[0];
  const numbers = split[1]
    .split(" ")
    .map((s) => s.trim())
    .map(Number);

  return {
    expectedResult: Number(expectedResult),
    numbers: numbers,
  };
};

const applyOperator = (operatorIndex, x, y) => {
  if (operatorIndex == 0) {
    return x + y;
  } else if (operatorIndex == 1) {
    return x * y;
  } else if (operatorIndex == 2) {
    return Number(x.toString() + y.toString());
  }
  throw new Error("operator not implemented");
};

const solve = (line, operators) => {
  let possibleResults = [];
  // first 2 numbers
  for (let n = 0; n < operators; n++) {
    possibleResults.push(applyOperator(n, line.numbers[0], line.numbers[1]));
  }

  // other numbers (left to right)
  for (let i = 2; i < line.numbers.length; i++) {
    let newResults = [];
    for (let x = 0; x < possibleResults.length; x++) {
      for (let n = 0; n < operators; n++) {
        newResults.push(applyOperator(n, possibleResults[x], line.numbers[i]));
      }
    }
    possibleResults = newResults;
  }

  const rv = {
    solveable: possibleResults.indexOf(line.expectedResult) != -1,
    expectedResult: line.expectedResult,
  };

  // console.log("line", line);
  // console.log("results", possibleResults);
  // console.log("return", rv);

  return rv;
};

console.log(
  `Part 1: ${sum(
    readInputLines("src/day7/input")
      .map(parseLine)
      .map(l => solve(l, 2))
      .filter((r) => r.solveable)
      .map((r) => r.expectedResult)
  )}`
);

console.log(
  `Part 2: ${sum(
    readInputLines("src/day7/input")
      .map(parseLine)
      .map((l) => solve(l, 3))
      .filter((r) => r.solveable)
      .map((r) => r.expectedResult)
  )}`
);
