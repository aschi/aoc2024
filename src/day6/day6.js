import { replaceAt, readInputLines } from "../helper/helper.js";

const dir = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const findGuard = (input) => {
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] === "^") {
        return [y, x];
      }
    }
  }
};

const walk = (input, guard) => {
  let d = 0;
  let loopDetection = new Set();
  let path = new Set()

  try {
    while (true) {
      if (loopDetection.has(d+","+guard[0]+","+guard[1])) {   
        return {
          loop: true,
          path: path,
        };
      } else {
        loopDetection.add(d+","+guard[0]+","+guard[1]);
      }

      path.add(guard[0]+","+guard[1])
      let newPos = [guard[0] + dir[d][0], guard[1] + dir[d][1]];

      if (input[newPos[0]].length <= newPos[1] || newPos[1] < 0) {
        throw new Error("string out of bound")
      }

      if (input[newPos[0]][newPos[1]] === "#") {
        d = (d + 1) % 4;
      } else {
        guard = newPos;
      }
    }
  } catch (error) {
    return {
      loop: false,
      path: path,
    };
  }
};

const checkForLoop = (input, guard, pos) => {
    // console.log(pos[0], input.length, pos[1], input[0].length)
    let mutableGrid = [...input]
    mutableGrid[pos[0]] = replaceAt(mutableGrid[pos[0]], pos[1], "#")
    return walk(mutableGrid, guard).loop
}

const getNumberOfLoopMutations = (input, guard) => {
    let loopCount = 0
    let positions = []

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[0].length; x++) {
            if (input[y][x] === '.') {
                positions.push([y, x])
            }
        }
    }
    return positions.filter(pos => checkForLoop(input, guard, pos)).length
}

const input = readInputLines("src/day6/input");
const guard = findGuard(input);

const result = walk(input, guard)
console.log(`Part 1: ${result.path.size}`);
console.log(`Part 2: ${getNumberOfLoopMutations(input, guard)}`);