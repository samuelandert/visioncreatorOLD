<script>
  let count = 10;
  let intervalId;
  let isRunning = false;

  function startCountdown() {
    if (!isRunning) {
      isRunning = true;
      intervalId = setInterval(() => {
        count -= 1;
        if (count === 0) {
          clearInterval(intervalId);
          isRunning = false;
        }
      }, 1000);
    }
  }

  function resetCountdown() {
    clearInterval(intervalId);
    count = 10;
    isRunning = false;
  }
</script>

<div class="w-full h-full flex justify-center items-center">
  <div class="countdown-container flex flex-col items-center font-sans">
    <h2 class="text-2xl mb-4">Countdown:</h2>
    <div class="text-primary-500 text-9xl mb-8 px-8 py-4">{count}</div>
    <button
      on:click={startCountdown}
      disabled={isRunning}
      class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
    >
      {isRunning ? 'Counting down...' : 'Start Countdown'}
    </button>
    <button
      on:click={resetCountdown}
      disabled={!isRunning && count === 10}
      class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mt-4"
    >
      Reset
    </button>
  </div>
</div>