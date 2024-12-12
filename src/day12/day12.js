import {
  sum,
  isInBound,
  getCoordinateString,
  directions,
  readInputArray,
} from "../helper/helper.js";

const getAdjacentSameFields = (coords, processedFields, input) => {
  const value = input[coords[0][0]][coords[0][1]];

  const returnValues = coords.flatMap((co) =>
    directions
      .map((d) => [co[0] + d[0], co[1] + d[1]])
      .filter((c) => isInBound(input, c))
      .filter((c) => input[c[0]][c[1]] === value)
      .filter((c) => !processedFields.has(getCoordinateString(c)))
  );

  returnValues.forEach((rv) => processedFields.add(getCoordinateString(rv)));

  return returnValues;
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

const input = readInputArray("src/day12/test_input1");
const regions = getRegions(input);
console.log(regions);
