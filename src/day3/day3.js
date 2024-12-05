import {sum, product, readInput} from "../helper/filehelper.js";

const getMuls = input => [...input.matchAll(/mul\(\d+,\d+\)/gm)].map(r => r[0])

const executeMul = mul => {
    const result = product([...mul.matchAll(/\d+/g)].map(r => r[0]).map(Number))
    //console.log(mul, result)
    return result 
}

const getRelevantParts = input => {
    const dontBlocks = input.split("don't()")
    let relevantParts = []
    relevantParts.push(dontBlocks[0])

    for (let i = 1; i < dontBlocks.length; i++) {
        const dos = dontBlocks[i].split("do()")
        dos.splice(0,1) // remove first element as its the part after don't()
        if (dos.length > 0) {
            relevantParts = relevantParts.concat(dos)
        }
    }
    return relevantParts
}

const input = readInput("src/day3/input")
const part1 = sum(getMuls(input).map(executeMul))
console.log(`Part 1: ${part1}`)

const part2 = sum(getRelevantParts(input).flatMap(getMuls).map(executeMul))
console.log(`Part 2: ${part2}`)