<script>
	let playerBoard = Array(100).fill(0); // 0: empty, 1: patrol boat, 2: submarine, 3: destroyer, 4: battleship, 5: aircraft carrier, 6: hit, 7: miss
	let computerBoard = Array(100).fill(0);
	let playerShipCounts = { 1: 4, 2: 3, 3: 2, 4: 1, 5: 1 }; // updated ship counts for each type
	let computerShipCounts = { 1: 4, 2: 3, 3: 2, 4: 1, 5: 1 };
	let playerTurn = true;
	let gameOver = false;

	// Randomly place ships on both boards
	function placeShips(board, shipCounts) {
		for (const shipType in shipCounts) {
			const shipCount = shipCounts[shipType];
			const shipLength = parseInt(shipType);
			for (let i = 0; i < shipCount; i++) {
				let orientation = Math.random() < 0.5; // horizontal or vertical
				let startPos = Math.floor(Math.random() * board.length);

				while (!canPlaceShip(board, startPos, shipLength, orientation)) {
					startPos = Math.floor(Math.random() * board.length);
				}

				placeShip(board, startPos, shipLength, orientation, shipType);
			}
		}
	}

	function canPlaceShip(board, startPos, length, horizontal) {
		let endPos = horizontal ? startPos + length : startPos + length * 10;
		if (endPos >= board.length) return false;

		for (let i = startPos; i < endPos; i += horizontal ? 1 : 10) {
			if (board[i] > 0 && board[i] < 6) return false;
			if (horizontal && i % 10 === 9 && i + 1 < endPos) return false;
			if (!horizontal && i + 10 >= board.length) return false;

			// Check surrounding cells (including diagonally)
			const row = Math.floor(i / 10);
			const col = i % 10;
			for (let r = Math.max(0, row - 1); r <= Math.min(9, row + 1); r++) {
				for (let c = Math.max(0, col - 1); c <= Math.min(9, col + 1); c++) {
					if (r === row && c === col) continue; // skip the current cell
					const cellIndex = r * 10 + c;
					if (board[cellIndex] > 0 && board[cellIndex] < 6) return false;
				}
			}
		}

		return true;
	}

	function placeShip(board, startPos, length, horizontal, shipType) {
		for (let i = 0; i < length; i++) {
			board[startPos + (horizontal ? i : i * 10)] = parseInt(shipType);
		}
	}

	function handleCellClick(index) {
		if (!playerTurn || gameOver) return;

		if (computerBoard[index] === 0) {
			computerBoard[index] = 7; // miss
		} else if (computerBoard[index] > 0 && computerBoard[index] < 6) {
			computerBoard[index] = 6; // hit
			computerShipCounts[computerBoard[index]]--;
			markSurroundingCells(computerBoard, index);

			if (isGameOver(computerShipCounts)) {
				gameOver = true;
			}
		}

		playerTurn = false;
		computerMove();
	}

	function markSurroundingCells(board, index) {
		const row = Math.floor(index / 10);
		const col = index % 10;

		for (let r = Math.max(0, row - 1); r <= Math.min(9, row + 1); r++) {
			for (let c = Math.max(0, col - 1); c <= Math.min(9, col + 1); c++) {
				const cellIndex = r * 10 + c;
				if (board[cellIndex] === 0) {
					board[cellIndex] = 7; // mark as miss
				}
			}
		}
	}

	function computerMove() {
		setTimeout(() => {
			let targetIndex;
			do {
				targetIndex = Math.floor(Math.random() * playerBoard.length);
			} while (playerBoard[targetIndex] === 6 || playerBoard[targetIndex] === 7);

			if (playerBoard[targetIndex] === 0) {
				playerBoard[targetIndex] = 7; // miss
			} else if (playerBoard[targetIndex] > 0 && playerBoard[targetIndex] < 6) {
				playerBoard[targetIndex] = 6; // hit
				playerShipCounts[playerBoard[targetIndex]]--;
				markSurroundingCells(playerBoard, targetIndex);

				if (isGameOver(playerShipCounts)) {
					gameOver = true;
				}
			}

			playerTurn = true;
		}, 500);
	}

	function isGameOver(shipCounts) {
		for (const count of Object.values(shipCounts)) {
			if (count > 0) return false;
		}
		return true;
	}

	function startGame() {
		playerBoard = Array(100).fill(0);
		computerBoard = Array(100).fill(0);
		playerShipCounts = { 1: 3, 2: 2, 3: 1, 4: 1 };
		computerShipCounts = { 1: 3, 2: 2, 3: 1, 4: 1 };
		playerTurn = true;
		gameOver = false;

		placeShips(playerBoard, playerShipCounts);
		placeShips(computerBoard, computerShipCounts);
	}

	startGame();
</script>

<div class="flex flex-col items-center justify-center w-full h-full">
	<h2 class="mb-4 text-2xl">Battleships</h2>
	{#if gameOver}
		<div class="p-8 text-6xl text-white rounded-lg result-message bg-primary-500">
			{isGameOver(playerShipCounts) ? 'Computer wins!' : 'You win!'}
		</div>
	{:else}
		<div class="flex justify-center mb-4">
			<div class="mr-4">
				<h3 class="mb-2 text-xl">Your Board</h3>
				<div class="grid grid-cols-10 gap-1 board">
					{#each playerBoard as cell, index}
						<div
							class="flex items-center justify-center w-8 h-8 text-xl bg-gray-200 rounded"
							class:hit={cell === 6}
							class:miss={cell === 7}
							class:patrol-boat={cell === 1}
							class:submarine={cell === 2}
							class:destroyer={cell === 3}
							class:battleship={cell === 4}
							class:aircraft-carrier={cell === 5}
						>
							{cell === 6 ? 'X' : cell === 7 ? 'O' : cell > 0 && cell < 6 ? '⛵' : ''}
						</div>
					{/each}
				</div>
			</div>
			<div>
				<h3 class="mb-2 text-xl">Computer's Board</h3>
				<div class="grid grid-cols-10 gap-1 board">
					{#each computerBoard as cell, index}
						<button
							on:click={() => handleCellClick(index)}
							disabled={cell === 6 || cell === 7 || !playerTurn}
							class="flex items-center justify-center w-8 h-8 text-xl bg-gray-200 rounded"
							class:hit={cell === 6}
							class:miss={cell === 7}
						>
							{cell === 6 ? 'X' : cell === 7 ? 'O' : ''}
						</button>
					{/each}
				</div>
			</div>
		</div>
		<p class="mb-4">
			{playerTurn ? 'Your turn' : "Computer's turn"}
		</p>
	{/if}
	<button
		on:click={startGame}
		class="px-4 py-2 mt-4 text-white bg-green-500 rounded reset-button hover:bg-green-600"
	>
		Start New Game
	</button>
</div>

<style>
	.hit {
		background-color: red;
		color: white;
	}
	.miss {
		background-color: lightgreen;
	}
	.patrol-boat {
		background-color: navy;
		color: white;
	}
	.submarine {
		background-color: darkgreen;
		color: white;
	}
	.destroyer {
		background-color: darkgray;
		color: white;
	}
	.battleship {
		background-color: darkred;
		color: white;
	}
	.aircraft-carrier {
		background-color: darkblue;
		color: white;
	}
</style>
