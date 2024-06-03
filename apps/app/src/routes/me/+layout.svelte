<script>
	import { goto } from '$app/navigation';
</script>

<div class="fixed top-0 bottom-0 left-0 w-screen h-screen p-0 m-">
	<slot />
</div>

<nav class="fixed bottom-0 left-0 right-0 flex justify-center mx-auto shadow-md">
	<div class="w-full max-w-6xl pb-1.5 bg-blue-950 rounded-t-3xl sm:p-0.5">
		<div class="inline-flex items-center justify-start w-full p-3 px-5 space-x-4">
			<button on:click={() => goto('/me')}>
				<img src="/logo.png" alt="Logo" class="h-10 border-white rounded-full" />
			</button>
			<button
				on:click={() => goto('/me/countries')}
				type="button"
				class="btn variant-filled-secondary"
			>
				Countries
			</button>
			<button on:click={() => goto('/me/edit')} type="button" class="btn variant-filled-secondary">
				Edit
			</button>
			<button on:click={() => goto('/me/coda')} type="button" class="btn variant-filled-secondary">
				Coda
			</button>
			<button on:click={() => goto('/me/slube')} type="button" class="btn variant-filled-secondary">
				Slube
			</button>
		</div>
	</div>
</nav>
