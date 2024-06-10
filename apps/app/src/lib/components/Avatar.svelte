<script lang="ts">
	import { createAvatar } from '@dicebear/core';
	import { lorelei } from '@dicebear/collection';

	export let seed: string;

	function generateAvatar(seed: string): string {
		return createAvatar(lorelei, {
			size: 128,
			seed: seed,
			mouth: [
				'happy01',
				'happy02',
				'happy03',
				'happy04',
				'happy05',
				'happy06',
				'happy07',
				'happy08',
				'happy09',
				'happy10',
				'happy11',
				'happy12',
				'happy13',
				'happy14',
				'happy15',
				'happy16',
				'happy17',
				'happy18'
			]
		}).toDataUriSync();
	}

	let avatarSrc = generateAvatar(seed);
</script>

<img
	src={avatarSrc}
	alt="Profile"
	class="w-24 h-24 mb-2 border-4 rounded-full bg-tertiary-500 border-tertiary-200"
/>
