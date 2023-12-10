import {readFileSync} from 'fs';
import * as fs from "fs";

const sampleData = readFileSync("./sample_data", "utf-8").split("\n").map((l) => l.split(""));
const data = readFileSync("./data", "utf-8").split("\n").map((l) => l.split(""));
;

const inputdata = data;

interface Coordinate {
  x: number,
  y: number
}

function _findStartType(startingCords: Coordinate): Coordinate {
  const isPossibleFind = (found: Coordinate) => found.x === startingCords.x && found.y === startingCords.y;
  const north = _pipeConnection({x: startingCords.x - 1, y: startingCords.y})?.find(isPossibleFind);
  const south = _pipeConnection({x: startingCords.x + 1, y: startingCords.y})?.find(isPossibleFind);
  const east = _pipeConnection({x: startingCords.x, y: startingCords.y + 1})?.find(isPossibleFind);
  const weast = _pipeConnection({x: startingCords.x, y: startingCords.y - 1})?.find(isPossibleFind);
  if (north) return {x: startingCords.x - 1, y: startingCords.y};
  if (south) return {x: startingCords.x + 1, y: startingCords.y};
  if (east) return {x: startingCords.x, y: startingCords.y + 1};
  if (weast) return {x: startingCords.x, y: startingCords.y - 1};
  throw new Error("No link found");
}

function _findStartSymbol(startingCords: Coordinate): string {
  const isPossibleFind = (found: Coordinate) => found.x === startingCords.x && found.y === startingCords.y;
  const north = _pipeConnection({x: startingCords.x - 1, y: startingCords.y})?.find(isPossibleFind);
  const south = _pipeConnection({x: startingCords.x + 1, y: startingCords.y})?.find(isPossibleFind);
  const east = _pipeConnection({x: startingCords.x, y: startingCords.y + 1})?.find(isPossibleFind);
  const weast = _pipeConnection({x: startingCords.x, y: startingCords.y - 1})?.find(isPossibleFind);
  if (north && south) return "|";
  if (north && east) return "L";
  if (north && weast) return "J";
  if (east && weast) return "-";
  if (south && weast) return "7";
  if (south && east) return "F";
  if (east && weast) return "-";

  throw new Error("No link found");
}

function _pipeConnection(pipeCoordinate: Coordinate): Coordinate[] | null {
  const pipeType = inputdata[pipeCoordinate.x] && inputdata[pipeCoordinate.x][pipeCoordinate.y]
    ? inputdata[pipeCoordinate.x][pipeCoordinate.y]
    : null;
  if (!pipeType) return null;
  switch (pipeType) {
    case "|":
      return [{x: pipeCoordinate.x + 1, y: pipeCoordinate.y}, {x: pipeCoordinate.x - 1, y: pipeCoordinate.y}];
    case "-":
      return [{x: pipeCoordinate.x, y: pipeCoordinate.y + 1}, {x: pipeCoordinate.x, y: pipeCoordinate.y - 1}];
    case "L":
      return [{x: pipeCoordinate.x - 1, y: pipeCoordinate.y}, {x: pipeCoordinate.x, y: pipeCoordinate.y + 1}];
    case "J":
      return [{x: pipeCoordinate.x - 1, y: pipeCoordinate.y}, {x: pipeCoordinate.x, y: pipeCoordinate.y - 1}];
    case "7":
      return [{x: pipeCoordinate.x + 1, y: pipeCoordinate.y}, {x: pipeCoordinate.x, y: pipeCoordinate.y - 1}];
    case "F":
      return [{x: pipeCoordinate.x + 1, y: pipeCoordinate.y}, {x: pipeCoordinate.x, y: pipeCoordinate.y + 1}];
    default:
      return null;
  }
}

const circuitCoords: Coordinate[] = [];

function _runPipe(fromPosition: Coordinate, positionStart: Coordinate) {
  let isOver = false;
  let position: Coordinate = positionStart;
  let from: Coordinate = fromPosition;
  let steps = 1;
  circuitCoords.push(from);
  while (!isOver) {
    circuitCoords.push(position);
    const direction = _pipeConnection(position);
    if (!direction) throw new Error(`Not possible ${position}`);
    const next: Coordinate = direction.filter((dir) => ((dir.x !== from.x) || (dir.y !== from.y))).pop() as Coordinate;
    from = position;
    position = next;
    steps++;
    if (inputdata[position.x][position.y] === "S") isOver = true;
  }
  return steps;
}

function _findStartingPoint(): Coordinate {
  for (let i = 0; i < inputdata.length; i++) {
    const l = inputdata[i];
    if (l.indexOf("S") !== -1) {
      return {x: i, y: l.indexOf("S")};
    }
  }
  throw new Error("Should contain S");
}

function _isInCircuit(pos: Coordinate) {
  let isCircuit = inputdata[pos.x][pos.y].split("");
  return {isCircuit: isCircuit[0] === "X", symbol: isCircuit[1]};
}

function _findIntersec(pos: Coordinate) {
  const {isCircuit} = _isInCircuit(pos);
  if (isCircuit || pos.x === inputdata.length - 1 || pos.y === inputdata[pos.x].length - 1) return false;
  let directionSwitch = 0;
  let currentDir = "";
  for (let before = 0; before < pos.y; before++) {
    const {isCircuit, symbol} = _isInCircuit({x: pos.x, y: before});
    if (isCircuit) {
      if (symbol === "J" || symbol === "L") {
        if (currentDir === "south") {
          directionSwitch++;
          currentDir = "";
        } else {
          if (currentDir === "north") {
            currentDir = "";
          } else {
            currentDir = "north";
          }
        }
      }
      if (symbol === "7" || symbol === "F") {
        if (currentDir === "north") {
          directionSwitch++;
          currentDir = "";
        } else {
          if (currentDir === "south") {
            currentDir = "";
          } else {
            currentDir = "south";
          }
        }
      }
      if (symbol === "|") {
        currentDir = "";
        directionSwitch++
      }
    }
  }
  if (!directionSwitch) {
    return false;
  }
  if ((directionSwitch % 2 !== 0)) {
    return true;
  }
  return false;
}

function _findInside() {
  let match = 0;
  for (let x = 0; x < inputdata.length; x++) {
    for (let y = 0; y < inputdata[0].length; y++) {
      if (_findIntersec({x, y})) {
        match++;
      }
    }
  }
  return match;
}

function main() {
  const startCoords = _findStartingPoint();
  const loopStart = _findStartType(startCoords);
  const startSymbol = _findStartSymbol(startCoords);
  // const res: number = _runPipe(startCoords, loopStart);
  for (let i = 0; i < circuitCoords.length; i++) {
    if (inputdata[circuitCoords[i].x][circuitCoords[i].y] === "S") {
      inputdata[circuitCoords[i].x][circuitCoords[i].y] = startSymbol;
    }
    inputdata[circuitCoords[i].x][circuitCoords[i].y] = `X${inputdata[circuitCoords[i].x][circuitCoords[i].y]}`;
  }
  const answer = _findInside();
  console.log("Part 2", answer);
}

main();