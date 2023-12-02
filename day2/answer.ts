import {readFileSync} from 'fs';

const sampleData = readFileSync("./sample_data", "utf-8").split('\n');
const data = readFileSync("./data", "utf-8").split('\n');

const inputdata = data;


interface CubeSet {
  red: number;
  green: number;
  blue: number;

  [key: string]: number;
}

const checkingSet: CubeSet = {
  red: 12,
  green: 13,
  blue: 14,
}


function main() {
  let possibleGameIdCumulate = 0;
  let cumulatedPower = 0;
  // Parse each game
  inputdata.forEach((game) => {
    let isGameValid = true;
    const parsedGame = game.split(":");
    const gameId = parsedGame[0].split(" ")[1];
    const setPlayed = parsedGame[1].split(";");
    let minimumCubesForGame: CubeSet = {red: 0, green: 0, blue: 0};
    setPlayed.forEach((set) => {
      const setWithCube: CubeSet = {red: 0, green: 0, blue: 0};
      set.replace(" ", "").split(", ").forEach((d) => {
        const [number, color] = d.split(" ");
        if (color in setWithCube) {
          setWithCube[color] = +number;
        }
      });
      // Part 1
      if(checkingSet.red < setWithCube.red || checkingSet.green < setWithCube.green || checkingSet.blue < setWithCube.blue) {
        isGameValid = false;
      }
      // Part 2
      if(minimumCubesForGame.red < setWithCube.red) minimumCubesForGame.red = setWithCube.red;
      if(minimumCubesForGame.green < setWithCube.green) minimumCubesForGame.green = setWithCube.green;
      if(minimumCubesForGame.blue < setWithCube.blue) minimumCubesForGame.blue = setWithCube.blue;
    });
    cumulatedPower += minimumCubesForGame.red * minimumCubesForGame.green * minimumCubesForGame.blue;
    if (isGameValid) possibleGameIdCumulate += +gameId;
  });
  console.log("Answer Part 1: ", possibleGameIdCumulate);
  console.log("Answer Part 2: ", cumulatedPower);
}

main();