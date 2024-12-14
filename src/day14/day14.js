import { sum, getNumbers, readInputLines } from "../helper/helper.js";
import fs from "fs";

const width = 101;
const height = 103;
const file = "src/day14/input";

const getRobot = (line) => {
  const numbers = getNumbers(line);
  return {
    X: numbers[0],
    Y: numbers[1],
    vX: numbers[2],
    vY: numbers[3],
  };
};

const walk = (r) => {
  return {
    X: (r.X = (width + r.X + r.vX) % width),
    Y: (r.Y = (height + r.Y + r.vY) % height),
    vX: r.vX,
    vY: r.vY,
  };
};

const countQuadrants = (robots) => {
  return {
    topLeft: robots.filter(
      (r) => r.X < (width - 1) / 2 && r.Y < (height - 1) / 2
    ).length,
    topRight: robots.filter(
      (r) => r.X > (width - 1) / 2 && r.Y < (height - 1) / 2
    ).length,
    bottomLeft: robots.filter(
      (r) => r.X < (width - 1) / 2 && r.Y > (height - 1) / 2
    ).length,
    bottomRight: robots.filter(
      (r) => r.X > (width - 1) / 2 && r.Y > (height - 1) / 2
    ).length,
  };
};

const visualize = (robots, i) => {
  let lines = [];
  lines.push(
    `+----------------------------------------ITERATION-${String(i).padStart(
      5,
      "0"
    )}------------------------------------------------+`
  );
  lines.push(`+ ${"-".repeat(width)} +`);
  for (let y = 0; y < height; y++) {
    let line = "";
    let lr = robots.filter(r => r.Y == y)
    for (let x = 0; x < width; x++) {
      if (lr.filter((r) => r.X == x).length > 0) {
        line += "x";
      } else {
        line += ".";
      }
    }
    lines.push(`| ${line} |`);
  }
  lines.push(`+ ${"-".repeat(width)} +`);
  lines.push("");
  return lines;
};

const mightBeTree = (robots) => {
    for (let y = 0; y < height; y++) {
        let continuous = 0;
        let lr = robots.filter(r => r.Y == y)
        for (let x = 0; x < width; x++) {
            if (lr.filter(r => r.X == x).length > 0) {
                continuous++
                if (continuous > 5) {
                    return true;
                }
            } else {
                continuous = 0
            }
        }
    }
    return false
};

// Part 1
let robots = readInputLines(file).map(getRobot);
for (let i = 1; i <= 100; i++) {
  robots = robots.map(walk);
}
const quadrants = countQuadrants(robots);
console.log(
  `Part 1: ${
    quadrants.topLeft *
    quadrants.topRight *
    quadrants.bottomLeft *
    quadrants.bottomRight
  }`
);

// Part 2
robots = readInputLines(file).map(getRobot);
let lines = [];
for (let i = 1; i <= 10000; i++) {
  robots = robots.map(walk);
  if (mightBeTree(robots)) {
    lines.push(...visualize(robots, i));
  }
}
fs.writeFileSync("src/day14/output", lines.join("\n"));
console.log(`Part 2: Manually check 'src/day14/output' for trees`)
