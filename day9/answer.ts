import {readFileSync} from 'fs';

const sampleData = readFileSync("./sample_data", "utf-8").split("\n");
const data = readFileSync("./data", "utf-8").split("\n");

const inputdata = data;

function _extrapolateLastValue(sequence: number[]): number {
  if(sequence.every(n => n === 0)) {
    return 0;
  }
  const newArray = [];
  for(let i = 0; i < sequence.length - 1; i++) {
    newArray.push(sequence[i + 1] - sequence[i]);
  }
  const sequenceLastNumber: number = sequence[sequence.length - 1];
  const newValue: number = _extrapolateLastValue(newArray);
  return sequenceLastNumber + newValue;
}
function _extrapolateFirstValue(sequence: number[]): number {
  if(sequence.every(n => n === 0)) {
    return 0;
  }
  const newArray = [];
  for(let i = 0; i < sequence.length - 1; i++) {
    newArray.push(sequence[i + 1] - sequence[i]);
  }
  const sequenceFirstNumber: number = sequence[0];
  const newValue: number = _extrapolateFirstValue(newArray);
  return sequenceFirstNumber - newValue;
}

function main() {
  const arrayRes: number[] = [];
  inputdata.forEach((sequence) => {
    const numSeq = sequence.split(" ").map(d => +d);
    // arrayRes.push(_extrapolateLastValue(numSeq));
    arrayRes.push(_extrapolateFirstValue(numSeq));
  });
  const answer = arrayRes.reduce((prev, val) => val + prev,0);
  console.log("Part 1 Answer", answer);
}

main();