import { sum, coordAdd, coordSubtract, readInput } from "../helper/helper.js";

const getGrid = (str) =>
  str
    .trim()
    .split("\n")
    .map((s) => s.split(""));

const getGrid2 = (str) =>
  str
    .trim()
    .split("\n")
    .map((s) =>
      s.split("").flatMap((p) => {
        if (p == "O") {
          return ["[", "]"];
        }
        if (p == ".") {
          return [".", "."];
        }
        if (p == "#") {
          return ["#", "#"];
        }
        if (p == "@") {
          return ["@", "."];
        }
      })
    );

const directions = {
  "<": [0, -1],
  ">": [0, 1],
  "^": [-1, 0],
  v: [1, 0],
};

const getCurrentPos = (grid) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] == "@") {
        return [y, x];
      }
    }
  }
  throw new Exception("not found");
};

const print = (grid) => console.log(grid.map((l) => l.join("")).join("\n"));

const get = (grid, c) => grid[c[0]][c[1]];

const set = (grid, c, v) => (grid[c[0]][c[1]] = v);

const move = (grid, pos, dir) => {
  const d = directions[dir];
  const targetPos = coordAdd(pos, d);

  if (get(grid, targetPos) == ".") {
    set(grid, pos, ".");
    set(grid, targetPos, "@");

    return {
      pos: targetPos,
      grid: grid,
    };
  }

  if (get(grid, targetPos) == "O") {
    let p = coordAdd(targetPos, d);
    while (get(grid, p) == "O") {
      p = coordAdd(p, d);
    }

    if (get(grid, p) == ".") {
      set(grid, p, "O");
      set(grid, targetPos, "@");
      set(grid, pos, ".");

      return {
        pos: targetPos,
        grid: grid,
      };
    }
  }

  // move failed no space to move box
  return {
    pos: pos,
    grid: grid,
  };
};

const moveBox = (grid, d, bL, bR) => {
  const targetBL = coordAdd(bL, d);
  const targetBR = coordAdd(bR, d);

  const targetLVal = get(grid, targetBL);
  const targetRVal = get(grid, targetBR);

  if (targetLVal == "#" || targetRVal == "#") {
    return {
      grid: grid,
      success: false,
    };
  }

  if (targetLVal == "." && targetRVal == ".") {
    set(grid, bL, ".");
    set(grid, bR, ".");
    set(grid, targetBL, "[");
    set(grid, targetBR, "]");

    return {
      grid: grid,
      success: true,
    };
  }

  // parallel box
  if (targetLVal == "[" && targetRVal == "]") {
    const r = moveBox(grid, d, targetBL, targetBR);
    if (r.success) {
      grid = r.grid;
      set(grid, bL, ".");
      set(grid, bR, ".");
      set(grid, targetBL, "[");
      set(grid, targetBR, "]");

      return {
        grid: grid,
        success: true,
      };
    }
  }

  // left box
  if (targetLVal == "]" && targetRVal == ".") {
    const r = moveBox(grid, d, [targetBL[0], targetBL[1] - 1], targetBL);
    if (r.success) {
      grid = r.grid;
      set(grid, bL, ".");
      set(grid, bR, ".");
      set(grid, targetBL, "[");
      set(grid, targetBR, "]");

      return {
        grid: grid,
        success: true,
      };
    }
  }

  // right box
  if (targetLVal == "." && targetRVal == "[") {
    const r = moveBox(grid, d, targetBR, [targetBR[0], targetBR[1] + 1]);
    if (r.success) {
      grid = r.grid;
      set(grid, bL, ".");
      set(grid, bR, ".");
      set(grid, targetBL, "[");
      set(grid, targetBR, "]");

      return {
        grid: grid,
        success: true,
      };
    }
  }

  // two boxes
  if (targetLVal == "]" && targetRVal == "[") {
    const gridCopy = JSON.parse(JSON.stringify(grid));
    const r1 = moveBox(gridCopy, d, [targetBL[0], targetBL[1] - 1], targetBL);
    if (r1.success) {
      const r2 = moveBox(r1.grid, d, targetBR, [targetBR[0], targetBR[1] + 1]);
      if (r2.success) {
        grid = r2.grid;
        set(grid, bL, ".");
        set(grid, bR, ".");
        set(grid, targetBL, "[");
        set(grid, targetBR, "]");

        return {
          grid: grid,
          success: true,
        };
      }
    }
  }

  return {
    grid: grid,
    success: false,
  };
};

