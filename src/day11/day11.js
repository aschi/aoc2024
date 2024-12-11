import { sum, readInput } from "../helper/helper.js";

const stoneResolverCache = new Map();

const rules = [
  {
    isApplicable: (s) => s === 0,
    apply: (s) => [1],
  },
  {
    isApplicable: (s) => s.toString().length % 2 == 0,
    apply: (s) => {
      const str = s.toString();
      const half1 = str.substring(0, str.length / 2);
      const half2 = str.substring(str.length / 2);
      return [Number(half1), Number(half2)];
    },
  },
  {
    isApplicable: (s) => true,
    apply: (s) => [s * 2024],
  },
];

const countStones = (stones) => sum(stones.values());

const createStonesMap = (numbers) => {
  const stones = new Map();
  numbers.forEach((n) => stones.set(n, 1));
  return stones;
};

const resolveTargetStones = (stone) => {
  if (!stoneResolverCache.has(stoneResolverCache)) {
    const rule = rules.filter((r) => r.isApplicable(stone))[0];
    const result = rule.apply(stone);
    stoneResolverCache.set(stone, result);
    return result;
  } else {
    return stoneResolverCache.get(stone);
  }
};

const blink = (stones, times) => {
  for (let i = 0; i < times; i++) {
    let nextStones = new Map();

    for (const stone of stones.keys()) {
      const target = resolveTargetStones(stone);
      target.forEach((t) => {
        let c = 0;
        if (nextStones.has(t)) {
          c = nextStones.get(t);
        }
        nextStones.set(t, c + stones.get(stone));
      });
    }

    stones = nextStones;
  }
  return stones;
};

let numbers = readInput("src/day11/input").split(" ").map(Number);
let stones = createStonesMap(numbers);

console.log(`Part 1: ${countStones(blink(stones, 25))}`);
console.log(`Part 1: ${countStones(blink(stones, 75))}`);
