<script lang="ts">
	const now = new Date();
	let days = Array.from({ length: 180 }, (_, i) => {
		const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
		const isBooked = Math.random() < 0.4;
		return {
			date: day.getDate(),
			day: isBooked ? 'booked' : day.toLocaleString('default', { weekday: 'short' }),
			month: day.toLocaleString('default', { month: 'short' }),
			fullDate: day,
			isBooked
		};
	});

	let selectedDays = [];
	let selectedDateRange = [];
	let hoveredDay = null;

	export let childInput;
	const { form, errors, field, constraints } = childInput;

	function isDayUnavailable(day) {
		if (selectedDays.length === 1) {
			const previousBookedDay = [...days]
				.reverse()
				.find((d) => d.isBooked && d.fullDate.getTime() < selectedDays[0].fullDate.getTime());
			const nextBookedDay = days.find(
				(d) => d.isBooked && d.fullDate.getTime() > selectedDays[0].fullDate.getTime()
			);
			return (
				(previousBookedDay && day.fullDate.getTime() < previousBookedDay.fullDate.getTime()) ||
				(nextBookedDay && day.fullDate.getTime() > nextBookedDay.fullDate.getTime())
			);
		}
		return false;
	}

	function updateSelectedDateRange() {
		if (selectedDays.length === 2) {
			const startDate = Math.min(
				selectedDays[0].fullDate.getTime(),
				selectedDays[1].fullDate.getTime()
			);
			const endDate = Math.max(
				selectedDays[0].fullDate.getTime(),
				selectedDays[1].fullDate.getTime()
			);
			selectedDateRange = days.filter(
				(day) => day.fullDate.getTime() >= startDate && day.fullDate.getTime() <= endDate
			);
		} else {
			selectedDateRange = [];
		}
	}

	function updateHoveredDateRange() {
		if (selectedDays.length === 1 && hoveredDay) {
			const startDate = Math.min(selectedDays[0].fullDate.getTime(), hoveredDay.fullDate.getTime());
			const endDate = Math.max(selectedDays[0].fullDate.getTime(), hoveredDay.fullDate.getTime());
			selectedDateRange = days.filter(
				(day) => day.fullDate.getTime() >= startDate && day.fullDate.getTime() <= endDate
			);
		} else if (selectedDays.length === 2 && hoveredDay) {
			selectedDateRange = days.filter((day) => selectedDateRange.includes(day));
		} else {
			selectedDateRange = [];
		}
	}

	$: if (selectedDays.length === 2) {
		$form[field.name] = JSON.stringify({
			start: selectedDays[0].fullDate,
			end: selectedDays[1].fullDate
		});
	} else {
		$form[field.name] = '';
	}
</script>

<input
	type="hidden"
	name={field.name}
	bind:value={$form[field.name]}
	aria-invalid={$errors[field.name] ? 'true' : undefined}
	{...constraints[field.name]}
/>

{#if selectedDays.length > 0}
	<div
		class="w-full text-center bg-secondary-500 text-white text-md lg:text-xl font-semibold my-2 rounded-lg p-1 lg:p-2"
	>
		{selectedDays.length > 1
			? Math.abs(
					(selectedDays[0].fullDate.getTime() - selectedDays[1].fullDate.getTime()) /
						(1000 * 60 * 60 * 24)
			  )
			: 0} Night{selectedDays.length > 1 &&
		Math.abs(
			(selectedDays[0].fullDate.getTime() - selectedDays[1].fullDate.getTime()) /
				(1000 * 60 * 60 * 24)
		) > 1
			? 's'
			: ''}<br />
		<span class="text-xxs lg:text-xs font-normal">
			from {selectedDays.map((day) => day.fullDate.toLocaleDateString()).join(' to ')}
		</span>
	</div>
{/if}
<div class="flex flex-wrap max-h-72 w-full md:max-h-96 overflow-y-auto">
	<div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-2 w-full mr-1">
		{#each days as day, index (day.fullDate)}
			{#if index === 0 || days[index - 1].month !== day.month}
				<div
					class="p-4 h-12 md:h-16 rounded-xl bg-secondary-400 text-white flex items-center justify-center"
				>
					{day.month}
				</div>
			{/if}
			<div
				class={`flex flex-col h-12 md:h-16 items-center justify-center rounded-xl ${
					day.isBooked ? 'bg-secondary-100' : ''
				} ${selectedDays.includes(day) ? 'bg-primary-400' : ''} ${
					selectedDays.length === 1 && isDayUnavailable(day)
						? 'bg-secondary-100'
						: selectedDays.length === 2 &&
						  hoveredDay &&
						  selectedDateRange.includes(day) &&
						  day === hoveredDay
						? 'bg-error-400'
						: selectedDays.length === 2 && !selectedDateRange.includes(day)
						? 'bg-secondary-100'
						: selectedDays.length === 2 && selectedDateRange.includes(day)
						? 'bg-primary-400'
						: selectedDays.length === 1 && selectedDateRange.includes(day)
						? 'bg-primary-400'
						: 'hover:bg-primary-500 cursor-pointer'
				}`}
				on:click={() => {
					if (!day.isBooked && !isDayUnavailable(day)) {
						const index = selectedDays.indexOf(day);
						if (index !== -1 || (selectedDays.length === 2 && selectedDateRange.includes(day))) {
							selectedDays = [];
							selectedDateRange = [];
						} else if (selectedDays.length < 2) {
							selectedDays = [...selectedDays, day];
						}
						updateSelectedDateRange();
					}
				}}
				on:mouseover={() => {
					if (
						(selectedDays.length === 1 && !day.isBooked && !isDayUnavailable(day)) ||
						selectedDays.length === 2
					) {
						hoveredDay = day;
						updateHoveredDateRange();
					}
				}}
				on:mouseout={() => {
					if (selectedDays.length === 1) {
						hoveredDay = null;
						selectedDateRange = [];
					}
				}}
			>
				<div>{day.date}</div>
				<div class="text-xxs">{day.day}</div>
			</div>
		{/each}
	</div>
</div>
