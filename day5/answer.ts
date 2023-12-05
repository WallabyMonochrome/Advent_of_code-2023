import {readFileSync} from 'fs';

const sampleData = readFileSync("./sample_data", "utf-8").split("\n");
const data = readFileSync("./data", "utf-8").split("\n");


const inputdata = data;

type Range = { destRange: number, sourceRange: number, lengthRange: number }

const mapDict: any = {};

const mappingName: any = {}

let seedsToSow: any = [];

let seedRange: any = [];

function _parseInput(inputToParse: string[]) {
  const [, seeds] = inputToParse[0].split("seeds: ");
  seedsToSow = seeds.split(" ").map((s) => parseInt(s));
  for (let i = 0; i < seedsToSow.length; i += 2) {
    seedRange.push({min: seedsToSow[i], max: seedsToSow[i] + seedsToSow[i + 1] - 1});
  }
  mappingName.seed = "soil";
  mappingName.location = "end";
  inputToParse.splice(0, 2);
  let mapName = "";
  inputToParse.forEach((l) => {
    if (!l) return;
    if (l.indexOf(":") !== -1) {
      let oldMapName = mapName;
      [mapName,] = l.split(" map:");
      if (mapDict[oldMapName]) {
        mapDict[oldMapName].sort((a: Range, b: Range) => {
          return a.sourceRange - b.sourceRange;
        });
        const [fromMapping, toMapping] = mapName.split("-to-");
        mappingName[fromMapping] = toMapping;
      }
      return;
    } else {
      if (!mapDict[mapName]) mapDict[mapName] = [];
      const [destRange, sourceRange, lengthRange] = l.split(" ");
      mapDict[mapName].push({destRange: +destRange, sourceRange: +sourceRange, lengthRange: +lengthRange});
    }
  });
}

function recursiveMapping(range: number, mapsRange: Range[], currentMapStep: string) {
  if (currentMapStep === "end") {
    return range;
  }
  const mapping = mapDict[`${currentMapStep}-to-${mappingName[currentMapStep]}`];
  for (let i = 0; i < mapsRange.length; i++) {
    const map = mapsRange[i];
    if (map.sourceRange <= range && map.sourceRange + map.lengthRange > range) {
      const offsetRange = range - map.sourceRange;
      return recursiveMapping(map.destRange + offsetRange, mapping, mappingName[currentMapStep]);
    }
  }
  return recursiveMapping(range, mapping, mappingName[currentMapStep]);
}

function recursiveMappingRange(minRange: number, maxRange: number, mapsRange: Range[], currentMapStep: string): any {
  if (currentMapStep === "end") {
    return minRange;
  }
  const mapping = mapDict[`${currentMapStep}-to-${mappingName[currentMapStep]}`];
  let lowestValue = [];
  let nonMappedValues: any = [];
  let minMapped = minRange;
  for (let i = 0; i < mapsRange.length; i++) {
    const map = mapsRange[i];
    if ((minRange <= map.sourceRange && maxRange >= map.sourceRange) || (minRange >= map.sourceRange && maxRange < map.sourceRange + map.lengthRange)) {
      const newMinRange = Math.max(map.sourceRange, minRange);
      const minRangeMapped = newMinRange - map.sourceRange + map.destRange;
      const newMaxRange = Math.min(map.sourceRange + map.lengthRange, maxRange);
      const maxRangeMapped = newMaxRange - (map.sourceRange + map.lengthRange) + map.destRange + map.lengthRange;
      if (newMinRange > minMapped) {
        nonMappedValues.push({min: minMapped, max: newMinRange});
      }
      minMapped = newMaxRange;
      lowestValue.push(recursiveMappingRange(minRangeMapped, maxRangeMapped, mapping, mappingName[currentMapStep]));
    }
  }
  if (minMapped < maxRange) {
    nonMappedValues.push({min: minMapped, max: maxRange});

  }
  for (let j = 0; j < nonMappedValues.length; j++) {
    lowestValue.push(recursiveMappingRange(nonMappedValues[j].min, nonMappedValues[j].max, mapping, mappingName[currentMapStep]));
  }
  return Math.min(...lowestValue);
}

function main() {
  _parseInput(inputdata);
  let locationsFound: any = [];
  let locationsRangeFound: any = [];
  let mapStep = "seed";
  seedsToSow.forEach((s: number) => {
    const mapping = mapDict[`${mapStep}-to-${mappingName[mapStep]}`];
    locationsFound.push(recursiveMapping(s, mapping, mappingName[mapStep]));
  });
  console.log("Part 1", Math.min(...locationsFound));
  seedRange.forEach((pair: { min: number, max: number }) => {
    const mapping = mapDict[`${mapStep}-to-${mappingName[mapStep]}`];
    locationsRangeFound.push(recursiveMappingRange(pair.min, pair.max, mapping, mappingName[mapStep]));
  });
  console.log("Part 2", Math.min(...locationsRangeFound));

}

main();
