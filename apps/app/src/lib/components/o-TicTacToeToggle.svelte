<script lang="ts">
	import { onMount } from 'svelte';

	let board = Array(9).fill('');
	let currentPlayer = 'X';
	let winner = null;
	let gameMode = 'dark';

	function handleClick(index: number) {
		if (board[index] === '' && winner === null) {
			board[index] = currentPlayer;
			currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
			checkWinner();
			if (!winner && currentPlayer === 'O') {
				setTimeout(computerMove, 500);
			}
		}
	}

	function computerMove() {
		const bestMove = findBestMove(board);
		if (bestMove !== -1) {
			board[bestMove] = 'O';
			currentPlayer = 'X';
			checkWinner();
		}
	}

	function findBestMove(board: string[]): number {
		// Try to win
		const winningMove = findWinningMove(board, 'O');
		if (winningMove !== -1) return winningMove;

		// Block player from winning
		const blockingMove = findWinningMove(board, 'X');
		if (blockingMove !== -1) return blockingMove;

		// Take center if available
		if (board[4] === '') return 4;

		// Take a corner
		const corners = [0, 2, 6, 8];
		for (let corner of corners) {
			if (board[corner] === '') return corner;
		}

		// Take any available space
		for (let i = 0; i < 9; i++) {
			if (board[i] === '') return i;
		}

		return -1; // No move available
	}

	function findWinningMove(board: string[], player: string): number {
		const winningCombos = [
			[0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
			[0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
			[0, 4, 8], [2, 4, 6] // Diagonals
		];

		for (let combo of winningCombos) {
			const [a, b, c] = combo;
			if (board[a] === player && board[b] === player && board[c] === '') return c;
			if (board[a] === player && board[c] === player && board[b] === '') return b;
			if (board[b] === player && board[c] === player && board[a] === '') return a;
		}

		return -1; // No winning move found
	}

	function checkWinner() {
		const winningCombos = [
			[0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
			[0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
			[0, 4, 8], [2, 4, 6] // Diagonals
		];

		for (let combo of winningCombos) {
			const [a, b, c] = combo;
			if (board[a] && board[a] === board[b] && board[a] === board[c]) {
				winner = board[a] === 'X' ? 'You win!' : 'CPU wins!';
				return;
			}
		}

		if (!board.includes('')) {
			winner = "It's a tie!";
		}
	}

	function resetGame() {
		board = Array(9).fill('');
		currentPlayer = 'X';
		winner = null;
	}

	function toggleGameMode() {
		gameMode = gameMode === 'dark' ? 'light' : 'dark';
	}

	onMount(() => {
		// Any initialization code can go here
	});
</script>

<div class={`flex items-center justify-center w-full h-full ${gameMode === 'dark' ? 'bg-navy-900' : 'bg-gray-100'}`}>
	<div class="flex flex-col items-center font-sans game-container">
		<div class="flex justify-between w-full mb-4">
			<h2 class={`text-2xl font-bold ${gameMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
				Tic Tac Toe
			</h2>
			<div>
				<button
					on:click={resetGame}
					class="px-3 py-1 mr-2 text-sm text-gray-300 bg-gray-700 rounded-full">Reset</button
				>
				<button
					on:click={toggleGameMode}
					class="px-3 py-1 text-sm text-gray-300 bg-gray-700 rounded-full"
				>
					{gameMode === 'dark' ? '🌙' : '☀️'}
				</button>
			</div>
		</div>
		<div class="grid grid-cols-3 gap-2 board">
			{#each board as cell, index}
				<button
					on:click={() => handleClick(index)}
					disabled={cell !== '' || winner !== null}
					class={`w-24 h-24 text-4xl font-bold rounded-lg ${
						gameMode === 'dark' ? 'bg-navy-800 border-gray-600' : 'bg-white border-gray-300'
					} border-2 flex items-center justify-center transition-all duration-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
				>
					{#if cell === 'X'}
						<span class="text-green-400">X</span>
					{:else if cell === 'O'}
						<span class="text-red-400">O</span>
					{/if}
				</button>
			{/each}
		</div>
		{#if winner}
			<div
				class={`p-4 mt-4 text-xl font-bold rounded-lg ${
					gameMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
				}`}
			>
				{winner}
			</div>
		{/if}
	</div>
</div>