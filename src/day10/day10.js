import {
  sum,
  readInputNumberArray,
  getCoordinateString,
} from "../helper/helper.js";

const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const getTrailheads = (input) => {
  let trailheads = [];
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] === 0) {
        trailheads.push([y, x]);
      }
    }
  }
  return trailheads;
};

const isDirectionValid = (dir, pos, input) => {
  try {
    const currentValue = input[pos[0]][pos[1]];
    const targetValue = input[pos[0] + dir[0]][pos[1] + dir[1]];
    return targetValue === currentValue + 1;
  } catch {
    return false;
  }
};

const getNextPositions = (pos, input) => {
  return directions
    .filter((d) => isDirectionValid(d, pos, input))
    .map((d) => [pos[0] + d[0], pos[1] + d[1]]);
};

const walkPaths = (trailhead, input) => {
  let positions = [trailhead];
  let reachedEndpoints = new Set();
  let numberOfPaths = 0;

  let nextPositions = [];
  do {
    nextPositions = [];
    for (let i = 0; i < positions.length; i++) {
      let pos = positions[i];
      if (input[pos[0]][pos[1]] === 9) {
        numberOfPaths++;
        reachedEndpoints.add(getCoordinateString(pos));
        continue;
      }
      nextPositions.push(...getNextPositions(pos, input));
    }

    positions = [...nextPositions];
  } while (nextPositions.length > 0);

  return {
    endpoints: reachedEndpoints.size,
    paths: numberOfPaths,
  };
};

const input = readInputNumberArray("src/day10/input");
const trailheads = getTrailheads(input);
const paths = trailheads.map((th) => walkPaths(th, input))
const number1 = sum(paths.map(p => p.endpoints));
console.log(`Part 1: ${number1}`);

const number2 = sum(paths.map(p => p.paths));
console.log(`Part 2: ${number2}`);