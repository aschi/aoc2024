import { sum, readInput } from "../helper/helper.js";

const getNumbers = (line) =>
  [...line.matchAll(/(\d+)/g)].flatMap((m) => m[0]).map(Number);

const parseMachine = (machine) => {
  const lines = machine.trim().split("\n");
  return {
    A: getNumbers(lines[0]),
    B: getNumbers(lines[1]),
    R: getNumbers(lines[2]),
  };
};

const parseMachineErrorCorrection = (machine) => {
    const lines = machine.trim().split("\n");
    return {
      A: getNumbers(lines[0]),
      B: getNumbers(lines[1]),
      R: getNumbers(lines[2]).map(n => n + 10000000000000),
    };
  };

const solve = m => {
    const bPresses = (m.R[1]-((m.A[1]/m.A[0])*m.R[0]))/(m.B[1]-((m.A[1]/m.A[0])* m.B[0]))
    const aPresses = (m.R[0]-(m.B[0]*bPresses))/m.A[0]
    
    const bRounded = Math.round(bPresses*1000)/1000
    const aRounded = Math.round(aPresses*1000)/1000

    return {
        A: aRounded,
        B: bRounded,
        isSolved: Number.isInteger(aRounded) && Number.isInteger(bRounded)
    }

}

const getCosts = r => {
    if (r.isSolved) {
        return r.A*3 + r.B*1
    }
    return 0
}

const input = readInput("src/day13/input");
const machines = input.split("\n\n").map(parseMachine);
console.log(`Part 1: ${sum(machines.map(solve).filter(r => r.isSolved).map(getCosts))}`)

const machines2 = input.split("\n\n").map(parseMachineErrorCorrection);
console.log(`Part 2: ${sum(machines2.map(solve).filter(r => r.isSolved).map(getCosts))}`)
