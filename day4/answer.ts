import {readFileSync} from 'fs';

const sampleData = readFileSync("./sample_data", "utf-8").split('\n');
const data = readFileSync("./data", "utf-8").split('\n');


const inputdata = data;

function main() {
  let totalScore = 0;
  inputdata.forEach((card) => {
    const [cardName, cardContent] = card.split(": ");
    const [winningNumber, playedNumber] = cardContent.split(" | ").map((d) => d.split(" ").filter((c) => c !== ''));
    let winningDict: any = {};
    let scoreForCard = 0;
    winningNumber.forEach((wNumber) => {
      winningDict[+wNumber] = true;
    })
    playedNumber.forEach((pNumber) => {
      if (winningDict[+pNumber]) {
        scoreForCard = scoreForCard ? scoreForCard * 2 : 1;
      }
    });
    totalScore += scoreForCard;
  });
  console.log("Part 1 ", totalScore);
}

function mainPart2() {
  let cardDeck: any = {};
  inputdata.forEach((card) => {
    const [cardName, cardContent] = card.split(": ");
    const [, cardId] = cardName.split("Card ");
    const numCardId = parseInt(cardId);
    if (!cardDeck[+numCardId]) cardDeck[+numCardId] = 0;
    cardDeck[+numCardId]++;
    const [winningNumber, playedNumber] = cardContent.split(" | ").map((d) => d.split(" ").filter((c) => c !== ''));
    let winningDict: any = {};
    let scoreForCard = 0;
    winningNumber.forEach((wNumber) => {
      winningDict[+wNumber] = true;
    })
    playedNumber.forEach((pNumber) => {
      if (winningDict[+pNumber]) {
        scoreForCard++;
      }
    });
    for (let i = 1; i <= scoreForCard; i++) {
      if (!cardDeck[numCardId + i]) {
        cardDeck[numCardId + i] = 0;
      }
      cardDeck[+numCardId + i] += cardDeck[numCardId];
    }
  });
  let totalCards = 0;
  Object.keys(cardDeck).forEach((c) => {
    totalCards += cardDeck[c];
  })
  console.log("Part 2 ", totalCards);
}


mainPart2();