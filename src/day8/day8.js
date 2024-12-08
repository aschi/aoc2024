import { isInBound, readInputLines } from "../helper/helper.js";

const getAllAntennas = (input) => {
  const antennas = new Map();
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const chr = input[y][x];
      if (chr !== ".") {
        if (!antennas.has(chr)) {
          antennas.set(chr, []);
        }
        antennas.get(chr).push([y, x]);
      }
    }
  }
  return antennas;
};

const getAntinodes1 = (input, coordinates) => {
  return coordinates.flatMap((c) =>
    coordinates
      .filter((co) => !(co[0] == c[0] && co[1] == c[1]))
      .map((co) => {
        const diff = [c[0] - co[0], c[1] - co[1]];
        return [c[0] + diff[0], c[1] + diff[1]];
      })
      .filter((c) => isInBound(input, c))
  );
};

const getAntinodes2 = (input, coordinates) => {
  return coordinates.flatMap((c) =>
    coordinates
      .filter((co) => !(co[0] == c[0] && co[1] == c[1]))
      .flatMap((co) => {
        const diff = [c[0] - co[0], c[1] - co[1]];
        let positions = [c];
        let newPos = [c[0] + diff[0], c[1] + diff[1]];
        while (isInBound(input, newPos)) {
          positions.push(newPos);
          newPos = [newPos[0] + diff[0], newPos[1] + diff[1]];
        }
        return positions;
      })
  );
};

const input = readInputLines("src/day8/input");
const antennas = getAllAntennas(input);

const antinodes1 = antennas
  .keys()
  .flatMap((k) => getAntinodes1(input, antennas.get(k)))
  .reduce((set, x) => set.add(`y:${x[0]},x:${x[1]}`), new Set());

console.log(`Part 1: ${antinodes1.size}`);

const antinodes2 = antennas
  .keys()
  .flatMap((k) => getAntinodes2(input, antennas.get(k)))
  .reduce((set, x) => set.add(`y:${x[0]},x:${x[1]}`), new Set());

console.log(`Part 2: ${antinodes2.size}`);
