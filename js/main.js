// constants:

const cards = document.querySelectorAll('.tiles');
const totalCards = 16
const restartButton = document.getElementById('restartBtn');
const startingMinutes = 1;
const countdownEl = document.getElementById('countdown');

// cached elements:

let revealedCount = 0;
let awaitingEndOfMove = false;//to avoid slecting more than 2 cards at the same time
let hasNotFlipped = true;
let firstCard, secondCard;
let time = startingMinutes * 60;
let intervalId = setInterval(updateCountdown, 1000);

// functions and event listeners::

// 2)card flip
// - [ ] After clicking a card, cards’ state should be changed to reveal from face-up
// - [ ] If the matched cards are flipped, cards must remain face-up
// - [ ] If the cards are not matched, cards should be flipped back on the next click
// 3)win and lose conditions:
// - [ ] Player wins when all card pairs have been matched
//done in if (revealedCount === totalCards)
// - [ ] When the timer reaches zero, the game is over

function flipCard() {
    if (awaitingEndOfMove) return;
    if (this === firstCard) return;//to avoid double clicking on one card to stay flipped
    // "this" refers to the element on which the function is being called
    this.classList.add('flip');
    console.log(this);
    if (hasNotFlipped) {
        // hasNotFlipped is set to false to indicate that the first card has been flipped,
        hasNotFlipped = false;
        firstCard = this;
        
    } else {
        // If hasNotFlipped is already false, it means it's the second click
        hasNotFlipped = true;
        secondCard = this;
      
        //cards matching?
        if (firstCard.dataset.image === secondCard.dataset.image) {
            //if the F&S cards are same, we need to disable them with 
            //removing eventListener to avoid re-selected
            
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
            revealedCount +=2

            if (revealedCount === totalCards) {
                wining.innerHTML = `YOU WON!Press Restart to play again.`
            }
            
            //In case the 2 flipped cards are not same, we need to take them back to the original state(unflip the cards)
           //without the "setTimout" we cannot even see the second card if cards don't match as it will unflip the second card immeditaly
           //so we use "setTimout" to give it a bit of delay(1second) that player can see the wrong cards
        } else {
            //waiting for unmatched cards to be unflipped agian using "awaitingEndOfMove"
            awaitingEndOfMove = true;
            setTimeout (() => {
                
                firstCard.classList.remove('flip')
                secondCard.classList.remove('flip')
                // putting back awaitingEndOfMove to false agian to release the board game that player can choose cards
                awaitingEndOfMove = false;   
          }, 1000);
        }
    }
}


// 4)card shuffle
// - [ ] Cards need to be shuffled randomly at the start of the game(wether it’s a new game or after clicking on try again)

//using flexbox property called order to give each card a value and sort them ascending accordingly
function shuffle() {
    cards.forEach(function(cards) {
        const random = Math.floor(Math.random() * 16);
        cards.style.order = random;
    });

};

shuffle();

// 5)Game reset:
// - [ ] “TRY AGAIN!” botton to reset the game, which would involve resetting the game board, shuffling the cards, and resetting timer
restartButton.addEventListener('click', function() {
     shuffle();
     clearInterval(intervalId);
     intervalId = setInterval(updateCountdown, 1000);
     timesUp.innerText = '';
     wining.innerHTML = '';
     cards.forEach(card => card.classList.remove('flip'))
     cards.forEach(cards => cards.addEventListener('click', flipCard));
     revealedCount = 0;
     awaitingEndOfMove = false;
     hasNotFlipped = true;
     firstCard = secondCard = null;
     time = startingMinutes * 60;   
});

cards.forEach(cards => cards.addEventListener('click', flipCard));

// 6)game timer(1mins):
// - [ ] Countdown timer to shows how much longer the player can try to win
 function updateCountdown() {
    const minutes = Math.floor(time/60);
    let seconds = time %60;
   
    seconds = seconds <10 ? '0' + seconds : seconds;

    countdownEl.innerHTML = `Timer ${minutes}:${seconds}`;
    
    
    if(time>0) {
        time--;
    } else {
        clearInterval(intervalId);
        timesUp.innerText = `YOU LOST! Click Restart to try again.`
        // ????// cards.forEach(cards => cards.addEventListener.remove('click', flipCard));
        cards.forEach(card => card.removeEventListener('click', flipCard));
    }    
     
    if (revealedCount === totalCards) {
        clearInterval(intervalId);
        timesUp.innerText = ``;
        cards.forEach(card => card.removeEventListener('click', flipCard));
    }     
}

   











