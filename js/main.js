// require 3 main objects
// Gameboard Module
// GameFlow Module
// Player factory

// Factory function:
const PlayerFactory = (name, mark) => {
  return {name, mark};
}


// Gameboard module:
const Gameboard = (() => {

	let board = [['', '', ''],
                ['', '', ''],
				['', '', '']];
	const gameContainer = document.querySelector('#game-container');

	initializeGame = () => {
		let gameTable = document.createElement('table');
		for (let row = 0; row < board.length; row ++) {
			// initialize row objects
			let currentRow = document.createElement('tr');
			for (let column = 0; column < board[row].length; column ++) {
				let currentCell = document.createElement('td');
				currentCell.addEventListener('click', (e) => {
					console.log(`e.target: ${e.target}`);
					if (!e.target.textContent) { // if cell is empty
						// add current players mark
						let mark = DisplayController.getCurrentPlayer().mark;
						e.target.textContent = mark;
						board[row][column] = mark;
						DisplayController.checkForGameEnd(board);
						DisplayController.swapCurrent();
						DisplayController.displayCurrentPlayer();
					}
				});
				currentRow.appendChild(currentCell);
			}
			gameTable.appendChild(currentRow);
		}
		gameContainer.appendChild(gameTable);
		DisplayController.displayCurrentPlayer();
	};

	clearBoard = () => {
		while(gameContainer.firstChild) {
			gameContainer.lastChild.remove();
		}
		board = [['', '', ''],
                ['', '', ''],
				['', '', '']];
	}

	changeBoard = (someBoard) => {
		board = someBoard;
	};

	getBoard = () => board;

	// Invoke to setup gameboard right away
	// initializeGame();
	return {changeBoard, getBoard, initializeGame, clearBoard};
})();

// Gameboard.initializeGame();


// pc = PlayerFactory('pc', 'X');
// npc = PlayerFactory('npc', 'O');
gameboard = Gameboard.getBoard();
// DisplayController module:
// const DisplayController = ((player1, player2, gameboard) => {
const DisplayController = ((gameboard) => {
	let firstPlayer; let secondPlayer; let currentPlayer;
	const startButton = document.querySelector('#start-button');
	const firstInput = document.querySelector('#first-input');
	const secondInput = document.querySelector('#second-input');
	const resultContainer = document.querySelector('#result-container');
	const playerDisplay = document.querySelector('#player-current');
	const winnerDisplay = document.createElement('p');
	const restartButton = document.createElement('button');

	document.addEventListener('keyup', (e) => {
		if (firstInput.value && secondInput.value) {
			startButton.disabled = false;
		} else {
			startButton.disabled = true;
		}
	});

	startButton.addEventListener('click', (e) =>{
		firstPlayer = PlayerFactory(firstInput.value, 'X');
		secondPlayer = PlayerFactory(secondInput.value, 'O');
		currentPlayer = firstPlayer;

		const playerForms = document.querySelector('#player-forms');
		playerForms.remove();
		Gameboard.initializeGame();
	});

	displayCurrentPlayer = () => {
		let output = `Current player is: ${currentPlayer.name}`;
		playerDisplay.textContent = output;
	}
	
	swapCurrent = () => {
		currentPlayer = currentPlayer === firstPlayer ? secondPlayer : firstPlayer;
	};

	getCurrentPlayer = () => {
		return currentPlayer;
	}

	restartGame = (e) => {
		Gameboard.clearBoard();
		winnerDisplay.remove();
		currentPlayer = firstPlayer;
		displayCurrentPlayer();
		Gameboard.initializeGame();
		e.target.remove();
	}

	endgameBusywork = (string) => {
		let win;
		if (string === "win") {
			win = `${currentPlayer.name} won!`;
		} else {
			win = "It's a tie...";
		}
		winnerDisplay.textContent = win;
		resultContainer.appendChild(winnerDisplay);
		restartButton.addEventListener('click', restartGame);
		restartButton.textContent = "Restart";
		resultContainer.appendChild(restartButton);
	}

	checkForGameEnd = (board) => {
		// possible wins are:
		// three in any row of same mark
		// three in any column of same mark
		// three diagonal from topleft to bottom right
		// three diagona from bottom left to top right
		if (checkRows(board) || checkColumns(board) || checkDiagonal(board)) {
			endgameBusywork("win");
		} else if (checkTie(board)) {
			endgameBusywork("tie");
		}
	};

	// the following three functions are very repetitive. Not exactly DRY. when time permits, consolidate
	checkRows = (board) => {
		if (board[0][0] === board[0][1] && board[0][1] === board[0][2] && board[0][0] !== '') {
			return true;
		} else if (board[1][0] === board[1][1] && board[1][1] === board[1][2] && board[1][0] !== '') {
			return true;
		} else if (board[2][0] === board[2][1] && board[2][1] === board[2][2] && board[2][0] !== '') {
			return true;
		}
		return false;
	};

	checkColumns = (board) => {
		if (board[0][0] === board[1][0] && board[1][0] === board[2][0] && board[0][0] !== '') {
			return true;
		} else if (board[0][1] === board[1][1] && board[1][1] === board[2][1] && board[0][1] !== '') {
			return true;
		} else if (board[0][2] === board[1][2] && board[1][2] === board[2][2] && board[0][2] !== '') {
			return true;
		}
		return false;
	};

	checkDiagonal = (board) => {
		if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
			return true;
		} else if (board[2][0] === board[1][1] && board[1][1] === board[0][2] && board[2][0] !== '') {
			return true;
		}
		return false;
	};

	checkTie = (board) => {
		for (let row = 0; row < board.length; row++) {
			for (let column = 0; column < board[row].length; column ++) {
				if (!board[row][column]) {
					return false;
				}
			}
		}
		return true;
	};
	

	return {getCurrentPlayer, swapCurrent, checkForGameEnd, displayCurrentPlayer};
// })(pc, npc, gameboard);
})(gameboard);

