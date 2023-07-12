// Define variables
const board = document.getElementById('board');
const turn = document.getElementById('turn');
const cells = document.getElementsByClassName('cell');
const resetButton = document.getElementById('reset');
const xScoreDisplay = document.getElementById('playerXScore');
const oScoreDisplay = document.getElementById('playerOScore');
let currentPlayer = 'X';
let isGameOver = false;
let xScore = 0;
let oScore = 0;

// Add event listeners
board.addEventListener('click', handleCellClick);
resetButton.addEventListener('click', resetGame);

// Function to handle cell click
function handleCellClick(event) {
  const cell = event.target;

  // Check if the cell is empty and the game is not over
  if (!cell.textContent && !isGameOver) {
    cell.textContent = currentPlayer;
    cell.style.color = "red";
    turn.textContent = "Player O turn"


    // Check for a winning move
    if (checkForWin(getState())) {
      isGameOver = true;
      alert(`Player X wins!`);
      turn.textContent = `Player X won!`;
      xScore++;
      xScoreDisplay.textContent = `X Score: ${xScore}`;
    } else if (checkForDraw(getState())) {
      isGameOver = true;
      alert('The game is a draw!');
      turn.textContent = "Draw";
    }

    //console.log(getState());

    // Switch players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    //AI makes a move:
    turn.textContent = "Player O is thinking...";
    setTimeout(() => {
      applyMoveToBoard(alphaBeta(getState(), -Infinity, Infinity, 3, 3, false));
    }, 2000);


  }
}

//Returns the current game state 
function getState() {
  let array = []
  for (let cell of cells) {
    array.push(cell.textContent);
  }

  return array;
}

//Return an array of indices indicating possible moves to take
function generateMoves(state) {
  let moves = [];

  for (let i = 0; i < state.length; i++) {
    if (state[i] === '') {
      moves.push(i);
    }
  }

  return moves;
}

//Return an array of arrays of all possible states from all possible moves
function childrenStates(){
  let moves = generateMoves();
  let children = [];

  for (let move in moves){
    let state = getState();
    state[move] = currentPlayer;
    children.push(state);
  }

  return childrenStates();
}


//Assigns a value to the current state based on how optimal it is
//Higher value: Most optimal for player X
//Lower value: Most optimal for player O
function evaluateState(state) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];
  let X1 = 0;
  let X2 = 0;
  let O1 = 0;
  let O2 = 0;

  //Go through every row, column, and diagonal
  for (let combination of winningCombinations) {
    let numberOfX = 0;
    let numberOfO = 0;
    const [a, b, c] = combination;
    let arrayToRead = [state[a], state[b], state[c]];

    //Count the number of X's and O's in each combination
    for (let element of arrayToRead) {
      if (element === "X") {
        numberOfX += 1;
      } else if (element === "O") {
        numberOfO += 1;
      }
    }

    //Add X1, X2, O1, O2 accordingly
    if (numberOfX === 1 && numberOfO === 0) {
      X1 += 1;
    } else if (numberOfX === 2 && numberOfO === 0) {
      X2 += 1;
    } else if (numberOfX === 0 && numberOfO === 1) {
      O1 += 1;
    } else if (numberOfX === 0 && numberOfO === 2) {
      O2 += 1;
    } else if (numberOfX === 3) {
      return Infinity;
    } else if (numberOfO === 3) {
      return -Infinity;
    }

  }

  return (3 * X2) + X1 - ((3 * O2) + O1);
}

// Function to check for a winning move
function checkForWin(state) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return true;
    }
  }

  return false;
}

// Function to check for a draw
function checkForDraw(state) {
  for (let cell of state) {
    if (cell === '') {
      return false;
    }
  }

  return true;
}

// Check if game is win or tie
function checkGameOver(state) {
  return checkForWin(state) || checkForDraw(state);
}

// Function to reset the game
function resetGame() {
  currentPlayer = 'X';
  isGameOver = false;
  turn.textContent = "Player X turn"

  for (let cell of cells) {
    cell.textContent = '';
  }
}

function applyMoveCloning(state, move, player) {
  let stateCopy = JSON.parse(JSON.stringify(state));
  if (stateCopy[move] === '') {
    stateCopy[move] = player;
  }
  return stateCopy;
}

//AI can make moves to the board
function applyMoveToBoard(move) {
  let cell = cells[move]
  if (!cell.textContent) {
    cell.style.color = "black";
    turn.textContent = "Player X turn"
    cell.textContent = currentPlayer;
  }

  if (checkForWin(getState())) {
    isGameOver = true;
    alert(`Player O wins!`);
    turn.textContent = `Player O won!`;
    oScore++;
    oScoreDisplay.textContent = `O Score: ${oScore}`;
  } else if (checkForDraw(getState())) {
    isGameOver = true;
    alert('The game is a draw!');
    turn.textContent = "Draw";
  }

  // Switch players
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

}


function alphaBeta(state, alpha, beta, initialDepth, currentDepth, maximizingPlayer) {
  //Return the state's value when depth is 0 or state is terminal
  if (currentDepth === 0 || checkGameOver(state)) {
    return evaluateState(state);
  }

  if (maximizingPlayer) {
    let bestValue = -Infinity;
    let bestMove;

    for (let move of generateMoves(state)) {
      let childState = applyMoveCloning(state, move, "X");
      let value = alphaBeta(childState, alpha, beta, initialDepth, currentDepth - 1, false);
      alpha = Math.max(alpha, value);

      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }

      //Beta Pruning
      if (value >= beta) {
        break;
      }
    }

    if (currentDepth == initialDepth) {
      return bestMove
    } else {
      return bestValue
    }

  } else {
    let bestValue = Infinity;
    let bestMove;

    for (let move of generateMoves(state)) {
      let childState = applyMoveCloning(state, move, "O");
      let value = alphaBeta(childState, alpha, beta, initialDepth, currentDepth - 1, true);
      beta = Math.min(beta, value);

      if (value < bestValue) {
        bestValue = value;
        bestMove = move;
      }

      //Alpha Pruning
      if (value <= alpha) {
        break;
      }
    }

    if (currentDepth == initialDepth) {
      return bestMove
    } else {
      return bestValue
    }
  }


// Reset the game initially
resetGame();
