// Your code here
window.addEventListener('DOMContentLoaded', () => {

    // constants
    const PLAYER_X = 'X';
    const PLAYER_O = 'O';
    const NO_WINNER = 'Winner: None';

    // create DOM elements
    const container = createElement('div', {class: 'container'});
    const gameBoard = createElement('div', {id: 'game-board-id', class: 'game-board-container'});
    const gameButtons = createElement('div', {id: 'game-buttons-id', class: 'game-buttons-container'});
    const heading = createElement('div', {id: 'heading-id', class: 'heading-container'});
    const h1 = createElement('h1', {id: 'h1-id', class: 'winner-h1'});

    // add h1 to heading container
    heading.appendChild(h1);

    // add elements to container element
    container.append(heading, gameBoard, gameButtons);

    // add container to body
    document.body.appendChild(container);

    // add new game button & give up btn
    const newGameBtn = createButton('New Game', {id: 'new-game-btn-id', class: ['game-btn', 'new-game-btn']}, true);
    const giveUpBtn = createButton('Give Up', {id: 'give-up-btn-id', class: ['game-btn', 'give-up-btn']});

    // add buttons to game button container
    gameButtons.append(newGameBtn, giveUpBtn);

    // define variables for current player, computer player, game board state, if game over
    let currPlayer, computerPlayer, gameBoardState, gameOver;

    // initialize grid
    function initialize() {

        // clear previous board, game over & disable new game button
        gameBoard.innerHTML = '';

        // get saved game state
        let gameState = JSON.parse(localStorage.getItem('ticTacToeState'));

        if (gameState && !gameState.gameOver) {
            currPlayer = gameState.currentPlayer;
            gameBoardState = gameState.gameBoardState;
            gameOver = gameState.gameOver;
            computerPlayer = gameState.computerPlayer;

        } else {

            // start / restart the game
            startGame();
        }

        // set up the board
        setUpGame();

        // restore game
        restoreGame();

        // reset the buttons
        updateButtonStates();
    }

    // helper function to handle clicks
    function handleClicks(event) {
        // if game has been won, do nothing
        if (gameOver) return;

        const cell = event.target;
        const row = cell.getAttribute('data-row');
        const col = cell.getAttribute('data-col');

        // check if current cell is empty
        if (gameBoardState[row][col]) {
            return
        }

        // update game state
        gameBoardState[row][col] = currPlayer;

        // set background image based on player
        updateCellBackground(cell, currPlayer);

        // check for a winner
        if (checkWin()) {
            endGame(`Winner: You!`);

        } else if (checkTie()) {
            endGame(NO_WINNER);

        } else {
            // switch players
            switchPlayer();

            // If the computer's turn, make its move
            if (currPlayer === computerPlayer && !gameOver) {
                setTimeout(computerPlay, 500);  // Delay to make it feel like it's thinking
            }
        }

        // store game state after every move
        saveGameState();
    }

    function computerPlay() {
        if (gameOver) return;

        // find the first available cell
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {

                if (!gameBoardState[row][col]) {

                    // set cell to computer player
                    gameBoardState[row][col] = computerPlayer;

                    const cell = gameBoard.querySelector(`[data-row='${row}'][data-col='${col}']`);

                    // set background image based on what was stored
                    updateCellBackground(cell, computerPlayer);


                    // check if computer won
                    if (checkWin()) {
                        endGame(`Winner: Computer`);

                    } else if (checkTie()) {
                        endGame(NO_WINNER);

                    } else {
                        // switch players
                        switchPlayer();
                    }

                    // store game state after every move
                    saveGameState();

                    return;
                }
            }
        }

    }

    // helper function to check for a win
    function checkWin() {
        // check rows & cols for win
        for (let row = 0; row < 3; row++) {

            // check rows
            if (gameBoardState[row][0] === gameBoardState[row][1] &&
                gameBoardState[row][1] === gameBoardState[row][2] &&
                gameBoardState[row][0] !== null) {
                return true;
            }

            // check cols
            if (gameBoardState[0][row] === gameBoardState[1][row] &&
                gameBoardState[1][row] === gameBoardState[2][row] &&
                gameBoardState[0][row] !== null) {
                return true;
            }
        }

        // check both diagonals for win
        if (gameBoardState[0][0] === gameBoardState[1][1] &&
            gameBoardState[1][1] === gameBoardState[2][2] &&
            gameBoardState[0][0] !== null) {
            return true;
        }

        if (gameBoardState[2][0] === gameBoardState[1][1] &&
            gameBoardState[1][1] === gameBoardState[0][2] &&
            gameBoardState[2][0] !== null) {
            return true;
        }

        return false;
    }

    // check for a tie
    function checkTie() {
        return gameBoardState.flat().every(cell => cell !== null);
    }

    // helper function to switch players
    function switchPlayer() {
        currPlayer = currPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
    }

    // helper function to handle end of game
    function endGame(message) {
        h1.textContent = message;
        gameOver = true;
        updateButtonStates();
    }

    // save game after every move to local stoarage
    function saveGameState() {

        // get all relevant info we want to save
        const gameState = {
            "gameBoardState": gameBoardState,
            "currentPlayer": currPlayer,
            "gameOver": gameOver,
            "computerPlayer": computerPlayer
        };

        // save to local storage
        localStorage.setItem('ticTacToeState', JSON.stringify(gameState));
    }

    // restore the
    function restoreGame() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = gameBoard.querySelector(`[data-row='${row}'][data-col='${col}']`);

                if (cell && gameBoardState[row][col]) {

                    // set background image based on what was stored
                    updateCellBackground(cell, gameBoardState[row][col]);
                }
            }
        }
    }

    // helper function to set up game
    // dynamically set up the board
    function setUpGame() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {

                const cell = createElement('div', {class: 'cell', 'data-row': row, 'data-col': col});

                // add click event here
                cell.addEventListener('click', handleClicks);
                gameBoard.appendChild(cell);
            }
        }

        // If it's the computer's turn, play automatically
        if (currPlayer === computerPlayer && !gameOver) {
            setTimeout(computerPlay, 500);
        }
    }

    // update the background image
    function updateCellBackground(cell, player) {
        cell.style.backgroundImage = `url(https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-${player.toLowerCase()}.svg)`
    }

    // helper function to update buttons
    function updateButtonStates() {
        newGameBtn.disabled = !gameOver;
        giveUpBtn.disabled = gameOver;
    }

    // helper function to start a new game
    function startGame() {
        // check if we have computer player
        const isComputerX = Math.random() < 0.5;

        // assign computer player authomatically
        currPlayer = isComputerX ? PLAYER_X : PLAYER_O;
        computerPlayer = currPlayer;

        // set or reset the gameBoard State
        gameBoardState = Array.from({ length: 3 }, () => Array(3).fill(null));

        // reset that the game is not over
        gameOver = false;

        // reset message
        h1.textContent = '';
    }

    // helper function to create element
    function createElement(tag, attributes = {}) {

        // create element with the given tag
        const element = document.createElement(tag);

        // process the attributes
        processAttributes(element, attributes);

        return element;
    }

    // helper function to create button
    function createButton(text, attributes = {}, disabled=false) {

        const btn = document.createElement('button');

        // process any attributes of button
        processAttributes(btn, attributes);

        // set other items e,g text, disabled state
        btn.textContent = text;
        btn.disabled = disabled;

        return btn;
    }

    // helper function to process attributes
    function processAttributes(element, attributes = {}) {
        // process the attributes
        Object.entries(attributes).forEach(([key, val]) => {
            if (key === 'class') {
                if (Array.isArray(val)) {
                    element.classList.add(...val);
                } else {
                    element.classList.add(val);
                }

            } else {
                element.setAttribute(key, val);
            }
        });
    }

    // add event listeners for the new game button
    newGameBtn.addEventListener('click', () => {
        // remove game state stored in local storage
        localStorage.removeItem('ticTacToeState');
        initialize();
    });


    // enable give up button
    giveUpBtn.addEventListener('click', () => {

        // get winner
        let winner = (currPlayer === PLAYER_X) ? PLAYER_O: PLAYER_X;

        // reset game over boolean
        gameOver = true;

        // save game state
        saveGameState();

        // update buttons
        endGame(`Winner: ${winner}`);
    });

    initialize();
});
