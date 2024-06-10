<script lang="ts">
	import { createAvatar } from '@dicebear/core';
	import { lorelei } from '@dicebear/collection';

	export let me: {
		data: { seed: string };
		design: { highlight: boolean };
		size: 'sm' | 'md' | 'lg';
	};

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

	$: avatar = generateAvatar(me.data.seed);
	$: bgColorClass = me.design.highlight ? 'bg-tertiary-400' : 'bg-surface-500';
	$: sizeClass =
		me.size === 'lg'
			? 'w-24 h-24 mb-2 border-4 rounded-full'
			: 'w-12 h-12 @3xl:h-14 @3xl:w-14 rounded-full';
</script>

<img src={avatar} alt="Profile" class={`${sizeClass} ${bgColorClass} border-tertiary-200`} />
