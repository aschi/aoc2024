import { sum, readInputLines } from "../helper/filehelper.js";

const words = [/XMAS/g, /SAMX/g];

const count = (str, re) => {
  //console.log(str, re)
  return ((str || "").match(re) || []).length;
};

const findWords = (line) =>
  words.map((w) => count(line, w)).reduce((sum, n) => (sum += n));

const getVerticalLines = (input) => {
  const verticalLines = [];
  for (let i = 0; i < input[0].length; i++) {
    let verticalLine = "";
    for (let n = 0; n < input.length; n++) {
      verticalLine += input[n][i];
    }
    verticalLines.push(verticalLine);
  }
  return verticalLines;
};

const getDiagonalDownLines = (input) => {
  const diagonalLines = [];
  for (let i = 0; i < input[0].length; i++) {
    let diagonalLine = "";
    for (let n = 0; n < input[0].length - i && n < input.length; n++) {
      diagonalLine += input[n][i + n];
    }
    diagonalLines.push(diagonalLine);
  }

  for (let i = 1; i < input.length; i++) {
    let diagonalLine = "";
    for (let n = 0; n < input.length - i && n < input[0].length; n++) {
      diagonalLine += input[i + n][n];
    }
    diagonalLines.push(diagonalLine);
  }
  return diagonalLines;
};

const getDiagonalUpLines = (input) => {
  const diagonalLines = [];
  for (let i = input[0].length - 1; i >= 0; i--) {
    let diagonalLine = "";
    for (let n = 0; n <= i && n < input.length; n++) {
      diagonalLine += input[n][i - n];
    }
    diagonalLines.push(diagonalLine);
  }

  for (let i = 1; i < input.length; i++) {
    let diagonalLine = "";
    for (let n = input[0].length-1; (input.length - n + i - 1) < input[0].length && n >= 0; n--) {
      diagonalLine += input[input.length - n + i - 1][n];
    }
    diagonalLines.push(diagonalLine);
  }
  return diagonalLines;
}


const part2 = input => {
    let count = 0;
    for (let i = 0; i < input.length; i++) {
        for (let n = 0; n < input.length; n++) {
            try {
                if ((input[i][n] == 'M' && input[i+2][n+2] == 'S') || (input[i][n] == 'S' && input[i+2][n+2] == 'M')) {
                    if (input[i+1][n+1] == 'A') {
                        if ((input[i+2][n] == 'S' && input[i][n+2] == 'M') || (input[i+2][n] == 'M' && input[i][n+2] == 'S')) {
                            count++
                        }
                    }
                }
            } catch {
            }
        }   
    }
    return count
}

const input = readInputLines("src/day4/input");

/*const input = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`.split('\n')*/

const hLine = sum(input.map(findWords));
const vLine = sum(getVerticalLines(input).map(findWords))
const ddLine = sum(getDiagonalDownLines(input).map(findWords))
const duLine = sum(getDiagonalUpLines(input).map(findWords))

console.log(`Part 1: ${hLine+vLine+ddLine+duLine}`)

console.log(`Part 2: ${part2(input)}`)