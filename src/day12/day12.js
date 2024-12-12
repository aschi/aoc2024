import {
  sum,
  isInBound,
  getCoordinateString,
  filterDuplicateCoordinates,
  directions,
  readInputArray,
} from "../helper/helper.js";

const getAdjacentSameFields = (coords, processedFields, input) => {
  const value = input[coords[0][0]][coords[0][1]];

  const returnValues = filterDuplicateCoordinates(
    coords.flatMap((co) =>
      directions
        .map((d) => [co[0] + d[0], co[1] + d[1]])
        .filter((c) => isInBound(input, c))
        .filter((c) => input[c[0]][c[1]] === value)
        .filter((c) => !processedFields.has(getCoordinateString(c)))
    )
  );

  returnValues.forEach((rv) => processedFields.add(getCoordinateString(rv)));
  return returnValues;
};

const calculateCircumference = (region) => {
  const regionComp = new Set(region.map(getCoordinateString));

  return sum(
    region.map(
      (co) =>
        directions
          .map((d) => [co[0] + d[0], co[1] + d[1]])
          .map(getCoordinateString)
          .filter((str) => !regionComp.has(str)).length
    )
  );
};

const isNeighbour = (dir, c1, c2) => {
  if (dir < 2) {
    return c1[0] === c2[0] && (c1[1] + 1 === c2[1] || c1[1] - 1 === c2[1]);
  } else {
    return c1[1] === c2[1] && (c1[0] + 1 === c2[0] || c1[0] - 1 === c2[0]);
  }
};

const attachesToSide = (sides, direction, c1) => {
  const relevant = sides
    .filter((s) => s.dir === direction)
    .filter((s) => s.fencePieces.some((c2) => isNeighbour(s.dir, c1, c2)));
  if (relevant.length > 0) {
    relevant[0].fencePieces.push(c1);
    return true;
  }
  return false;
};

const calculateCircumferenceWithSides = (region) => {
  const sides = [];
  const regionComp = new Set(region.map(getCoordinateString));

  return sum(
    region.map((co) => {
      const fences = directions
        .map((d, dIndex) => [dIndex, [co[0] + d[0], co[1] + d[1]]])
        .map((arr) => [arr[0], arr[1], getCoordinateString(arr[1])])
        .filter((arr) => !regionComp.has(arr[2]))
        .filter((arr) => !attachesToSide(sides, arr[0], arr[1]));

      fences.forEach((f) => sides.push({ dir: f[0], fencePieces: [f[1]] }));
      return fences.length;
    })
  );
};

const getRegions = (input) => {
  let processedFields = new Set();
  let regions = [];

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input.length; x++) {
      const coord = [y, x];
      const coordStr = getCoordinateString(coord);
      if (processedFields.has(coordStr)) {
        continue;
      }
      processedFields.add(coordStr);

      let area = [coord];
      let additionalFields = [coord];
      while (additionalFields.length > 0) {
        additionalFields = getAdjacentSameFields(
          additionalFields,
          processedFields,
          input
        );
        area.push(...additionalFields);
      }
      regions.push(area);
    }
  }
  return regions;
};

const input = readInputArray("src/day12/input");
const regions = getRegions(input);
console.log(
  `Part 1: ${sum(regions.map((r) => calculateCircumference(r) * r.length))}`
);

console.log(
  `Part 2: ${sum(
    regions.map((r) => calculateCircumferenceWithSides(r) * r.length)
  )}`
);
