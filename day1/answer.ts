import {readFileSync} from 'fs';

const sampleData = readFileSync("./sample_data", "utf-8").split('\n');
const data = readFileSync("./data", "utf-8").split('\n');

const inputdata = data;

const numStringConverter: { [key: string]: number } = {
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9,
}
const numRegex = /[1-9]|(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)/g;

function parseNum(num: string): number {
  if (num && numStringConverter[num]) {
    return numStringConverter[num];
  } else {
    return +num;
  }
}

function findFirstNumber(inputString: string): number {
  let resString = "";
  for (let i = 0; i < inputString.length; i++) {
    resString += inputString[i];
    const match = resString.match(numRegex);
    if(match && match.length > 0) {
      return parseNum(match.pop() as string);
    }
  }
  return 0;
}

function findLastNumber(inputString: string): number {
  let resString = "";
  for (let i = inputString.length - 1; i >= 0; i--) {
    resString = inputString[i] + resString;
    const match = resString.match(numRegex);
    if(match && match.length > 0) {
      return parseNum(match.pop() as string);
    }
  }
  return 0;
}

function main(): void {
  let total = 0;
  inputdata.forEach((w, i) => {
      const fNumber = findFirstNumber(w);
      const lNumber = findLastNumber(w);
      const calibration = +`${fNumber}${lNumber}`;
      total += calibration;
  });
  console.log('Total for calibration', total);
}

main();