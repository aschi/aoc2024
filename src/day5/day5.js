import { arrayMove, sum, readInput } from "../helper/helper.js";

const checkFunction = (r) => (pages) => {
  const firstNumberIndex = pages.indexOf(r[0]);
  const secondNumberIndex = pages.indexOf(r[1]);

  let valid = false;
  if (firstNumberIndex == -1 || secondNumberIndex == -1) {
    valid = true;
  } else {
    valid = firstNumberIndex < secondNumberIndex;
  }

  return {
    valid: valid,
    first: r[0],
    second: r[1],
    firstIndex: firstNumberIndex,
    secondIndex: secondNumberIndex,
  };
};

const parseRules = (ruleInput) =>
  ruleInput
    .split("\n")
    .map((r) => r.split("|"))
    .map((r) => [Number(r[0]), Number(r[1])])
    .map(checkFunction);

const checkAllRules = (numbers, rules) => {
  return rules
    .map((r) => r(numbers))
    .map((r) => r.valid)
    .reduce((a, b) => a && b, true);
};

const parsePages = (pagesInput) =>
  pagesInput
    .split("\n")
    .map((pages) => pages.split(","))
    .map((numbers) => numbers.map(Number));

const getMiddleNumber = (numbers) => {
  if (numbers.length % 2 == 1) {
    return numbers[(numbers.length + 1) / 2 - 1];
  }
  throw new Error(numbers, "even number of pages -> no middle page available");
};

const fixOrdering = (numbers, rules) => {
  let arr = [...numbers];

  let tries = 0;
  while (!checkAllRules(arr, rules)) {
    let errorRules = rules.map((r) => r(arr)).filter((r) => !r.valid);
    if (errorRules.length > 0) {
      const r = errorRules[0];
      arrayMove(arr, r.firstIndex, r.secondIndex);
    }
  }
  return arr;
};

const input = readInput("src/day5/input").split("\n\n");
const rules = parseRules(input[0]);
const pages = parsePages(input[1]);

console.log(
  `Part 1: ${sum(
    pages
      .filter((numbers) => checkAllRules(numbers, rules))
      .map(getMiddleNumber)
  )}`
);

console.log(
  `Part 2: ${sum(
    pages
      .filter((numbers) => !checkAllRules(numbers, rules))
      .map((numbers) => fixOrdering(numbers, rules))
      .map(getMiddleNumber)
  )}`
);
