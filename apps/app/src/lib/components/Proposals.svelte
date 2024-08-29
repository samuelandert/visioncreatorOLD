<script lang="ts">
	import { writable } from 'svelte/store';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	interface Proposal {
		id: number;
		text: string;
		votes: number;
	}

	let proposals = writable<Proposal[]>([]);
	let newProposal = '';

	function addProposal() {
		if (newProposal.trim()) {
			proposals.update((items) => [
				...items,
				{ id: Date.now(), text: newProposal.trim(), votes: 0 }
			]);
			newProposal = '';
		}
	}

	function vote(id: number) {
		proposals.update((items) =>
			items.map((item) => (item.id === id ? { ...item, votes: item.votes + 1 } : item))
		);
	}
</script>

<div class="container mx-auto p-4 space-y-4">
	<h1 class="h1 mb-4">Voting Platform</h1>

	<div class="card p-4 variant-ghost-surface">
		<h2 class="h2 mb-2">Add New Proposal</h2>
		<div class="flex space-x-2">
			<input class="input w-full" placeholder="Enter your proposal" bind:value={newProposal} />
			<button class="btn variant-filled" on:click={addProposal}>Add</button>
		</div>
	</div>

	<div class="card p-4 variant-ghost-surface">
		<h2 class="h2 mb-2">Proposals</h2>
		{#each $proposals as proposal (proposal.id)}
			<div class="card p-4 mb-2 variant-soft">
				<p class="mb-2">{proposal.text}</p>
				<div class="flex justify-between items-center">
					<span class="font-bold">Votes: {proposal.votes}</span>
					<button class="btn variant-filled" on:click={() => vote(proposal.id)}>Vote</button>
				</div>
				<ProgressRadial
					value={proposal.votes}
					max={Math.max(...$proposals.map((p) => p.votes), 1)}
					meter="stroke-primary-500"
					track="stroke-primary-500/30"
				/>
			</div>
		{:else}
			<p>No proposals yet. Add one above!</p>
		{/each}
	</div>
</div>