const move2 = (grid, pos, dir) => {
  
  const d = directions[dir];
  const targetPos = coordAdd(pos, d);

  if (get(grid, targetPos) == ".") {
    set(grid, pos, ".");
    set(grid, targetPos, "@");

    return {
      pos: targetPos,
      grid: grid,
    };
  }

  // horizontal box move
  if (
    ["<", ">"].indexOf(dir) != -1 &&
    ["[", "]"].indexOf(get(grid, targetPos)) != -1
  ) {
    let p = coordAdd(targetPos, d);

    while (["[", "]"].indexOf(get(grid, p)) != -1) {
      p = coordAdd(p, d);
    }

    if (get(grid, p) == ".") {
      let i = 0;
      do {
        let boxPiece = ""
        if (i % 2 == 0 && dir == '<') {
            boxPiece = "["
        } else if ((i % 2 == 0 && dir == '>')) {
            boxPiece = "]"
        } else if ((i % 2 == 1 && dir == '<')) {
            boxPiece = "]"
        } else if ((i % 2 == 1 && dir == '>')) {
           boxPiece = "["
        }
        set(grid, p, boxPiece);
        
        i++;
        p = coordSubtract(p, d);
      } while (p[1] != targetPos[1]);

      set(grid, pos, ".");
      set(grid, targetPos, "@");

      return {
        pos: targetPos,
        grid: grid,
      };
    }
  }

  // vertical box left-side
  if (["^", "v"].indexOf(dir) != -1 && get(grid, targetPos) == "[") {
    let bL = targetPos;
    let bR = [targetPos[0], targetPos[1] + 1];

    const r = moveBox(grid, d, bL, bR);

    if (r.success) {
      grid = r.grid
      set(grid, pos, ".");
      set(grid, targetPos, "@");

      return {
        pos: targetPos,
        grid: grid,
      };
    }
  }

  // vertical box right-side
  if (["^", "v"].indexOf(dir) != -1 && get(grid, targetPos) == "]") {
    let bL = [targetPos[0], targetPos[1] - 1];
    let bR = targetPos;

    const r = moveBox(grid, d, bL, bR);

    if (r.success) {
      grid = r.grid
      set(grid, pos, ".");
      set(grid, targetPos, "@");

      return {
        pos: targetPos,
        grid: grid,
      };
    }
  }

  // move failed no space to move box
  return {
    pos: pos,
    grid: grid,
  };
};

const processInstructions = (grid, instructions, moveFn) => {
  let g = grid;
  let pos = getCurrentPos(grid);

  for (let i = 0; i < instructions.length; i++) {
    const r = moveFn(g, pos, instructions[i]);
    g = r.grid;
    pos = r.pos;
  }

  return g;
};

const getBoxCoordinates = (grid) => {
  let boxes = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] == "O" || grid[y][x] == "[") {
        boxes.push([y, x]);
      }
    }
  }
  return boxes;
};

const getGpsValue = (c) => c[0] * 100 + c[1];

const input = readInput("src/day15/input");
const parts = input.split("\n\n");

const grid = getGrid(parts[0]);
const instructions = parts[1]
  .trim()
  .split("\n")
  .map((s) => s.trim())
  .join("");


const resultGrid = processInstructions(grid, instructions, move);
print(resultGrid);


console.log(`Part 1: ${sum(getBoxCoordinates(resultGrid).map(getGpsValue))}`);

const grid2 = getGrid2(parts[0]);

const resultGrid2 = processInstructions(grid2, instructions, move2);
print(resultGrid2);

console.log(`Part 2: ${sum(getBoxCoordinates(resultGrid2).map(getGpsValue))}`);
