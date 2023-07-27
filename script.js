'use strict';

//Selecting elements

const p0ScoreEl = document.querySelector('#score--0');
const p0ContentStyle = document.querySelector('.player--0');
const current0El = document.getElementById('current--0');

const p1ScoreEl = document.getElementById('score--1');
const p1ContentStyle = document.querySelector('.player--1');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');
const rollBtn = document.querySelector('.btn--roll');
const newGameBtn = document.querySelector('.btn--new');
const holdBtn = document.querySelector('.btn--hold');

const system = document.querySelector('.announcement');

// reset scores to 0
const resetScores = function () {
  p0ScoreEl.textContent = 0;
  p1ScoreEl.textContent = 0;
};

/* Declaring Variables (the isPlaying is set to true because in the beginning of the game is playing ) */

let scores, currentScore, activePlayer, isPlaying, isRoll;

// New game functionality

const initialization = function () {
  // Hide dice at beginning of game
  diceEl.classList.add('hidden');

  // Assigning value
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  isPlaying = true;
  isRoll = false;

  //reset player's scores -> set to zero
  resetScores();
  current0El.textContent = 0;
  current1El.textContent = 0;

  p0ContentStyle.classList.remove('player--winner');
  p1ContentStyle.classList.remove('player--winner');

  // set first player to be active player
  p0ContentStyle.classList.add('player--active');
  p1ContentStyle.classList.remove('player--active');
};

// Function Switch Player

const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;

  activePlayer = activePlayer === 0 ? 1 : 0;
  // reset currentScore
  currentScore = 0;
  // add css style when switching player

  p0ContentStyle.classList.toggle('player--active');
  p1ContentStyle.classList.toggle('player--active');

  // when switched to another player
  isRoll = false;
};

initialization();

// Rolling dice functionality

rollBtn.addEventListener('click', function () {
  isRoll = true;
  // Isplaying ?
  if (isPlaying && isRoll) {
    system.classList.remove('smooth');
    //1 . Generating a random dice roll
    let dice = Math.trunc(Math.random() * 6) + 1;

    //2. Display dice images
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;

    // add boxShadow to dice img if dice is 1
    if (dice === 1) {
      diceEl.style.boxShadow = '0 0 50px 15px red';
    } else {
      diceEl.style.boxShadow = 'none';
    }

    //3. Check for rolled 1: if true
    if (dice !== 1) {
      // dice sound effect
      const diceSound = new Audio('soundEffects/dice_roll.mp3');
      diceSound.play();

      // Add dice roll to current score
      currentScore += dice;

      // Temporary: display score to player 1 👇
      // p1CurrentScore.textContent = currentScore;

      // Display the current score to active player
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      // add music when user got 1
      const wrongtAnswer = new Audio('soundEffects/wrong-answer.mp3');
      wrongtAnswer.play();
      switchPlayer();
    }
  }
});

// Hold button functionality -> accumulate current score to active player's score

holdBtn.addEventListener('click', function () {
  if (isRoll) {
    if (isPlaying) {
      // 1. add current score to active player's  score
      scores[activePlayer] += currentScore;
      document.getElementById(`score--${activePlayer}`).textContent =
        scores[activePlayer];

      // 2. Check if player's score is >= 100
      if (scores[activePlayer] >= 100) {
        isPlaying = false;

        // Finish game
        document
          .querySelector(`.player--${activePlayer}`)
          .classList.add('player--winner');

        document
          .querySelector(`.player--${activePlayer}`)
          .classList.remove('player--active');

        // winner sound effect
        const winner = new Audio('soundEffects/won.mp3');
        winner.play();

        // hide dice
        diceEl.classList.add('hidden');

        // disable roll and hold ❌
        // rollBtn.disabled = true;
        // holdBtn.disabled = true;
      } else {
        //3. Switch to the next player
        switchPlayer();

        // added score sound effect
        const addedScore = new Audio('soundEffects/score-added.mp3');
        addedScore.play();
      }
    }
  } else {
    const announcer = new Audio('soundEffects/system.mp3');
    announcer.play();
    system.classList.add('smooth');
  }
});

newGameBtn.addEventListener('click', initialization);

// Modal

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closeBtn = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const hideModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++) {
  btnsOpenModal[i].addEventListener('click', openModal);
  closeBtn.addEventListener('click', hideModal);
  overlay.addEventListener('click', hideModal);
}

document.addEventListener('keydown', function (e) {
  if (e['key'] === 'Escape' && !modal.classList.contains('hidden')) hideModal();
});
