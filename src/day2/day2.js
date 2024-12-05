import {readInputLines} from "../helper/filehelper.js";

const parseLine = line => {
    const parts = line.split(" ");
    return parts.map(Number);
}

const checkNumbers = numbers => {
  const incrementing = numbers[0] < numbers[1];

  for (let i = 0; i < numbers.length-1; i++) {
    const diff = numbers[i]-numbers[i+1]
    if (diff == 0) {
        return false
    }
    if (incrementing && diff > 0) {
        return false
    }
    if (!incrementing && diff < 0) {
        return false
    }
    if (Math.abs(diff) > 3) {
        return false
    }
  }
  return true
}

const checkWithFailsave = numbers => {
    for (let i = 0; i < numbers.length; i++) {
        let array = [...numbers]
        array.splice(i, 1)
        if (checkNumbers(array)) {
            return true
        }
    }
    return false
}

const numberLines = readInputLines("src/day2/input").map(parseLine)
const safePart1 = numberLines.filter(checkNumbers).length
console.log(`Part 1: ${safePart1}`)

const safePart2 = numberLines.filter(checkWithFailsave).length
console.log(`Part 2: ${safePart2}`)

