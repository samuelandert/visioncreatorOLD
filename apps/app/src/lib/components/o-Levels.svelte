<script>
	let levels = [
		{
			title: 'Level 1: Visionsentwickler',
			amount: 28,
			subtitle: 'Learn to Sell a Vision',
			description:
				'Embark on a journey of self-discovery and learn to articulate and sell your vision. This level encourages you to dream big and provides you with the tools to make your dreams a reality.'
		},
		{
			title: 'Level 2: Data Pod',
			amount: 56,
			subtitle: 'Learn to take back control of your Life',
			description:
				'Take control of your life by understanding and managing your personal data. This level includes digital post management, helping you to organize and control your digital footprint.'
		},
		{
			title: 'Level 3: Masterclasses Online',
			amount: 84,
			subtitle: 'Learn how to learn skills fast',
			description:
				'Accelerate your learning process with our online masterclasses. Gain entrepreneurial knowledge and wisdom, and learn how to quickly acquire new skills.'
		},
		{
			title: 'Level 4: Become a Mentor',
			amount: 140,
			subtitle: 'Learn to give & teach your skills',
			description:
				'Invest in the dreams of fellow Visionsentwicklers by becoming a mentor. This level includes a weekly call and chat support, and requires a commitment of €84 to invest in another Visionsentwickler.'
		},
		{
			title: 'Level 5: Start Your own Company',
			amount: 224,
			subtitle: 'Learn to build your own dream company',
			description:
				'Learn how to build your dream company with fellow Visionsentwicklers. This level provides full-service back-office AI support, including accounting, ownership distribution, and digital GmbH.'
		},
		{
			title: 'Level 6: Mobility',
			amount: 364,
			subtitle: 'Learn to take on your responsibility for a sustainable earth',
			description:
				'Embrace your responsibility for a sustainable earth by exploring different modes of transport. This level includes access to trains, public transport, bikes, scooters, and cars.'
		},
		{
			title: 'Level 7: Food',
			amount: 588,
			subtitle: 'Learn to take on your responsibility for your health',
			description:
				'Take control of your health by learning about nutrition and developing healthy eating habits. This level provides all the healthy food you need to live a balanced life.'
		},
		{
			title: 'Level 8: City Apartment',
			amount: 952,
			subtitle: 'Finally fulfill your dream of your own home',
			description:
				'Achieve your dream of owning your own home. This level includes a city apartment, complete with water and power.'
		},
		{
			title: 'Level 9: Exclusive Investor Circle',
			amount: 1540,
			subtitle: 'Learn to become an investor',
			description:
				'Join our exclusive investor circle and learn how to invest in and support the dreams of other Visionsentwicklers. This level includes monthly investment meetups and opportunities for cross-breeding.'
		}
	];
	// Helper function to generate random habits
	function generateHabits() {
		const habits = [];
		const numHabits = Math.floor(Math.random() * 4) + 2; // Random number between 2 and 5
		for (let i = 0; i < numHabits; i++) {
			habits.push({ habit: `Habit ${i + 1}`, goals: generateGoals() });
		}
		return habits;
	}

	// Helper function to generate random goals
	function generateGoals() {
		const goals = [];
		const numGoals = Math.floor(Math.random() * 6) + 3; // Random number between 3 and 8
		for (let i = 0; i < numGoals; i++) {
			goals.push(`Goal ${i + 1}`);
		}
		return goals;
	}

	levels = levels.map((level) => ({ ...level, habits: generateHabits() }));
</script>

<div class="bg-white overflow-auto">
	<ul class="w-4/5 mx-auto">
		{#each levels as level (level.title)}
			<li class="flex justify-between rounded-lg bg-secondary-200 text-primary-900 p-4 m-2">
				<div class="flex">
					<p class="font-bold">{level.title}: <span>{level.subtitle}</span></p>
				</div>
				<div>-{level.amount}€/month</div>
			</li>
			<li class="rounded-lg bg-secondary-200 text-primary-900 p-4 m-2">{level.description}</li>
			{#each level.habits as habit}
				<li class="rounded-lg bg-success-300 text-primary-900 p-4 m-2">{habit.habit}</li>
				<div class="grid grid-cols-5 gap-4">
					{#each habit.goals as goal}
						<div
							class="rounded-lg bg-tertiary-200 text-primary-900 p-4 m-2 aspect-w-1 aspect-h-1 flex items-center justify-center"
						>
							{goal}
						</div>
					{/each}
				</div>
			{/each}
		{/each}
	</ul>
</div>
