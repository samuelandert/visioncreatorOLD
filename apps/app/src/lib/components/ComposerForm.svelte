<script lang="ts">
	import { createMachine, assign } from 'xstate';
	import { useMachine } from '@xstate/svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { derived, writable } from 'svelte/store';
	import { log } from '$lib/stores';

	export let me;

	const { fields, validators } = $me.context;
	const { submitForm } = $me.do.core;

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

	let submissionResult = writable({ success: false, message: '' });

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
							target: 'submitted',
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

	async function handleSubmit() {
		const currentFieldName = fields[$state.context.currentField].name;
		const validationResult = await validate(currentFieldName);

		if (validationResult && !validationResult.valid) {
			log('error', `Validation failed for field: ${currentFieldName}`);
			return;
		}

		const fieldValue = $form[currentFieldName];
		send('NEXT', { fieldValue });

		if (isLastStep) {
			try {
				const result = await submitForm($state.context.formData);
				submissionResult.set({ success: true, message: result.message });
				log('success', 'Form submitted successfully', result);
			} catch (error) {
				const errorMessage = error.message || 'An error occurred while submitting the form.';
				submissionResult.set({
					success: false,
					message: errorMessage
				});
				log('error', 'Form submission failed', { error: errorMessage });
			}
		}
	}
	async function handleNext() {
		if (isLastStep) {
			await handleSubmit();
		} else {
			const currentFieldName = fields[$state.context.currentField].name;
			const validationResult = await validate(currentFieldName);

			if (validationResult && !validationResult.valid) {
				log('error', `Validation failed for field: ${currentFieldName}`);
				return;
			}

			const fieldValue = $form[currentFieldName];
			send('NEXT', { fieldValue });
		}
	}
	function handleKeyDown(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleNext();
		}
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

	$: isLastStep = $state.context.currentField === fields.length - 1;

	$: isOnlyOneField = fields.length === 1;
	$: isFirstField = $state.context.currentField === 0;
</script>

<form on:submit|preventDefault={handleNext} on:keydown={handleKeyDown} class="w-full">
	{#if $state.matches('input')}
		<div class="mb-4">
			<div class="p-4">
				<h2 class="mb-2 text-lg font-semibold text-center md:text-4xl text-tertiary-500">
					{fields[$state.context.currentField].title}
				</h2>
				{#if $errors[fields[$state.context.currentField].name]}
					<p class="text-sm text-center lg:text-2xl text-warning-500">
						{$errors[fields[$state.context.currentField].name]}
					</p>
				{:else}
					<p class="text-sm text-center lg:text-2xl text-tertiary-700">
						{fields[$state.context.currentField].description}
					</p>
				{/if}
			</div>
			{#if !isOnlyOneField}
				<div class="py-4">
					<Stepper {stepperState} stepStateName={fields[$state.context.currentField].name} />
				</div>
			{/if}

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

	{#if $state.matches('submitted')}
		<div
			class={`w-full px-4 py-12 mb-2 text-xl font-semibold text-center text-white rounded-lg ${
				$submissionResult.success ? 'bg-success-600' : 'bg-error-500'
			}`}
		>
			{$submissionResult.message}
		</div>
		{#if !$submissionResult.success}
			<div class="flex justify-center mt-4">
				<button
					type="button"
					on:click={() => send('RESTART')}
					class="font-semibold btn btn-sm md:btn-base variant-filled-secondary"
				>
					Try Again
				</button>
			</div>
		{/if}
	{/if}
	<div class="flex justify-between mt-1 md:mt-4">
		<div>
			{#if !isOnlyOneField && !isFirstField}
				{#each $possibleActions as action (action)}
					{#if action === 'PREV'}
						<button
							type="button"
							on:click={() => send(action)}
							class="font-semibold btn btn-sm md:btn-base variant-filled-secondary"
						>
							<span>
								<Icon icon="solar:alt-arrow-left-bold" class="h-5 text-white" />
							</span>
						</button>
					{/if}
				{/each}
			{/if}
		</div>
		<!-- <div>
			{#each $possibleActions as action (action)}
				{#if action !== 'NEXT' && action !== 'PREV'}
					<button
						type="button"
						on:click={() => send(action)}
						class="font-semibold btn btn-sm md:btn-base variant-filled"
					>
						{action}
					</button>
				{/if}
			{/each}
		</div> -->
		<div>
			{#if $possibleActions.includes('NEXT')}
				<button
					type="button"
					on:click={handleNext}
					class="font-semibold btn variant-filled-secondary btn-sm md:btn-base"
					disabled={$errors[fields[$state.context.currentField].name]}
				>
					{isLastStep ? 'Submit' : 'Next'}
				</button>
			{/if}
		</div>
	</div>
</form>
