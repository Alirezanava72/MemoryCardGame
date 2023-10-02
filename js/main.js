// Constants:
const cards = document.querySelectorAll('.tiles');
const totalCards = 16;
const restartButton = document.getElementById('restartBtn');
const startingMinutes = 1;
const countdownEl = document.getElementById('countdown');
const wining = document.getElementById('wining');
const timesUp = document.getElementById('timesUp');

// Cached elements:
let revealedCount = 0;
let awaitingEndOfMove = false;
let hasNotFlipped = true;
let firstCard, secondCard;
let time = startingMinutes * 60;
let timerStarted = false; // Flag to track if the timer has started
let intervalId;

// Functions and event listeners:

function flipCard() {
    if (awaitingEndOfMove) return;
    if (this === firstCard) return;

    if (!timerStarted) {
        // Start the timer if it hasn't started yet
        timerStarted = true;
        intervalId = setInterval(updateCountdown, 1000);
    }

    this.classList.add('flip');

    if (hasNotFlipped) {
        hasNotFlipped = false;
        firstCard = this;
    } else {
        hasNotFlipped = true;
        secondCard = this;

        if (firstCard.dataset.image === secondCard.dataset.image) {
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
            revealedCount += 2;

            if (revealedCount === totalCards) {
                wining.innerHTML = `YOU WON! Press Restart to play again.`;
            }
        } else {
            awaitingEndOfMove = true;
            setTimeout(() => {
                firstCard.classList.remove('flip');
                secondCard.classList.remove('flip');
                awaitingEndOfMove = false;
            }, 1000);
        }
    }
}

function shuffle() {
    cards.forEach(function(card) {
        const random = Math.floor(Math.random() * 16);
        card.style.order = random;
    });
}

shuffle();

restartButton.addEventListener('click', function() {
    shuffle();
    clearInterval(intervalId);
    intervalId = setInterval(updateCountdown, 1000);
    timesUp.innerText = '';
    wining.innerHTML = '';
    cards.forEach(card => card.classList.remove('flip'));
    cards.forEach(card => card.addEventListener('click', flipCard));
    revealedCount = 0;
    awaitingEndOfMove = false;
    hasNotFlipped = true;
    firstCard = secondCard = null;
    time = startingMinutes * 60;
    timerStarted = false; // Reset the timerStarted flag
});

cards.forEach(card => card.addEventListener('click', flipCard));

function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    countdownEl.innerHTML = `Timer ${minutes}:${seconds}`;

    if (time > 0) {
        time--;
    } else {
        clearInterval(intervalId);
        timesUp.innerText = `YOU LOST! Click Restart to try again.`;
        cards.forEach(card => card.removeEventListener('click', flipCard));
    }

    if (revealedCount === totalCards) {
        clearInterval(intervalId);
        timesUp.innerText = '';
        cards.forEach(card => card.removeEventListener('click', flipCard));
    }
}










