<script lang="ts">
	import { createMachine, assign } from 'xstate';
	import { useMachine } from '@xstate/svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { derived, writable } from 'svelte/store';

	export let me;

	const { fields, validators } = $me.context;

	let stepperState = writable({ current: 0, total: fields.length });

	$: stepperState.update((state) => ({ ...state, current: $state.context.currentField }));

	let initialFormData = fields.reduce((acc, field) => {
		acc[field.name] = field.placeholder;
		return acc;
	}, {});

	let { form, errors, validate, constraints } = superForm(initialFormData, {
		validators: validators,
		warnings: {
			noValidationAndConstraints: false
		},
		validationMethod: 'oninput',
		clearOnSubmit: 'errors-and-message'
	});

	const formMachine = createMachine({
		id: 'form',
		initial: 'input',
		context: {
			currentField: 0,
			formData: initialFormData
		},
		states: {
			input: {
				on: {
					NEXT: [
						{
							target: 'summary',
							actions: assign({
								formData: (context, event) => ({
									...context.formData,
									[fields[context.currentField].name]: event.fieldValue
								})
							}),
							cond: (context) => context.currentField === fields.length - 1
						},
						{
							target: 'input',
							actions: [
								assign({
									currentField: (context) => context.currentField + 1,
									formData: (context, event) => ({
										...context.formData,
										[fields[context.currentField].name]: event.fieldValue
									})
								})
							]
						}
					],
					PREV: {
						target: 'input',
						actions: assign({
							currentField: (context) => context.currentField - 1
						}),
						cond: (context) => context.currentField > 0
					}
				}
			},
			summary: {
				on: {
					SUBMIT: 'submitted',
					PREV: {
						target: 'input',
						actions: assign({
							currentField: (context) => context.currentField - 1
						})
					}
				}
			},
			submitted: {
				on: {
					RESTART: {
						target: 'input',
						actions: assign({
							currentField: 0,
							formData: () => ({ ...initialFormData })
						})
					}
				}
			}
		}
	});

	const { state, send } = useMachine(formMachine);

	$: if ($state.matches('submitted')) {
		({ form, errors, validate, constraints } = superForm(initialFormData, {
			validators: validators,
			warnings: {
				noValidationAndConstraints: false
			},
			validationMethod: 'oninput',
			clearOnSubmit: 'errors-and-message'
		}));
	}

	async function handleNext() {
		const currentFieldName = fields[$state.context.currentField].name;

		const validationResult = await validate(currentFieldName);

		if (validationResult && !validationResult.valid) {
			return;
		}

		const fieldValue = $form[currentFieldName];
		if ($state.matches('summary')) {
			send('SUBMIT');
		} else {
			send('NEXT', { fieldValue });
		}
	}

	function handleKeyDown(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleNext();
		}
	}

	function isJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	let childInput;
	$: {
		childInput = {
			form,
			errors,
			validate,
			field: fields[$state.context.currentField],
			constraints
		};
	}

	const possibleActions = derived(state, ($state) =>
		Object.keys(formMachine.states[$state.value]?.on || {})
	);
</script>

<div class="p-3 pb-4 md:p-8 lg:p-12">
	<form on:submit|preventDefault={handleNext} on:keydown={handleKeyDown} class="w-full">
		{#if $state.matches('input')}
			<div class="mb-4">
				<div class="p-2">
					<h2 class="mb-2 text-lg md:text-4xl font-semibold text-center text-primary-500">
						{fields[$state.context.currentField].title}
					</h2>
					{#if $errors[fields[$state.context.currentField].name]}
						<p class="text-sm lg:text-2xl text-center text-warning-500">
							{$errors[fields[$state.context.currentField].name]}
						</p>
					{:else}
						<p class="text-sm lg:text-2xl text-center text-secondary-500">
							{fields[$state.context.currentField].description}
						</p>
					{/if}
				</div>
				<div class="py-4">
					<Stepper {stepperState} stepStateName={fields[$state.context.currentField].name} />
				</div>

				{#if fields[$state.context.currentField].type === 'text'}
					<TextInput {childInput} />
				{:else if fields[$state.context.currentField].type === 'email'}
					<TextInput {childInput} />
				{:else if fields[$state.context.currentField].type === 'textarea'}
					<TextAreaInput {childInput} />
				{:else if fields[$state.context.currentField].type === 'select'}
					<SelectInput {childInput} />
				{:else if fields[$state.context.currentField].type === 'slider'}
					<SliderInput {childInput} />
				{:else if fields[$state.context.currentField].type === 'toggle'}
					<ToggleInput {childInput} />
				{:else if fields[$state.context.currentField].type === 'number'}
					<NumberInput {childInput} />
				{:else if fields[$state.context.currentField].type === 'cardSelect'}
					<CardSelectInput {childInput} />
				{:else if fields[$state.context.currentField].type === 'dateRange'}
					<DateRangeInput {childInput} />
				{/if}
			</div>
		{/if}
		{#if $state.matches('summary')}
			<div class="py-3">
				<h2 class="mb-2 text-lg md:text-4xl font-semibold text-center text-primary-500">Summary</h2>
				<p class="text-sm md:text-2xl text-center text-secondary-500 mb-3">
					Please verify your order
				</p>
				<dl>
					{#each Object.entries($state.context.formData) as [key, value]}
						<span class="flex-auto">
							<dt class="text-xs lg:text-sm text-secondary-300">{key}</dt>
							{#if typeof value === 'string' && isJsonString(value)}
								{#each Object.entries(JSON.parse(value)) as [subKey, subValue]}
									<dd class="text-sm md:text-2xl text-secondary-500 font-semibold">
										{subKey}: {subValue}
									</dd>
								{/each}
							{:else}
								<dd class="text-sm md:text-2xl text-secondary-500 font-semibold">{value}</dd>
							{/if}
						</span>
					{/each}
				</dl>
			</div>
		{/if}
		{#if $state.matches('submitted')}
			<div
				class="bg-success-500 w-full rounded-lg px-4 py-12 text-white text-center mb-2 text-xl font-semibold"
			>
				submitted
			</div>
		{/if}
		<div class="flex justify-between mt-1 md:mt-4">
			<div>
				{#each $possibleActions as action (action)}
					{#if action === 'PREV'}
						<button
							type="button"
							on:click={() => send(action)}
							class="btn btn-sm md:btn-base variant-filled-secondary font-semibold"
							disabled={$state.context.currentField === 0}
							><span>
								<Icon icon="solar:alt-arrow-left-bold" class="text-white h-5" />
							</span>
						</button>
					{/if}
				{/each}
			</div>
			<div>
				{#each $possibleActions as action (action)}
					{#if action !== 'NEXT' && action !== 'PREV' && action !== 'SUBMIT'}
						<button
							type="button"
							on:click={() => send(action)}
							class="btn btn-sm md:btn-base variant-filled font-semibold"
						>
							{action}
						</button>
					{/if}
				{/each}
			</div>
			<div>
				{#each $possibleActions as action (action)}
					{#if action === 'NEXT' || action === 'SUBMIT'}
						<button
							type="button"
							on:click={() => handleNext()}
							class="btn variant-filled-primary btn-sm md:btn-base font-semibold"
							disabled={$errors[fields[$state.context.currentField].name]}
						>
							{action}
						</button>
					{/if}
				{/each}
			</div>
		</div>
	</form>
</div>

<style>
	dl {
		display: grid;
		gap: 10px;
	}
</style>
