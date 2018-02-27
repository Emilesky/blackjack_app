/********************************/
/********** global *************/

const playerArea = document.getElementById('playerArea');
const dealerArea = document.getElementById('dealerArea');
const playerHandOutput = document.getElementById('playerHandOutput');
const dealerHandOutput = document.getElementById('dealerHandOutput');
const handScoreOutput = document.getElementById('handScoreOutput');

document.getElementById('init').addEventListener('click', init);
document.getElementById('hit').addEventListener('click', hit);
document.getElementById('stand').addEventListener('click', stand);

let cards = [];
let playerHand = []; 
let dealerHand = [];
let cardCount = 0; 

const suits = ['spades', 'hearts', 'diams', 'clubs'];
const numbers = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

for (let suit in suits) {
  const suitCheck = suits[suit][0].toUpperCase();
  // spades & clubs set to black
  const suitColour = suitCheck === 'S' || suitCheck === 'C' ? 'black' : 'red';

  for (let number in numbers) {
    // nums J, Q, K parsed to int and set to value of 10
    const value = number > 9 ? 10 : parseInt(number) + 1;
    
    const card = {
      suit: suitCheck,
      suitColour,
      value,
      number: numbers[number],
      symbol: suits[suit]
    };
    cards.push(card);
  }
}

gameOver();

/********************************/
/****** game logic *************/

function shuffleDeck(array) {
  // check this logic
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function dealHands() {
  playerHand = [];
  dealerHand = [];
  dealerArea.innerHTML = '';
  playerArea.innerHTML = '';
  dealerHandOutput.textContent = '?';

  for (let card = 0; card < 2; card++) {
    dealerHand.push(cards[cardCount]);
    dealerArea.innerHTML += renderHand(cardCount, card);
    
    if (card === 0) {
      dealerArea.innerHTML +=
        '<div id="card-cover" style="left:100px;"></div>';
    }
    cardCount++;
    playerHand.push(cards[cardCount]);
    playerArea.innerHTML += renderHand(cardCount, card);
    cardCount++;
  }

  let playerHandValue = checkTotalHandValue(playerHand);
  let dealerHandValue = checkTotalHandValue(dealerHand);

  if (playerHandValue === 21 && playerHand.length === 2) {
    handScoreOutput.innerHTML = 'Player Blackjack!!!';
    dealerHandOutput.textContent = dealerHandValue;
    dealerFlip();
    gameOver();
  }
  playerHandOutput.textContent = playerHandValue;
}

function hit() {
  playerHand.push(cards[cardCount]);
  playerArea.innerHTML += renderHand(cardCount, playerHand.length - 1);
  cardCount++;

  let playerHandValue = checkTotalHandValue(playerHand);
  let dealerHandValue = checkTotalHandValue(dealerHand);

  playerHandOutput.textContent = playerHandValue;

  if (playerHandValue > 21) {
    handScoreOutput.textContent = 'Busted! You got greedy, pilgrim...';
    dealerHandOutput.textContent = dealerHandValue;
    dealerFlip();
    gameOver();
  } else if (playerHandValue === 21) {
    handScoreOutput.innerHTML = 'Player Blackjack!!!';
    dealerHandOutput.textContent = dealerHandValue;
    dealerFlip();
    gameOver();
  }
}

function stand() {
  dealerFlip();
  gameOver();
  let dealerHandValue = checkTotalHandValue(dealerHand);
  let playerHandValue = checkTotalHandValue(playerHand);

  dealerHandOutput.textContent = dealerHandValue;

  while (dealerHandValue < 19) {
    dealerHand.push(cards[cardCount]);
    dealerArea.innerHTML += renderHand(cardCount, dealerHand.length - 1);
    cardCount++;
    dealerHandValue = checkTotalHandValue(dealerHand);
    dealerHandOutput.textContent = dealerHandValue;
  }

  if (playerHandValue === 21) {
    handScoreOutput.textContent = 'Player Blackjack!!!';
  } else if (dealerHandValue === 21) {
    handScoreOutput.textContent =
      'Dealer Blackjack! House ALWAYS wins in the end, YEEEEEEHAAAAWWWW!!!';
  } else if (
    (playerHandValue < 22 && playerHandValue > dealerHandValue) ||
    (dealerHandValue > 21 && playerHandValue < 22)
  ) {
    handScoreOutput.textContent = 'Player wins!';
  } else if (playerHandValue === dealerHandValue) {
    handScoreOutput.textContent = 'Push!';
  } else {
    handScoreOutput.textContent = 'Dealer wins!';
  }
  playerHandOutput.textContent = playerHandValue;
}

/********************************/
/********** game state *********/

function init() {
  gameActive();
  shuffleDeck(cards);
  dealHands();
}

function gameActive() {
  handScoreOutput.textContent = '';
  document.getElementById('init').disabled = true;
  document.getElementById('hit').disabled = false;
  document.getElementById('stand').disabled = false;
}

function gameOver() {
  document.getElementById('init').disabled = false;
  document.getElementById('hit').disabled = true;
  document.getElementById('stand').disabled = true;
}

function dealerFlip() {
  document.getElementById('card-cover').style.display = 'none';
}

/********************************/
/********** card render ********/

function renderHand(n, card) {
  /* let cardPosition = card > 0 ? card * 60 + 100 : 100; */
  let cardPosition = card > 0 ? card * 60 + 100 : 100;
  return (
    '<div class="icard ' +
    cards[n].symbol +
    '" style="left:' +
    cardPosition +
    'px;"><div class="top-card suit">' +
    cards[n].number +
    '<br></div><div class="content-card suit"></div><div class="bottom-card suit">' +
    cards[n].number +
    '<br></div></div>'
  );
}

/**********************************/
/******* calc hand value *********/

function checkTotalHandValue(array) {
  let handValue = 0;
  let aceAdjust = false;

  for (let card in array) {
    if (array[card].number === 'A' && !aceAdjust) {
      aceAdjust = true;
      handValue = handValue + 10;
    }
    handValue = handValue + array[card].value;
  }

  if (aceAdjust && handValue > 21) {
    handValue = handValue - 10;
  }
  return handValue;
}












