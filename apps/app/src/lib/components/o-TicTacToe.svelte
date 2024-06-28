<script>
  let board = Array(9).fill('');
  let currentPlayer = 'X';
  let winner = null;

  function handleClick(index) {
    if (board[index] === '' && winner === null) {
      board[index] = currentPlayer;
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      checkWinner();
    }
  }

  function checkWinner() {
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        winner = board[a];
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

<div class="w-full h-full flex justify-center items-center">
  <div class="game-container flex flex-col items-center font-sans">
    <h2 class="text-2xl mb-4">Tic Tac Toe</h2>
    {#if winner}
      <div class="result-message bg-primary-500 text-white text-6xl p-8 rounded-lg">
        {winner === 'tie' ? 'It\'s a tie!' : `${winner} wins!`}
      </div>
    {:else}
      <div class="board grid grid-cols-3 gap-2">
        {#each board as cell, index}
          <button
            on:click={() => handleClick(index)}
            disabled={cell !== '' || winner !== null}
            class="cell w-28 h-28 bg-gray-200 text-4xl flex items-center justify-center rounded-lg text-surface-800"
          >
            {cell}
          </button>
        {/each}
      </div>
    {/if}
    <button
      on:click={resetGame}
      class="reset-button bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4"
    >
      Reset Game
    </button>
  </div>
</div>