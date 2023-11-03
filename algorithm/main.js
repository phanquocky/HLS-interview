"use strict";

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("", (input) => {
  main(input);
  rl.close();
});

// find min, max element in the numbers array, and the total sum of all elements
function findMinMaxSum(numbers) {
  let min = numbers[0];
  let max = numbers[0];
  let sum = 0;

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] < min) {
      min = numbers[i];
    }
    if (numbers[i] > max) {
      max = numbers[i];
    }
    sum += numbers[i];
  }

  return { min, max, sum };
}

function main(input) {
  const numbers = input.trim().split(" ").map(Number);
  const { min, max, sum } = findMinMaxSum(numbers);

  console.log(`${sum - max} ${sum - min}`);
}
