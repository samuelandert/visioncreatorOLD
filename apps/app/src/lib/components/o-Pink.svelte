<script lang="ts">
	let board = Array(9).fill('');
	let currentPlayer = 'X';
	let winner = null;

	function handleClick(index: number) {
		if (board[index] === '' && winner === null) {
			board[index] = currentPlayer;
			currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
			checkWinner();
			if (!winner && currentPlayer === 'O') {
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
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6]
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

<div class="flex items-center justify-center w-full h-full bg-pink-500">
	<div class="flex flex-col items-center font-sans game-container">
		<h2 class="mb-4 text-2xl font-bold text-white">Tic Tac Toe</h2>
		<div class="grid grid-cols-3 gap-2 board">
			{#each board as cell, index}
				<button
					on:click={() => handleClick(index)}
					disabled={cell !== '' || winner !== null}
					class="flex items-center justify-center w-24 h-24 text-4xl text-white border-2 border-white rounded-lg cell"
				>
					{#if cell === 'X'}
						<svg class="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					{:else if cell === 'O'}
						<svg class="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/>
							<circle cx="12" cy="12" r="6" stroke="white" stroke-width="2" fill="none"/>
							<circle cx="12" cy="12" r="2" fill="white"/>
						</svg>
					{/if}
				</button>
			{/each}
		</div>
		{#if winner}
			<div class="p-4 mt-4 text-xl font-bold text-pink-500 bg-white rounded-lg">
				{winner === 'tie' ? "It's a tie!" : winner}
			</div>
		{/if}
		<button
			on:click={resetGame}
			class="px-6 py-3 mt-6 text-lg font-bold text-pink-500 bg-white rounded-full reset-button hover:bg-pink-100"
		>
			Reset Game
		</button>
	</div>
</div>