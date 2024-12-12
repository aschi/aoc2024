import {
  sum,
  isInBound,
  coordAdd,
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
        .map((d) => coordAdd(co, d))
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
          .map((d) => coordAdd(co, d))
          .map(getCoordinateString)
          .filter((str) => !regionComp.has(str)).length
    )
  );
};

const countCornersOfBlock = (regionComp, c) => {
  let cornerCount = 0;

  // outer topleft
  if (
    !regionComp.has(getCoordinateString(coordAdd(c, [-1, 0]))) &&
    !regionComp.has(getCoordinateString(coordAdd(c, [0, -1])))
  ) {
    cornerCount++;
  }

  // outer topright
  if (
    !regionComp.has(getCoordinateString(coordAdd(c, [-1, 0]))) &&
    !regionComp.has(getCoordinateString(coordAdd(c, [0, 1])))
  ) {
    cornerCount++;
  }

  // outer bottomleft
  if (
    !regionComp.has(getCoordinateString(coordAdd(c, [1, 0]))) &&
    !regionComp.has(getCoordinateString(coordAdd(c, [0, -1])))
  ) {
    cornerCount++;
  }

  // outer bottomright
  if (
    !regionComp.has(getCoordinateString(coordAdd(c, [1, 0]))) &&
    !regionComp.has(getCoordinateString(coordAdd(c, [0, 1])))
  ) {
    cornerCount++;
  }

  // inner topleft
  if (
    regionComp.has(getCoordinateString(coordAdd(c, [-1, 0]))) &&
    regionComp.has(getCoordinateString(coordAdd(c, [0, -1]))) &&
    !regionComp.has(getCoordinateString(coordAdd(c, [-1, -1])))
  ) {
    cornerCount++;
  }

  // inner topright
  if (
    regionComp.has(getCoordinateString(coordAdd(c, [-1, 0]))) &&
    regionComp.has(getCoordinateString(coordAdd(c, [0, 1]))) &&
    !regionComp.has(getCoordinateString(coordAdd(c, [-1, 1])))
  ) {
    cornerCount++;
  }

  // inner bottomleft
  if (
    regionComp.has(getCoordinateString(coordAdd(c, [1, 0]))) &&
    regionComp.has(getCoordinateString(coordAdd(c, [0, -1]))) &&
    !regionComp.has(getCoordinateString(coordAdd(c, [1, -1])))
  ) {
    cornerCount++;
  }

  // inner bottomright
  if (
    regionComp.has(getCoordinateString(coordAdd(c, [1, 0]))) &&
    regionComp.has(getCoordinateString(coordAdd(c, [0, 1]))) &&
    !regionComp.has(getCoordinateString(coordAdd(c, [1, 1])))
  ) {
    cornerCount++;
  }

  return cornerCount;
};

const countCorners = (region) => {
  const regionComp = new Set(region.map(getCoordinateString));

  const returnValue = sum(
    region.map((c) => countCornersOfBlock(regionComp, c))
  );
  //console.log(region, returnValue);
  return returnValue;
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

console.log(`Part 2: ${sum(regions.map((r) => countCorners(r) * r.length))}`);
