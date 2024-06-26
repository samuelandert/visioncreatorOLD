<script lang="ts">
  function sayHello() {
    alert('hello');
  }
</script>

<button class="px-4 py-2 bg-blue-500 text-white rounded" on:click={sayHello}>
  Click me!
</button>