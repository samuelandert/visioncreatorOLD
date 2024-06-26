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

<div class="countdown-container">
  <h2>Countdown: {count}</h2>
  <button on:click={startCountdown} disabled={isRunning}>
    {isRunning ? 'Counting down...' : 'Start Countdown'}
  </button>
  <button on:click={resetCountdown} disabled={!isRunning && count === 10}>
    Reset
  </button>
</div>

<style>
  .countdown-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Arial, sans-serif;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  button {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    margin: 0.5rem;
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
</style>