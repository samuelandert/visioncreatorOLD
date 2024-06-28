<script lang="ts">
	let board = Array(9).fill('');
	let currentPlayer = 'X';
	let winner = null;

	function handleClick(index: number) {
		if (board[index] === '' && winner === null) {
			board[index] = currentPlayer;
			currentPlayer = 'O';
			checkWinner();
			if (!winner) {
				computerMove();
			}
		}
	}

	function computerMove() {
		const emptyIndices = board
			.map((cell, index) => (cell === '' ? index : null))
			.filter((index) => index !== null);
		if (emptyIndices.length > 0) {
			const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
			board[randomIndex] = 'O';
			currentPlayer = 'X';
			checkWinner();
		}
	}

	function checkWinner() {
		const winningCombos = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8], // rows
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8], // columns
			[0, 4, 8],
			[2, 4, 6] // diagonals
		];

		for (let combo of winningCombos) {
			const [a, b, c] = combo;
			if (board[a] && board[a] === board[b] && board[a] === board[c]) {
				winner = board[a] === 'X' ? 'You win' : 'Computer wins';
				return;
			}
		}

		if (!board.includes('')) {
			winner = 'tie';
		}
	}

	function resetGame() {
		board = Array(9).fill('');
		currentPlayer = 'X';
		winner = null;
	}
</script>

<div class="flex items-center justify-center w-full h-full">
	<div class="flex flex-col items-center font-sans game-container">
		<h2 class="mb-4 text-2xl">Tic Tac Toe</h2>
		{#if winner}
			<div class="p-8 text-6xl text-white rounded-lg result-message bg-primary-500">
				{winner === 'tie' ? "It's a tie!" : winner}
			</div>
		{:else}
			<div class="grid grid-cols-3 gap-2 board">
				{#each board as cell, index}
					<button
						on:click={() => handleClick(index)}
						disabled={cell !== '' || winner !== null}
						class="flex items-center justify-center text-4xl bg-gray-200 rounded-lg cell w-28 h-28 text-surface-800"
					>
						{cell}
					</button>
				{/each}
			</div>
		{/if}
		<button
			on:click={resetGame}
			class="px-4 py-2 mt-4 text-white bg-green-500 rounded reset-button hover:bg-green-600"
		>
			Reset Game
		</button>
	</div>
</div>
