const startButton = document.getElementById('start-btn');
const cardContainer = document.getElementById('card-container');
const moveCountElem = document.getElementById('move-count');
const matchCountElem = document.getElementById('match-count');

let cards = [];
let flippedCards = [];
let matchCount = 0;
let moveCount = 0;
let gameStarted = false;

// List of card values (can add more to increase difficulty)
const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// Get the stored high score from localStorage (if any)
let highScore = localStorage.getItem('highScore') ? localStorage.getItem('highScore') : 0;
const highScoreElem = document.createElement('div');
highScoreElem.classList.add('high-score');
highScoreElem.textContent = `High Score: ${highScore}`;

document.body.appendChild(highScoreElem); // Append high score to the page

// Function to initialize the game
function initializeGame() {
    gameStarted = true;
    moveCount = 0;
    matchCount = 0;
    flippedCards = [];
    cards = [...cardValues, ...cardValues];  // Duplicate to create pairs
    shuffle(cards);  // Shuffle the cards
    updateScore();

    // Clear the card container
    cardContainer.innerHTML = '';

    // Create and display the cards
    cards.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;

        // Create a div for the card text (value)
        const cardText = document.createElement('div');
        cardText.classList.add('card-text');
        cardText.textContent = value;  // Set the value as text

        card.appendChild(cardText);

        card.addEventListener('click', () => flipCard(card));

        cardContainer.appendChild(card);
    });

    // Remove any previous result message
    const existingResultMessage = document.querySelector('.result-message');
    if (existingResultMessage) {
        existingResultMessage.remove();
    }
}

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

// Function to handle card flipping
function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

// Function to check if two flipped cards match
function checkMatch() {
    moveCount++;
    updateScore();

    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchCount++;
        flippedCards = [];
        
        // Check if the game is won
        if (matchCount === cardValues.length) {
            showResult();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// Function to update the score
function updateScore() {
    moveCountElem.textContent = moveCount;
    matchCountElem.textContent = matchCount;
}

// Function to show the result when the game is won
function showResult() {
    // Display the result message
    const resultMessage = document.createElement('div');
    resultMessage.classList.add('result-message');
    resultMessage.textContent = `Congratulations! You won the game in ${moveCount} moves.`;
    document.body.appendChild(resultMessage);

    // Check if it's a new high score
    if(highScore=0){
        highScore = moveCount;
        localStorage.setItem('highScore', highScore); // Save the new high score
        highScoreElem.textContent = `New High Score: ${highScore}`;
    }else if (moveCount < highScore) {
        highScore = moveCount;
        localStorage.setItem('highScore', highScore); // Save the new high score
        highScoreElem.textContent = `New High Score: ${highScore}`;
    } else {
        highScoreElem.textContent = `High Score: ${highScore}`;
    }

    // Disable further interactions
    document.querySelectorAll('.card').forEach(card => card.removeEventListener('click', flipCard));
}

// Start the game when the start button is clicked
startButton.addEventListener('click', () => {
        initializeGame();
        startButton.textContent = 'Restart Game';
});
