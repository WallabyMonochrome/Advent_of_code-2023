import {readFileSync} from 'fs';
import * as fs from "fs";

const sampleData = readFileSync("./sample_data", "utf-8").split('\n').map((line) => line.split(""));
const data = readFileSync("./data", "utf-8").split('\n').map((line) => line.split(""));

const inputdata = data;

interface GearLocation {
  [key: string]: any;
}

function lookupAdj(x: number, y: number): boolean {
  for (let xCheck = x - 1; xCheck <= x + 1; xCheck++) {
    for (let yCheck = y - 1; yCheck <= y + 1; yCheck++) {
      if (inputdata[xCheck] && inputdata[xCheck][yCheck] && !parseInt(inputdata[xCheck][yCheck]) && inputdata[xCheck][yCheck] !== '0' && inputdata[xCheck][yCheck] !== ".") {
        return true;
      }
    }
  }
  return false;
}

function lookupAdjGear(x: number, y: number): any {
  for (let xCheck = x - 1; xCheck <= x + 1; xCheck++) {
    for (let yCheck = y - 1; yCheck <= y + 1; yCheck++) {
      if (inputdata[xCheck] && inputdata[xCheck][yCheck] && inputdata[xCheck][yCheck] === "*") {
        return {x: xCheck, y: yCheck};
      }
    }
  }
  return null;
}

function searchPart1(line: any[], x: number, totalPartNumber: any[]) {
  let constructedNumber = "";
  let isValidNumber = false;
  line.forEach((char, y) => {
    if (parseInt(char) || char === '0') {
      constructedNumber += char;
      isValidNumber = isValidNumber || lookupAdj(x, y);
    } else {
      if ((constructedNumber !== "") && isValidNumber) {
        totalPartNumber.push(+constructedNumber);
      }
      isValidNumber = false;
      constructedNumber = "";
    }
  });
  if ((constructedNumber !== "") && isValidNumber) {
    totalPartNumber.push(+constructedNumber);
  }
}

function searchPart2(line: any[], x: number, gearFoundTotal: any) {
  let constructedNumber = "";
  let gearFound: any = null;
  line.forEach((char, y) => {
    if (parseInt(char) || char === '0') {
      constructedNumber += char;
      gearFound = gearFound || lookupAdjGear(x, y);
    } else {
      if ((constructedNumber !== "") && gearFound) {
        if (!gearFoundTotal[`${gearFound.x}${gearFound.y}`]) {
          gearFoundTotal[`${gearFound.x}${gearFound.y}`] = [+constructedNumber];
        } else {
          gearFoundTotal[`${gearFound.x}${gearFound.y}`].push(+constructedNumber);
        }
      }
      gearFound = null;
      constructedNumber = "";
    }
  });
  if ((constructedNumber !== "") && gearFound) {
    if (!gearFoundTotal[`${gearFound.x}${gearFound.y}`]) {
      gearFoundTotal[`${gearFound.x}${gearFound.y}`] = [+constructedNumber];
    } else {
      gearFoundTotal[`${gearFound.x}${gearFound.y}`].push(+constructedNumber);
    }
  }
}


function main() {
  const totalPartNumber: any[] = [];
  const gearFoundTotal: any = {};
  // Part 1
  inputdata.forEach((line, y) => searchPart1(line, y, totalPartNumber));
  console.log("Part 1 Result", totalPartNumber.reduce((acc, val) => {
    return val + acc;
  }, 0));

  // Part 2
  inputdata.forEach((line, y) => searchPart2(line, y, gearFoundTotal));
  let resultPart2 = 0;
  Object.keys(gearFoundTotal).forEach((key) => {
    const numberMatch = gearFoundTotal[key];
    if(numberMatch.length === 2) {
      resultPart2 += numberMatch[0] * numberMatch[1];
    }
  });
  console.log("Part 2 result", resultPart2);
}

main();