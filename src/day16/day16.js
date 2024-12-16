import {
  coordAdd,
  getCoordinateString,
  readInputArray,
} from "../helper/helper.js";
import { PriorityQueue } from "../helper/PriorityQueue.js";

const directions = [
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, 0],
];

const toStr = (node) => `y:${node.pos[0]},x:${node.pos[1]},dir:${node.dir}`;

const get = (grid, c) => grid[c[0]][c[1]];

const getPossibleNodes = (node, maze) => {
  let possibilities = [];

  const target = coordAdd(node.pos, directions[node.dir]);
  const targetVal = get(maze, target);

  const newVisisted = new Set(node.visited);

  if (targetVal == "." || targetVal == "E") {
    const newVisisted = [...node.visited]
    newVisisted.push(getCoordinateString(target))
    
    // move forward
    possibilities.push({
      pos: target,
      val: targetVal,
      visited: newVisisted,
      dir: node.dir,
      cost: node.cost + 1,
    });
  }

  // turn clockwise
  possibilities.push({
    pos: node.pos,
    val: node.val,
    visited: [...node.visited],
    dir: (node.dir + 1) % 4,
    cost: node.cost + 1000,
  });

  // turn counterclockwise
  possibilities.push({
    pos: node.pos,
    val: node.val,
    visited: [...node.visited],
    dir: (node.dir + 3) % 4,
    cost: node.cost + 1000,
  });

  return possibilities;
};

const getStart = (maze) => {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[0].length; x++) {
      if (maze[y][x] == "S") {
        return {
          pos: [y, x],
          val: "S",
          visited: [getCoordinateString([y, x])],
          dir: 0,
          cost: 0,
        };
      }
    }
  }
};

const findShortestPath = (maze, start) => {
  const visited = new Set();
  const paths = [];
  const queue = new PriorityQueue((a, b) => a.cost < b.cost);
  queue.push(start);

  while (!queue.isEmpty()) {
    const current = queue.pop();
    visited.add(toStr(current));

    // check if destination is reached
    if (current.val == "E") {
        if (paths.length == 0 || paths[0].cost == current.cost) {
            paths.push(current);
        }
    }

    getPossibleNodes(current, maze)
      .filter((n) => !visited.has(toStr(n)))
      .forEach((n) => {
        
        queue.push(n);
      });
  }

  return paths;
};

const maze = readInputArray("src/day16/input");
const start = getStart(maze);

const res = findShortestPath(maze, start);

console.log(`Part 1: ${res[0].cost}`);
console.log(
  `Part 2: ${res
    .map((r) => r.visited)
    .reduce((a, b) => {
      b.forEach((e) => a.add(e));
      return a;
    }, new Set()).size}`
);
