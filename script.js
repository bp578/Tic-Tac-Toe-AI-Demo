// Define variables
const board = document.getElementById('board');
const turn = document.getElementById('turn');
const cells = document.getElementsByClassName('cell');
const resetButton = document.getElementById('reset');
let currentPlayer = 'X';
let isGameOver = false;

// Add event listeners
board.addEventListener('click', handleCellClick);
resetButton.addEventListener('click', resetGame);

// Function to handle cell click
function handleCellClick(event) {
  const cell = event.target;

  // Check if the cell is empty and the game is not over
  if (!cell.textContent && !isGameOver) {
    cell.textContent = currentPlayer;

    if (currentPlayer == 'X'){
      cell.style.color = "red";
      turn.textContent = "Player O turn"
    } else {
      cell.style.color = "black";
      turn.textContent = "Player X turn"
    }

    // Check for a winning move
    if (checkForWin()) {
      isGameOver = true;
      alert(`Player ${currentPlayer} wins!`);
      turn.textContent = `Player ${currentPlayer} won!`;
    } else if (checkForDraw()) {
      isGameOver = true;
      alert('The game is a draw!');
      turn.textContent = "Draw";
    }

    console.log(getState());

    // Switch players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}

//Returns the current game state 
function getState(){
  let array = []
  for (let cell of cells){
    array.push(cell.textContent);
  }

  return array;
}

//Return an array of indices indicating possible moves to take
function generateMoves(){
  let state = getState();
  let moves = [];

  for(let i = 0; i < state.length; i++){
    if (state[i] === ''){
      moves.push(i);
    }
  }

  return moves;
}



//Assigns a value to the current state based on how optimal it is
//Higher value: Most optimal for player X
//Lower value: Most optimal for player O
function evaluateState(){
  let state = getState();
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
    let arrayToRead = [cells[a].textContent, cells[b].textContent, cells[c].textContent];

    //Count the number of X's and O's in each combination
    for (let element of arrayToRead){
      if (element === "X"){
        numberOfX += 1;
      } else if (element === "O"){
        numberOfO += 1;
      }
    }

    //Add X1, X2, O1, O2 accordingly
    if (numberOfX === 1 && numberOfO === 0){
      X1 += 1;
    } else if (numberOfX === 2 && numberOfO === 0){
      X2 += 1;
    } else if (numberOfX === 0 && numberOfO === 1){
      O1 += 1;
    } else if (numberOfX === 0 && numberOfO === 2){
      O2 += 1;
    }
    
  }

  return (3 * X2) + X1 - ((3 * O2) + O1);
}

// Function to check for a winning move
function checkForWin() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
      return true;
    }
  }

  return false;
}

// Function to check for a draw
function checkForDraw() {
  for (let cell of cells) {
    if (!cell.textContent) {
      return false;
    }
  }

  return true;
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

// Reset the game initially
resetGame();
