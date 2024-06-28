<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	interface Person {
		id: string;
		name: string;
		age: number;
		bio: string;
		imageUrl: string;
	}

	const people = writable<Person[]>([]);
	const favorites = writable<Person[]>([]);
	let currentView = writable('dating');

	function generateRandomPerson(): Person {
		const names = [
			'Alice',
			'Bob',
			'Charlie',
			'Diana',
			'Ethan',
			'Fiona',
			'George',
			'Hannah',
			'Ian',
			'Julia'
		];
		return {
			id: Math.random().toString(36).substring(2, 9),
			name: names[Math.floor(Math.random() * names.length)],
			age: Math.floor(Math.random() * 20) + 20,
			bio: `I love ${
				['hiking', 'reading', 'traveling', 'cooking', 'photography'][Math.floor(Math.random() * 5)]
			}!`,
			imageUrl: `/api/placeholder/1080/1920?random=${Math.random().toString(36).substring(2, 9)}`
		};
	}

	onMount(() => {
		people.set(Array.from({ length: 10 }, generateRandomPerson));
	});

	function dislikePerson() {
		people.update((currentPeople) => currentPeople.slice(1));
	}

	function likePerson() {
		people.update((currentPeople) => {
			const [likedPerson, ...rest] = currentPeople;
			favorites.update((currentFavorites) => [...currentFavorites, likedPerson]);
			return rest;
		});
	}
</script>

<div class="flex flex-col w-full h-full bg-gray-100">
	<div class="bg-white shadow">
		<div class="container px-4 mx-auto">
			<div class="flex justify-center">
				<button
					class="px-4 py-2 font-semibold {$currentView === 'dating'
						? 'text-blue-600 border-b-2 border-blue-600'
						: 'text-gray-600'}"
					on:click={() => currentView.set('dating')}
				>
					Dating
				</button>
				<button
					class="px-4 py-2 font-semibold {$currentView === 'favorites'
						? 'text-blue-600 border-b-2 border-blue-600'
						: 'text-gray-600'}"
					on:click={() => currentView.set('favorites')}
				>
					Favorites
				</button>
			</div>
		</div>
	</div>

	<div class="relative flex-grow overflow-hidden">
		{#if $currentView === 'dating'}
			<div class="relative w-full h-full">
				{#if $people.length > 0}
					<img src={$people[0].imageUrl} alt={$people[0].name} class="object-cover w-full h-full" />
					<div class="absolute bottom-0 left-0 right-0">
						<div class="p-4 bg-black bg-opacity-50">
							<h2 class="text-2xl font-semibold text-surface-800">
								{$people[0].name}, {$people[0].age}
							</h2>
							<p class="text-gray-600">{$people[0].bio}</p>
						</div>
						<div class="flex justify-center p-4 bg-black bg-opacity-50">
							<button
								on:click={dislikePerson}
								class="p-4 mx-2 text-white transition duration-300 bg-red-500 rounded-full shadow-lg hover:bg-red-600"
							>
								✖
							</button>
							<button
								on:click={likePerson}
								class="p-4 mx-2 text-white transition duration-300 bg-green-500 rounded-full shadow-lg hover:bg-green-600"
							>
								❤
							</button>
						</div>
					</div>
				{:else}
					<div class="flex items-center justify-center h-full">
						<p class="text-xl text-gray-600">No more people to show!</p>
					</div>
				{/if}
			</div>
		{:else}
			<div class="h-full overflow-y-auto">
				<div class="container px-4 py-8 mx-auto">
					<h2 class="mb-4 text-2xl font-semibold text-surface-800">Your Favorites</h2>
					{#if $favorites.length > 0}
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{#each $favorites as person}
								<div class="relative h-64 overflow-hidden rounded-lg shadow-md">
									<img src={person.imageUrl} alt={person.name} class="object-cover w-full h-full" />
									<div class="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50">
										<h3 class="text-lg font-semibold text-surface-800">
											{person.name}, {person.age}
										</h3>
										<p class="text-gray-600">{person.bio}</p>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<p class="text-gray-600">You haven't liked anyone yet!</p>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
