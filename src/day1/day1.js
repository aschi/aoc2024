#!/usr/bin/env node

import * as fs from "fs";

let content = fs.readFileSync("src/day1/input", "utf8");

let numbers1 = [];
let numbers2 = [];

content
  .split("\n")
  .map((line) => line.split("   "))
  .filter(split => split.length == 2)
  .forEach((split) => {
    console.log(split);
    numbers1.push(Number(split[0]));
    numbers2.push(Number(split[1]));
  });

numbers1.sort();
numbers2.sort();

let differenceSum = 0;
for (let i = 0; i < numbers1.length; i++) {
  differenceSum += Math.abs(numbers1[i] - numbers2[i])
}

console.log(differenceSum)

// part 2
let sum2 = numbers1
  .map(n1 => n1 * numbers2.filter(n2 => n2 === n1).length)
  .reduce((sum, n) => sum += n)

console.log(sum2)
