<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { derived, writable, get } from 'svelte/store';
	import { log } from '$lib/stores';
	import { submitForm } from '$lib/composables/flowOperations';

	export let me;

	let formData;
	let fields = [];
	let validators = {};
	let submitAction = '';
	let form;
	let errors;
	let validate;
	let constraints;

	$: if (me) {
		me.subscribe((value) => {
			formData = value.data?.form || { fields: [], validators: {}, submitAction: '' };
			fields = formData.fields;
			validators = formData.validators;
			submitAction = formData.submitAction;

			// Log the current state of me data context
			log('info', 'Current me data context', {
				formData,
				fields: fields.length,
				validators: Object.keys(validators).length,
				submitAction
			});
		});
	}

	let currentField = writable(0);
	let stepperState = derived([currentField, writable(fields)], ([$currentField, $fields]) => ({
		current: $currentField,
		total: $fields.length
	}));

	$: initialFormData = fields.reduce((acc, field) => {
		acc[field.name] = field.placeholder || '';
		return acc;
	}, {});

	$: formConfig = {
		validators: validators,
		warnings: { noValidationAndConstraints: false },
		validationMethod: 'oninput',
		clearOnSubmit: 'errors-and-message'
	};

	$: if (initialFormData && Object.keys(initialFormData).length > 0) {
		({ form, errors, validate, constraints } = superForm(initialFormData, formConfig));
	}

	let submissionResult = writable({ success: false, message: '' });

	$: isLastStep = $currentField === fields.length - 1;
	$: isOnlyOneField = fields.length === 1;
	$: isFirstField = $currentField === 0;

	async function handleNext() {
		if (!fields[$currentField]) return;

		const currentFieldName = fields[$currentField].name;
		const validationResult = await validate(currentFieldName);

		if (validationResult && !validationResult.valid) {
			log('error', `Validation failed for field: ${currentFieldName}`, {
				errors: $errors[currentFieldName]
			});
			return;
		}

		// Log the entire form data
		const formData = get(form);
		log('info', 'Current form data', {
			currentField: $currentField,
			totalFields: fields.length,
			currentFieldName: fields[$currentField]?.name,
			allFormData: formData
		});

		if (isLastStep) {
			await handleSubmit();
		} else {
			currentField.update((n) => n + 1);
		}
	}

	function handlePrev() {
		currentField.update((n) => n - 1);
	}

	async function handleSubmit() {
		try {
			const formData = get(form);
			log('info', 'Submitting form', { formData });

			// Map fields to input
			const input = fields.reduce((acc, field) => {
				acc[field.name] = formData[field.name];
				return acc;
			}, {});

			const result = await submitForm({
				operation: submitAction,
				input: input,
				eventType: submitAction // Using submitAction as eventType
			});

			submissionResult.set({ success: true, message: result.message });
			log('success', 'Form submitted successfully', result);
		} catch (error) {
			const errorMessage = error.message || 'An error occurred while submitting the form.';
			submissionResult.set({ success: false, message: errorMessage });
			log('error', 'Form submission failed', { error: errorMessage });
		}
	}

	function handleKeyDown(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleNext();
		}
	}

	$: childInput =
		form && errors && validate && constraints
			? {
					form,
					errors,
					validate,
					field: fields[$currentField],
					constraints
			  }
			: null;

	$: isFieldValid =
		$form &&
		fields[$currentField]?.name in $form &&
		$form[fields[$currentField]?.name] !== '' &&
		!$errors[fields[$currentField]?.name];

	$: isFormValid =
		$form &&
		Object.keys($form).length === fields.length &&
		Object.values($form).every((value) => value !== '') &&
		Object.keys($errors).length === 0;
</script>

{#if fields.length > 0 && childInput}
	<form on:submit|preventDefault={handleNext} on:keydown={handleKeyDown} class="w-full">
		<div class="mb-4">
			<div class="p-4">
				<h2 class="mb-2 text-lg font-semibold text-center md:text-4xl text-tertiary-500">
					{fields[$currentField].title}
				</h2>
				{#if $errors[fields[$currentField].name]}
					<p class="text-sm text-center lg:text-2xl text-warning-500">
						{$errors[fields[$currentField].name]}
					</p>
				{:else}
					<p class="text-sm text-center lg:text-2xl text-tertiary-700">
						{fields[$currentField].description}
					</p>
				{/if}
			</div>
			{#if !isOnlyOneField}
				<div class="py-4">
					<Stepper {stepperState} stepStateName={fields[$currentField]?.name || ''} />
				</div>
			{/if}

			{#key $currentField}
				{#if fields[$currentField].type === 'text'}
					<TextInput {childInput} />
				{:else if fields[$currentField].type === 'email'}
					<TextInput {childInput} />
				{:else if fields[$currentField].type === 'textarea'}
					<TextAreaInput {childInput} />
				{:else if fields[$currentField].type === 'select'}
					<SelectInput {childInput} />
				{:else if fields[$currentField].type === 'slider'}
					<SliderInput {childInput} />
				{:else if fields[$currentField].type === 'toggle'}
					<ToggleInput {childInput} />
				{:else if fields[$currentField].type === 'number'}
					<NumberInput {childInput} />
				{:else if fields[$currentField].type === 'cardSelect'}
					<CardSelectInput {childInput} />
				{:else if fields[$currentField].type === 'dateRange'}
					<DateRangeInput {childInput} />
				{/if}
			{/key}
		</div>

		{#if $submissionResult.success}
			<div
				class="w-full px-4 py-12 mb-2 text-xl font-semibold text-center text-white rounded-lg bg-success-600"
			>
				{$submissionResult.message}
			</div>
		{:else if $submissionResult.message}
			<div
				class="w-full px-4 py-12 mb-2 text-xl font-semibold text-center text-white rounded-lg bg-error-500"
			>
				{$submissionResult.message}
				<div class="flex justify-center mt-4">
					<button
						type="button"
						on:click={() => {
							currentField.set(0);
							submissionResult.set({ success: false, message: '' });
						}}
						class="font-semibold btn btn-sm md:btn-base variant-filled-secondary"
					>
						Try Again
					</button>
				</div>
			</div>
		{/if}

		<div class="flex justify-between mt-1 md:mt-4">
			<div>
				{#if !isOnlyOneField && !isFirstField}
					<button
						type="button"
						on:click={handlePrev}
						class="font-semibold btn btn-sm md:btn-base variant-filled-secondary"
					>
						<span>
							<Icon icon="solar:alt-arrow-left-bold" class="h-5 text-white" />
						</span>
					</button>
				{/if}
			</div>
			<div>
				<button
					type="button"
					on:click={handleNext}
					class="font-semibold btn variant-filled-secondary btn-sm md:btn-base"
					disabled={!isFieldValid || (isLastStep && !isFormValid)}
				>
					{isLastStep ? 'Submit' : 'Next'}
				</button>
			</div>
		</div>
	</form>
{/if}
