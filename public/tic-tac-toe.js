// Your code here
window.addEventListener('DOMContentLoaded', () => {

    // create container -- wraps around the entire elements in body
    const container = document.createElement('div');
    container.classList.add('container');

    // Create a game board
    const gameBoard = document.createElement('div');
    gameBoard.id = 'game-board-id';
    gameBoard.classList.add('game-board-container');

    // add to the body
    container.appendChild(gameBoard);

    // add a div with the buttons
    const gameButtons = document.createElement('div');
    gameButtons.id = 'game-buttons-id';
    gameButtons.classList.add('game-buttons-container');

    // add new game button
    const newGameBtn = document.createElement('button');
    newGameBtn.id = 'new-game-btn-id';
    newGameBtn.classList.add('game-btn', 'new-game-btn');
    newGameBtn.textContent = 'New Game';

    // disable by default
    newGameBtn.disabled = true;

    // add to game button container
    gameButtons.appendChild(newGameBtn);

    // add give up button
    const giveUpBtn = document.createElement('button');
    giveUpBtn.id = 'give-up-btn-id';
    giveUpBtn.classList.add('game-btn', 'give-up-btn');
    giveUpBtn.textContent = 'Give Up';

    // add to game button container
    gameButtons.appendChild(giveUpBtn);

    // add to body
    container.appendChild(gameButtons);

    // heading to display the winner
    const heading = document.createElement('div');
    heading.id = 'heading-id';
    heading.classList.add('heading-container');

    // let's add a h1 header
    const h1 = document.createElement('h1');
    h1.id = 'h1-id';
    h1.classList.add('winner-h1');
   heading.appendChild(h1);

    // adding heading before the board
    container.insertBefore(heading, gameBoard);

    // add container to the body
    document.body.appendChild(container);

    let currPlayer;
    let computerPlayer;
    let gameBoardState;

    // track if game is over or not
    let gameOver;

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

            // randomly assign computer player
            // Randomly assign X or O to the computer and player
            const isComputerX = Math.random() < 0.5;

            if (isComputerX) {
                currPlayer = 'X';  // Computer is X
                computerPlayer = 'X';
            } else {
                currPlayer = 'O';  // Computer is O
                computerPlayer = 'O';
            }

            // reset game state & player
            gameBoardState = [[null, null, null],[null, null, null],[null, null, null]];

            // currPlayer = 'X';

            // resets the game
            gameOver = false;

            // remove the game winning message
            h1.textContent = '';
        }

        // dynamically set up the board
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {

                let cell = document.createElement('div');
                cell.classList.add('cell');

                // attach to cells
                cell.setAttribute('data-row', row);
                cell.setAttribute('data-col', col);

                // add click event here
                cell.addEventListener('click', handleClicks);

                gameBoard.appendChild(cell);
            }
        }

        // restore game
        restoreGame();

        // If computer is the next player, make its move automatically
        if (currPlayer === computerPlayer && !gameOver) {
            setTimeout(computerPlay, 500);
        }

        // reset the buttons
        newGameBtn.disabled = true;
        giveUpBtn.disabled = gameOver;
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
        cell.style.backgroundImage = `url(https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-${currPlayer.toLowerCase()}.svg)`;

        // check for a winner
        if (checkWin()) {
            h1.textContent = `Winner: You!`;
            gameOver = true;
            newGameBtn.disabled = false;
            giveUpBtn.disabled = true;
        } else if (checkTie()) {
            h1.textContent = `Winner: None`;
            gameOver = true;
            newGameBtn.disabled = false;
            giveUpBtn.disabled = true;
        } else {
            // switch players
            currPlayer = (currPlayer === 'X') ? 'O': 'X';

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
                    cell.style.backgroundImage = `url(https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-${computerPlayer.toLowerCase()}.svg)`;


                    // check if computer won
                    if (checkWin()) {
                        h1.textContent = `Winner: Computer Player!`;
                        gameOver = true;
                        newGameBtn.disabled = false;
                        giveUpBtn.disabled = true;
                    } else if (checkTie()) {
                        h1.textContent = `Winner: None`;
                        gameOver = true;
                        newGameBtn.disabled = false;
                        giveUpBtn.disabled = true;
                    } else {
                        // switch players
                        currPlayer = (currPlayer === 'X') ? 'O': 'X';
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
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (!gameBoardState[row][col]) return false;
            }
        }

        return true;
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
        let winner = (currPlayer === 'X') ? 'O': 'X';

        // set header
        h1.textContent = `Winner: ${winner}`;

        // reset game over boolean
        gameOver = true;

        // save game state
        saveGameState();

        // disable give up btn & enable start game btn
        giveUpBtn.disabled = true;
        newGameBtn.disabled = false;
    });

    // save game after every move to local stoarage
    function saveGameState() {

        // get all relevant info we want to save
        const gameState = {
            "gameBoardState": gameBoardState,
            "currentPlayer": currPlayer,
            "nextPlayer": currPlayer === 'X' ? 'O': 'X',
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
                    let player = gameBoardState[row][col];

                    // set background image based on what was stored
                    cell.style.backgroundImage = `url(https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-${player.toLowerCase()}.svg)`;
                }
            }
        }
    }

    initialize();
});
