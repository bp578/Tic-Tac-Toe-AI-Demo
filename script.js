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

    // Switch players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
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
