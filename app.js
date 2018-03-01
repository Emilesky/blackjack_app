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

let deck = [];
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
    // J, Q, K parsed to ints and assign the "weight" of 10
    const value = number > 9 ? 10 : parseInt(number) + 1;
    
    const card = {
      suit: suitCheck,
      suitColour,
      value,
      number: numbers[number],
      symbol: suits[suit]
    };
    deck.push(card);
  }
}

gameOver();

/********************************/
/****** game logic *************/

function shuffleDeck() {
  // for 1000 turns, switch the values two cards in random positions in the deck
  console.log(deck);
  for (let i = 0; i < 1000; i++) {
    let location1 = Math.floor(Math.random() * deck.length);
    let location2 = Math.floor(Math.random() * deck.length);
    let tmp = deck[location1];

    deck[location1] = deck[location2];
    deck[location2] = tmp;
  }
}

function reShuffleDeck() {
  cardCount++;
  if (cardCount > 40) {
    shuffleDeck(deck);
    cardCount = 0;
    handScoreOutput.textContent = 'deck has been re-shuffled';
  }
}

function dealHands() {
  playerHand = [];
  dealerHand = [];
  dealerArea.innerHTML = '';
  playerArea.innerHTML = '';
  dealerHandOutput.textContent = '?';

  for (let card = 0; card < 2; card++) {
    dealerHand.push(deck[cardCount]);
    dealerArea.innerHTML += renderHand(cardCount, card);
    
    if (card === 0) {
      dealerArea.innerHTML +=
        '<div id="card-cover" style="left:100px;"></div>';
    }
    reShuffleDeck();
    playerHand.push(deck[cardCount]);
    playerArea.innerHTML += renderHand(cardCount, card);
    reShuffleDeck();
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
  playerHand.push(deck[cardCount]);
  playerArea.innerHTML += renderHand(cardCount, playerHand.length - 1);
  reShuffleDeck();

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
    dealerHand.push(deck[cardCount]);
    dealerArea.innerHTML += renderHand(cardCount, dealerHand.length - 1);
    reShuffleDeck();
    dealerHandValue = checkTotalHandValue(dealerHand);
    dealerHandOutput.textContent = dealerHandValue;
  }

  if (playerHandValue === 21) {
    handScoreOutput.textContent = 'Player Blackjack!!!';
  } else if (dealerHandValue === 21) {
    handScoreOutput.textContent =
      'Dealer Blackjack! House always wins in the end, YEEEEEEHAAAAWWWW!!!';
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
  shuffleDeck(deck);
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
    deck[n].symbol +
    '" style="left:' +
    cardPosition +
    'px;"><div class="top-card suit">' +
    deck[n].number +
    '<br></div><div class="content-card suit"></div><div class="bottom-card suit">' +
    deck[n].number +
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












