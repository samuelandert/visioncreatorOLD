<script>
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();
	import { view } from '$lib/views/Form';

	export let card;
	function openDrawer() {
		drawerStore.open({
			position: 'bottom',
			meta: view
		});
	}
</script>

<div class="w-full bg-white rounded-2xl shadow flex-col justify-start items-start inline-flex">
	<div class="w-full h-56 relative">
		<img
			class="w-full h-56 left-0 top-0 absolute rounded-tl-2xl rounded-tr-2xl object-cover"
			src={card.image}
			alt={card.title}
		/>
		<div
			class="w-44 h-10 p-2 left-0 top-[170px] absolute bg-white rounded-r-lg shadow flex-col justify-center items-center gap-2 inline-flex"
		>
			<div>
				<span class="text-secondary-500 text-base font-semibold leading-4">from </span>
				<span class="text-primary-500 text-xl font-bold leading-loose"> 59€</span>
				<span class="text-secondary-500 text-base font-semibold leading-4">/night</span>
			</div>
		</div>
	</div>
	<div class="self-stretch px-6 py-6 flex flex-col justify-center items-start gap-2">
		<div class="self-stretch flex-col justify-start items-start gap-2 flex">
			<div class="self-stretch text-secondary-500 text-2xl font-semibold leading-8">
				{card.title}
			</div>
			<div class="self-stretch text-teal-900 text-sm leading-5 py-2">
				{card.description}
			</div>
			<div class="justify-start items-start gap-2 inline-flex">
				<Icon icon="mingcute:location-2-fill" class="text-primary-500 w-4 h-4" />
				<div class="w-80 text-gray-400 text-xs font-normal leading-snug">
					{card.location}
				</div>
			</div>
		</div>
		<div class="flex justify-center items-center mt-2">
			<button on:click={openDrawer} type="button" class="btn variant-filled-primary"
				>Book Now</button
			>
		</div>
	</div>
</div>
