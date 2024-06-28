<script lang="ts">
	import { onMount } from 'svelte';

	let apartments = [];
	let featuredApartment = null;

	const generateData = (count: number) =>
		Array.from({ length: count }, () => ({
			id: Math.random().toString(36).substring(2, 9),
			title: `${getRandomName()} ${getApartmentType()}`,
			description: getApartmentDescription(),
			price: `$${Math.floor(Math.random() * 500) + 100}/night`,
			beds: Math.floor(Math.random() * 4) + 1,
			baths: Math.floor(Math.random() * 3) + 1,
			sqft: Math.floor(Math.random() * 1500) + 500,
			imageUrl: `https://picsum.photos/1080/1920?random=${Math.random()
				.toString(36)
				.substring(2, 9)}`
		}));

	const getRandomName = () => {
		const names = [
			'Serene Meadows',
			'Coastal Breeze',
			'Meadowbrook',
			'Sunset Ridge',
			'Oakwood',
			'Riverview',
			'Hillcrest',
			'Parkside',
			'Willow Glen',
			'Cypress Grove',
			'Serenity Oaks',
			'Tranquil Pines',
			'Stillwater Springs',
			'Sundance Palms',
			'Whispering Cedars',
			'Sycamore Haven',
			'Waterfall Valley',
			'Mariposa Meadows',
			'Serena Shores',
			'Sapphire Cove',
			'Azure Bay',
			'Hidden Cove',
			'Emerald Isle',
			'Seaside Retreat',
			'Ocean Mist'
		];
		return names[Math.floor(Math.random() * names.length)];
	};

	const getApartmentType = () => {
		const types = [
			'Apartment',
			'Condo',
			'Loft',
			'Penthouse',
			'Suite',
			'Flat',
			'Villa',
			'Residence'
		];
		return types[Math.floor(Math.random() * types.length)];
	};

	const getApartmentDescription = () => {
		const descriptions = [
			'Enjoy a luxurious stay in this beautifully furnished apartment with stunning city views.',
			'Relax in this modern and stylish condo, perfect for a comfortable and convenient stay.',
			'Experience the charm of this cozy loft, ideally located in the heart of the city.',
			'Indulge in the ultimate luxury of this penthouse apartment with breathtaking panoramic views.',
			'Unwind in this spacious and well-appointed suite, designed for your utmost comfort.',
			'Discover the perfect blend of comfort and style in this elegant flat, beautifully renovated.',
			'Escape to this private villa, offering a tranquil oasis with all the amenities you desire.',
			'Enjoy the convenience and comfort of this modern residence, ideal for both short and long-term stays.'
		];
		return descriptions[Math.floor(Math.random() * descriptions.length)];
	};

	onMount(() => {
		featuredApartment = generateData(1)[0];
		apartments = generateData(10);
	});
</script>

<div class="w-full h-full overflow-y-scroll text-surface-800">
	{#if featuredApartment}
		<div class="relative">
			<img
				src={featuredApartment.imageUrl}
				alt="Featured Apartment"
				class="object-cover w-full h-96"
			/>
			<div class="absolute top-0 left-0 p-4 bg-white bg-opacity-75 rounded-lg shadow-lg">
				<h2 class="text-2xl font-bold text-surface-800">{featuredApartment.title}</h2>
				<p class="text-gray-500">{featuredApartment.description}</p>
			</div>
		</div>
	{/if}

	<div class="p-4 text-surface-800">
		<h2 class="mb-4 text-2xl font-bold">Available Properties</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each apartments as apartment (apartment.id)}
				<div class="overflow-hidden bg-white rounded-lg shadow-md">
					<img src={apartment.imageUrl} alt="Apartment" class="object-cover w-full h-48" />
					<div class="p-4">
						<h3 class="mb-2 text-lg font-bold text-surface-800">{apartment.title}</h3>
						<p class="text-gray-600">{apartment.description}</p>
						<div class="mt-4 text-lg font-bold text-surface-800">{apartment.price}</div>
						<div class="mt-2 text-sm text-gray-500">
							<span>{apartment.beds} Bed</span> | <span>{apartment.baths} Bath</span> |
							<span>{apartment.sqft} Sq Ft</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
