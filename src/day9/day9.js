import { readInput } from "../helper/helper.js";

const generateMemory = (input) => {
  const memory = [];

  for (let i = 0; i < input.length; i++) {
    for (let x = 0; x < input[i]; x++) {
      if (i % 2 == 0) {
        memory.push(i / 2);
      } else {
        memory.push(".");
      }
    }
  }
  return memory;
};

const optimizeMemory1 = (memory) => {
  let pointer = 0;
  for (let i = memory.length - 1; i > pointer; i--) {
    if (memory[i] !== ".") {
      while (memory[pointer] !== "." && pointer < i) {
        pointer++;
      }
      memory[pointer] = memory[i];
    }
  }
  memory.splice(pointer + 1, memory.length - pointer - 1);
  return memory;
};

const parseAndOptimizeMemory = (input) => {
  const lastFile = (input.length % 2 == 0) ? input.length - 2 : input.length -1

  const processedFiles = new Set();
  const memory = [];

  for (let i = 0; i < input.length; i++) {
    if (i % 2 == 0 && !processedFiles.has(i)) {
      processedFiles.add(i)
      for (let x = 0; x < input[i]; x++) {
        memory.push(i / 2);
      }
    } else {
      let emptySpace = Number(input[i])
      for (let n = lastFile; n >= 0 && emptySpace > 0 ; n-=2) {
        if (!processedFiles.has(n)) {
            let nFileLength = Number(input[n])
            if (nFileLength <= emptySpace) {
                processedFiles.add(n)
                emptySpace -= nFileLength
                for (let y = 0; y < nFileLength; y++) {
                    memory.push(n/2)
                }
            }
        }
      }
      if (emptySpace > 0) {
        for (let y = 0; y < emptySpace; y++) {
            memory.push('.')
        }
      }
    }
  }
  return memory;
};

const calculateChecksum = (memory) => {
  let sum = 0;
  for (let i = 0; i < memory.length; i++) {
    if (!isNaN(memory[i])) {
        sum += i * memory[i];
    }
  }
  return sum;
};

const memory = generateMemory(readInput("src/day9/input"));
const optimizedMemory = optimizeMemory1(memory);
console.log(`Part 1: ${calculateChecksum(optimizedMemory)}`);

const optimizedMemory2 = parseAndOptimizeMemory(readInput("src/day9/input"));
console.log(`Part 2: ${calculateChecksum(optimizedMemory2)}`);
