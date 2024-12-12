import fs from "fs";

export const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export const readInput = (path) =>
  fs.readFileSync(path, "utf8").replace(/^\s+|\s+$/g, "");

export const readInputLines = (path) => readInput(path).split("\n");

export const readInputArray = path => readInputLines(path).map(s => s.split(''))

export const readInputNumberArray = path => readInputArray(path).map(arr => arr.map(Number))

export const getCoordinateString = co => `y: ${co[0]}, x: ${co[1]}`

export const filterDuplicateCoordinates = arr => {
  const s = new Set()
  const rv = []
  for (let i = 0; i < arr.length; i++) {
    const str = getCoordinateString(arr[i])
    if (!s.has(str)) {
      s.add(str)
      rv.push(arr[i])
    }
  }
  return rv
}

export const arrayMove = (arr, oldIndex, newIndex) => {
  while (oldIndex < 0) {
    oldIndex += arr.length;
  }
  while (newIndex < 0) {
    newIndex += arr.length;
  }
  if (newIndex >= arr.length) {
    var k = newIndex - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr; // for testing purposes
};

export const replaceAt = (input, index, replacement) =>
  input.substring(0, index) +
  replacement +
  input.substring(index + replacement.length);

export const isInBound = (input, c) =>
  c[0] >= 0 && c[1] >= 0 && c[0] < input.length && c[1] < input[0].length;

export const sum = (numbers) => numbers.reduce((a, b) => a + b, 0);

export const product = (numbers) => numbers.reduce((a, b) => a * b, 1);
