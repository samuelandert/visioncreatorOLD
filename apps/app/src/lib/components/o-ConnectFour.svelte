<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	let board: number[][] = Array(6)
		.fill(null)
		.map(() => Array(7).fill(0));
	let currentPlayer = 1;
	let winner: number | null = null;
	let player1Name = '';
	let player2Name = '';
	let player1Color = '';
	let player2Color = '';
	let gameStarted = false;
	let setupStep = 1;
	let winningCells: [number, number][] = [];

	const colors = [
		'bg-red-500',
		'bg-blue-500',
		'bg-green-500',
		'bg-yellow-500',
		'bg-purple-500',
		'bg-pink-500',
		'bg-indigo-500',
		'bg-teal-500',
		'bg-orange-500',
		'bg-cyan-500'
	];

	function nextStep() {
		if (setupStep === 1 && player1Name) {
			setupStep = 2;
		} else if (setupStep === 2 && player1Color) {
			setupStep = 3;
		} else if (setupStep === 3 && player2Name) {
			setupStep = 4;
		} else if (setupStep === 4 && player2Color) {
			startGame();
		}
	}

	function startGame() {
		if (player1Name && player2Name && player1Color && player2Color) {
			gameStarted = true;
		}
	}

	function dropPiece(col: number) {
		if (winner) return;

		for (let row = 5; row >= 0; row--) {
			if (board[row][col] === 0) {
				board[row][col] = currentPlayer;
				checkWin(row, col);
				currentPlayer = currentPlayer === 1 ? 2 : 1;
				board = board;
				break;
			}
		}
	}

	function checkWin(row: number, col: number) {
		const directions = [
			[0, 1],
			[1, 0],
			[1, 1],
			[1, -1]
		];

		for (const [dx, dy] of directions) {
			let count = 1;
			let cells: [number, number][] = [[row, col]];
			cells.push(...countDirection(row, col, dx, dy));
			cells.push(...countDirection(row, col, -dx, -dy));

			if (cells.length >= 4) {
				winner = currentPlayer;
				winningCells = cells;
				dispatch('gameOver', { winner });
				return;
			}
		}
	}

	function countDirection(row: number, col: number, dx: number, dy: number): [number, number][] {
		let cells: [number, number][] = [];
		let r = row + dx;
		let c = col + dy;

		while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === currentPlayer) {
			cells.push([r, c]);
			r += dx;
			c += dy;
		}

		return cells;
	}

	function resetGame() {
		board = Array(6)
			.fill(null)
			.map(() => Array(7).fill(0));
		currentPlayer = 1;
		winner = null;
		gameStarted = false;
		setupStep = 1;
		player1Name = '';
		player2Name = '';
		player1Color = '';
		player2Color = '';
		winningCells = [];
	}

	function isWinningCell(row: number, col: number): boolean {
		return winningCells.some(([r, c]) => r === row && c === col);
	}
</script>

<div class="@container">
	<div class="flex flex-col items-center space-y-4">
		<h2 class="h2">Connect Four</h2>
		{#if !gameStarted}
			{#if setupStep === 1}
				<div class="flex flex-col space-y-2" transition:fade>
					<input class="input" bind:value={player1Name} placeholder="Player 1 Name" />
					<button class="btn variant-filled-primary" on:click={nextStep} disabled={!player1Name}>
						Next
					</button>
				</div>
			{:else if setupStep === 2}
				<div class="flex flex-col space-y-2" transition:fade>
					<p>Choose a color for {player1Name}:</p>
					<div class="grid grid-cols-5 gap-2">
						{#each colors as color}
							<button
								class="w-8 h-8 rounded-full {color} {player1Color === color
									? 'ring-4 ring-offset-2'
									: ''}"
								on:click={() => (player1Color = color)}
							/>
						{/each}
					</div>
					<button class="btn variant-filled-primary" on:click={nextStep} disabled={!player1Color}>
						Next
					</button>
				</div>
			{:else if setupStep === 3}
				<div class="flex flex-col space-y-2" transition:fade>
					<input class="input" bind:value={player2Name} placeholder="Player 2 Name" />
					<button class="btn variant-filled-primary" on:click={nextStep} disabled={!player2Name}>
						Next
					</button>
				</div>
			{:else if setupStep === 4}
				<div class="flex flex-col space-y-2" transition:fade>
					<p>Choose a color for {player2Name}:</p>
					<div class="grid grid-cols-5 gap-2">
						{#each colors.filter((c) => c !== player1Color) as color}
							<button
								class="w-8 h-8 rounded-full {color} {player2Color === color
									? 'ring-4 ring-offset-2'
									: ''}"
								on:click={() => (player2Color = color)}
							/>
						{/each}
					</div>
					<button class="btn variant-filled-primary" on:click={nextStep} disabled={!player2Color}>
						Start Game
					</button>
				</div>
			{/if}
		{:else}
			<div class="grid grid-cols-7 gap-2 p-4 bg-surface-200-700-token rounded-container-token">
				{#each board as row, rowIndex}
					{#each row as cell, colIndex}
						<button
							class="w-12 h-12 @sm:w-16 @sm:h-16 rounded-full {cell === 0
								? 'bg-surface-300-600-token'
								: cell === 1
								? player1Color
								: player2Color} {isWinningCell(rowIndex, colIndex)
								? 'ring-4 ring-warning-500'
								: ''}"
							on:click={() => dropPiece(colIndex)}
							disabled={cell !== 0 || winner !== null}
						/>
					{/each}
				{/each}
			</div>
			{#if winner}
				<p class="text-4xl font-bold text-center">
					{winner === 1 ? player1Name : player2Name} wins!
				</p>
			{:else}
				<p class="text-xl">Current Player: {currentPlayer === 1 ? player1Name : player2Name}</p>
			{/if}
			<button class="btn variant-filled-primary" on:click={resetGame}>Reset Game</button>
		{/if}
	</div>
</div>
