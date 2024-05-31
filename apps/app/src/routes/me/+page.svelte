<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createMutation, createSubscription } from '$lib/wundergraph';

	export let data;
	let loading = false;
	let file: File | null = null;

	let { session } = data;
	$: ({ session } = data);

	const subscribeMe = createSubscription({
		operationName: 'subscribeMe',
		input: {
			userid: session.user.id
		}
	});

	const updateNameMutation = createMutation({
		operationName: 'updateMe'
	});

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};

	const handleUpdateName = async () => {
		const newName = prompt('Please enter your new name:');
		if (newName) {
			await $updateNameMutation.mutateAsync({ userid: session.user.id, fullName: newName });
		}
	};

	const uploadAvatarMutation = createMutation({
		operationName: 'uploadProfileImage',
		input: {
			file,
			userid: session.user.id
		}
	});

    async function handleFileUpload() {
        if (file && session.user.id) {
            loading = true;
            const filePath = `${session.user.id}`;
            const { error } = await data.supabase.storage.from('avatars').upload(filePath, file);
            if (error) {
                console.error('Upload error:', error.message);
            } else {
                console.log('File uploaded successfully');
                await $uploadAvatarMutation.mutateAsync({ userid: session.user.id, filePath });
            }
            loading = false;
        }
    }

    function handleFileChange(event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            file = input.files[0];
        }
    }
</script>

{#if $subscribeMe.isLoading}
	<p>Loading user details...</p>
{:else if $subscribeMe.isError}
	<p>Error: {$subscribeMe.error?.message}</p>
{:else}
	<div class="m-10">
		<p class="pb-2 text-2xl">
			Welcome {$subscribeMe.data?.full_name}
		</p>
		<p>ID: {$subscribeMe.data?.id}</p>
		Website: {$subscribeMe.data?.website}

		<form method="post" class="py-6" action="?/signout" use:enhance={handleSignOut}>
			<button
				class="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
				disabled={loading}>Sign Out</button
			>
		</form>
		<button
			class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
			on:click={handleUpdateName}
			disabled={loading}>Update Name</button
		>
		<div class="mb-6" />
		<input type="file" on:change={handleFileChange} />
		<button on:click={handleFileUpload} disabled={loading || !file}>Upload Profile Image</button>
	</div>
{/if}
