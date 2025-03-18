<script lang="ts">
	import { writable } from 'svelte/store';
	import { z } from 'zod';
	import { createMutation } from '@tanstack/svelte-query';
	import { _axios } from '$lib/_axios';
	import { toast } from 'svelte-sonner';
	import { cUrl, ckey } from '$lib/config';
	import { onMount, onDestroy } from "svelte";
	import Mobile from './mobile.svelte';
	import { browser } from "$app/environment";
	import Icon from '@iconify/svelte';
	interface MobileComponent {
    resetMobileInput: () => void;
}

	// Combined form and select state
	let formData = writable({
		name: '',
		phone: '',
        phoneCountry:'',
		email: '',
		hospitalName: '',
		hospitalType: '',
		country: '',
		state: '',
		city: '',
		message: ''
	});
	let mobileComponent: MobileComponent | undefined;

	// Search and select state
	let isCountryOpen = false;
	let isStateOpen = false;
	let isCityOpen = false;
	let countrySearchTerm = '';
	let stateSearchTerm = '';
	let citySearchTerm = '';
	let countries: any[] = [];
	let states: any[] = [];
	let cities: any[] = [];
	let selectedCountry = '';
	let selectedState = '';

    let phoneError = '';
    let phoneValid = false;

	const hospitalTypes = ['Type 1', 'Type 2', 'Type 3', 'Type 4'];
	let errors = writable<Record<string, string[]>>({});

	// Form validation schema
	const formSchema = z.object({
		name: z.string().min(1, 'Full Name is required'),
        phoneCountry: z.string().min(1, 'Country code is required'),
		phone: z
			.string(),
			// .regex(/^\d+$/, 'Phone number must contain only numbers'),
		email: z.string().email('Invalid email format'),
		hospitalName: z.string().min(1, 'Hospital Name is required'),
		hospitalType: z.string().min(1,"Hospital Type is required"),
		country: z.string().min(1, 'Please select a Country'),
		state: z.string().optional(),
		city: z.string().optional(),
		message: z.string().min(5, 'Message must be at least 5 characters')
	});

	type FormSchema = z.infer<typeof formSchema>;

	// Filtered options for searchable selects
	$: filteredCountries = countries.filter((country) =>
		country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
	);

	$: filteredStates = states.filter((state) =>
		state.name.toLowerCase().includes(stateSearchTerm.toLowerCase())
	);

	$: filteredCities = cities.filter((city) =>
		city.name.toLowerCase().includes(citySearchTerm.toLowerCase())
	);
	function handleInput(field: keyof FormSchema, event: Event) {
		const value = (event.target as HTMLInputElement).value;
		formData.update((data) => ({ ...data, [field]: value }));
		validateField(field, value);
	}
	$: if (countrySearchTerm.trim() === "") {
		stateSearchTerm  = '';
		citySearchTerm = '';
		selectedCountry='';
		selectedState='';
	}
    function validatePhone() {
        const storedMobileProp = sessionStorage.getItem('mobileProp');
        if (storedMobileProp) {
            const mobileProp = JSON.parse(storedMobileProp);

            if (mobileProp && mobileProp.PhoneNumber && mobileProp.country) {
                const isValidPhone = mobileProp.isValid;

                if (isValidPhone) {
                    // If phone is valid, update form data and clear errors
                    formData.update((data) => ({
                        ...data,
                        phone: mobileProp.PhoneNumber,
                        phoneCountry: mobileProp.country,
                    }));
                    phoneError = '';
                    phoneValid = true;
                    errors.update(e => {
                        const newErrors = { ...e };
                        delete newErrors.phone;
                        return newErrors;
                    });
                } else {
                    // If phone is invalid, set error message
                    phoneError = 'Please enter a valid phone number';
                    phoneValid = false;
                    errors.update(e => ({ ...e, phone: ['Please enter a valid phone number'] }));
                }
            }
        }
        return phoneValid;
    }



	async function loadCountries() {
		try {
			const response = await fetch(cUrl, { headers: { 'X-CSCAPI-KEY': ckey } });
			countries = await response.json();
		} catch (error) {
			console.error('Error loading countries:', error);
			toast.error('Failed to load countries');
		}
	}

	async function loadStates() {
		states = [];
		cities = [];
		if (!selectedCountry) return;

		try {
			const response = await fetch(`${cUrl}/${selectedCountry}/states`, {
				headers: { 'X-CSCAPI-KEY': ckey }
			});
			states = await response.json();
		} catch (error) {
			console.error('Error loading states:', error);
			toast.error('Failed to load states');
		}
	}

	async function loadCities() {
		cities = [];
		if (!selectedCountry || !selectedState) return;

		try {
			const response = await fetch(`${cUrl}/${selectedCountry}/states/${selectedState}/cities`, {
				headers: { 'X-CSCAPI-KEY': ckey }
			});
			cities = await response.json();
		} catch (error) {
			console.error('Error loading cities:', error);
			toast.error('Failed to load cities');
		}
	}

	// Select handlers
	function selectCountry(country: { iso2: string; name: string }) {
		selectedCountry = country.iso2;
        countrySearchTerm=country.name;
        stateSearchTerm = '';
	    citySearchTerm = '';
        formData.update((data) => ({ ...data, country: country.name }));
		isCountryOpen = false;
		loadStates();
	}

	function selectState(state: { iso2: string; name: string }) {
		selectedState = state.iso2;
        stateSearchTerm=state.name;
		formData.update((data) => ({ ...data, state: state.name }));
		isStateOpen = false;
	    citySearchTerm = '';
		loadCities();
	}

	function selectCity(city: { name: string }) {
        citySearchTerm=city.name;
		formData.update((data) => ({ ...data, city: city.name }));
		isCityOpen = false;
	}

	// Form validation and submission
	function validateField(field: keyof FormSchema, value: string) {
		try {
			formSchema.shape[field].parse(value);
			errors.update((e) => {
				const newErrors = { ...e };
				delete newErrors[field];
				return newErrors;
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldError = error.errors[0]?.message;
				errors.update((e) => ({ ...e, [field]: [fieldError] }));
			}
		}
	}

	const submitMutation = createMutation({
		mutationFn: (data: unknown) => _axios.post('/enquiryForm/submit', data),

		onSuccess() {
			toast.success('Enquiry Form Submitted Successfully ✅');
			       // Add this check and reset
				   if (mobileComponent?.resetMobileInput) {
            mobileComponent.resetMobileInput();
        }
			countrySearchTerm = '';
			stateSearchTerm = '';
			citySearchTerm = '';
			formData.set({
				name: '',
				phone: '',
                phoneCountry:'',
				email: '',
				hospitalName: '',
				hospitalType: '',
				country: '',
				state: '',
				city: '',
				message: ''
			});
		

			errors.set({});

		},
		onError(error) {
			toast.error(error.message || 'Failed to submit enquiry. Please try again.');
		}
	});

	async function submitForm() {
        const isPhoneValid = validatePhone();
        const currentFormData = $formData as FormSchema;

        if (!isPhoneValid) {
            return;
        }

		try {
			const validationResult = formSchema.safeParse(currentFormData);
			if (!validationResult.success) {
				errors.set(validationResult.error.flatten().fieldErrors);
				return;
			}
			errors.set({});
			$submitMutation.mutate(currentFormData);
		} catch (error) {
			console.error('Form submission error:', error);
			toast.error('An unexpected error occurred. Please try again.');
		}
	}

	function handleClickOutside(event) {
    setTimeout(() => {
        if (
            !event.target.closest(".country-dropdown") &&
            !event.target.closest(".state-dropdown") &&
            !event.target.closest(".city-dropdown") &&
            !event.target.closest("input") // Prevent closing when clicking inside input fields
        ) {
            isCountryOpen = false;
            isStateOpen = false;
            isCityOpen = false;
        }
    }, 0);
}

	onMount(() => {
	if (browser) {
		loadCountries();
		document.addEventListener("click", handleClickOutside);
	}
});

onDestroy(() => {
	if (browser) {
		document.removeEventListener("click", handleClickOutside);
	}
});
</script>

<main
	class="flex flex-col items-center justify-center px-5 py-5 lg:flex-row lg:items-start lg:justify-normal lg:px-10"
>
	<section class="w-full lg:w-3/4">
		<div class="flex flex-col gap-3 md:gap-6">
			<p class="text-center font-sans text-sm font-medium text-[#178490] lg:text-left lg:text-base">
				Adaptable App
			</p>
			<h1
				class="text-center text-3xl font-bold leading-tight text-[#252525] lg:text-left lg:text-5xl"
			>
				Flexible for all types of <br /> hospitals
			</h1>
		</div>

		<div class="">
			<div class="mt-10 lg:w-[90%]">
				<div class=" flex flex-col gap-2 md:flex-row md:gap-0">
					<div
						class="p-5 md:w-1/2"
						style="background: linear-gradient(-1deg, #FFFFFF 60.39%, #F3F9F9 100%) padding-box,
            linear-gradient(1deg, #FFFFFF 1%, #44A7B2 422.76%) border-box;
    "
					>
						<p
							class="w-fit rounded-lg bg-[#F5F6F7] px-3 py-2 font-sans text-lg font-medium text-[#178490]"
						>
							Type 1
						</p>
						<div class="mt-5">
							<div class="flex items-center gap-8">
								<img src="/icons/tic.svg" class="h-5 w-5" alt="" />
								<p class="text-2xl tracking-wide text-[#05003893] lg:text-3xl">Single Doctor</p>
							</div>
						</div>
					</div>
					<div
						class="p-5 md:w-1/2"
						style="background: linear-gradient(-1deg, #FFFFFF 60.39%, #F3F9F9 100%) padding-box,
            linear-gradient(1deg, #FFFFFF 1%, #44A7B2 422.76%) border-box;
    "
					>
						<p
							class="w-fit rounded-lg bg-[#F5F6F7] px-3 py-2 font-sans text-lg font-medium text-[#178490]"
						>
							Type 2
						</p>
						<div class="mt-5 flex flex-col gap-2 md:gap-8">
							<div class="flex items-center gap-8">
								<img src="/icons/tic.svg" class="h-5 w-5" alt="" />
								<p class="text-2xl tracking-wide text-[#05003893] lg:text-3xl">Single Doctor</p>
							</div>
							<div class="flex items-center gap-8">
								<img src="/icons/tic.svg" class="h-5 w-5" alt="" />
								<p class="text-2xl tracking-wide text-[#05003893] lg:text-3xl">Single Reception</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="mt-0 md:mt-16 lg:w-[90%]">
				<div class="flex flex-col gap-2 md:flex-row md:gap-0">
					<div
						class="p-5 md:w-1/2"
						style="background: linear-gradient(-1deg, #FFFFFF 60.39%, #F3F9F9 100%) padding-box,
                linear-gradient(1deg, #FFFFFF 1%, #44A7B2 422.76%) border-box;
        "
					>
						<p
							class="w-fit rounded-lg bg-[#F5F6F7] px-3 py-2 font-sans text-lg font-medium text-[#178490]"
						>
							Type 3
						</p>
						<div class="mt-5 flex flex-col gap-2 md:gap-8">
							<div class="flex items-center gap-8">
								<img src="/icons/tic.svg" class="h-5 w-5" alt="" />
								<p class="text-2xl tracking-wide text-[#05003893] lg:text-3xl">Multiple Doctors</p>
							</div>
							<div class="flex items-center gap-8">
								<img src="/icons/tic.svg" class="h-5 w-5" alt="" />
								<p class="text-2xl tracking-wide text-[#05003893] lg:text-3xl">Single Reception</p>
							</div>
							<div class="flex items-center gap-8">
								<img src="/icons/tic.svg" class="h-5 w-5" alt="" />
								<p class="text-2xl tracking-wide text-[#05003893] lg:text-3xl">
									Multiple Departments
								</p>
							</div>
							
						</div>
					</div>
					<div
						class="p-5 md:w-1/2"
						style="background: linear-gradient(-1deg, #FFFFFF 60.39%, #F3F9F9 100%) padding-box,
                linear-gradient(1deg, #FFFFFF 1%, #44A7B2 422.76%) border-box;
        "
					>
						<p
							class="w-fit rounded-lg bg-[#F5F6F7] px-3 py-2 font-sans text-lg font-medium text-[#178490]"
						>
							Type 4
						</p>
						<div class="mt-5 flex flex-col md:gap-8 gap-2">
							<div class="flex items-center gap-8">
								<img src="/icons/tic.svg" class="h-5 w-5" alt="" />
								<p class="text-2xl tracking-wide text-[#05003893] lg:text-3xl">Multiple Doctors</p>
							</div>
							<div class="flex items-center gap-8">
								<img src="/icons/tic.svg" class="h-5 w-5" alt="" />
								<p class="text-2xl tracking-wide text-[#05003893] lg:text-3xl">
									Multiple Receptions
								</p>
							</div>
							<div class="flex items-center gap-8">
								<img src="/icons/tic.svg" class="h-5 w-5" alt="" />
								<p class="text-2xl tracking-wide text-[#05003893] lg:text-3xl">
									Multiple Departments
								</p>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<section class="mt-10 flex justify-center md:mt-20 md:w-3/4 w-full lg:mt-0 lg:w-2/5 lg:justify-end">
		<div class="w-full rounded-lg border border-[#DFE3E8] bg-[#F3F9F9] p-5">
			<h1 class="text-xl font-semibold md:text-2xl">Enquiry Form</h1>
			<div class="mx-auto rounded-lg py-6">
				<div class="grid grid-cols-1 gap-4">
					<div>
						<label for="name" class="text-base font-medium text-[#6B7888]"
							>Full Name <span class="text-red-500">*</span></label
						>
						<input
							id="name"
							type="text"
							bind:value={$formData.name}
							on:input={(e) => handleInput('name', e)}
							class="input"
							placeholder="Enter your full name"
						/>
						<p class="text-sm text-red-500" class:invisible={!$errors.name}>{$errors.name?.[0]}</p>
					</div>

                    <div>
                        <label for="phone" class="block text-base font-medium text-[#6B7888]">
                            Phone Number <span class="text-red-500">*</span>
                        </label>
						<Mobile bind:this={mobileComponent} />
                        <!-- {#if phoneError || $errors.phone}
                            <p class="text-sm text-red-500">{phoneError || $errors.phone?.[0]}</p>
                        {/if} -->
                    </div>

					<div>
						<label for="email" class="text-base font-medium text-[#6B7888]"
							>Email ID <span class="text-red-500">*</span></label
						>
						<input
							id="email"
							type="email"
							bind:value={$formData.email}
							on:input={(e) => handleInput('email', e)}
							class="input"
							placeholder="Enter your email"
						/>
						<p class="text-sm text-red-500" class:invisible={!$errors.email}>
							{$errors.email?.[0]}
						</p>
					</div>

					<div>
						<label for="hospitalName" class="text-base font-medium text-[#6B7888]"
							>Hospital Name <span class="text-red-500">*</span></label
						>
						<input
							id="hospitalName"
							type="text"
							bind:value={$formData.hospitalName}
							on:input={(e) => handleInput('hospitalName', e)}
							class="input"
							placeholder="Enter hospital name"
						/>
						<p class="text-sm text-red-500" class:invisible={!$errors.hospitalName}>
							{$errors.hospitalName?.[0]}
						</p>
					</div>

					<div>
						<label for="hospitalType" class="text-base font-medium text-[#6B7888]"
							>Hospital Type <span class="text-red-500">*</span></label
						>
						<select id="hospitalType" bind:value={$formData.hospitalType} class="input">
							<option value="" disabled selected>--</option>
							{#each hospitalTypes as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</div>
					<!-- Country Select with Search -->
					<div class=" relative">
						<label for="country">Country <span class="text-red-500">*</span></label>
						<div class="relative">
							<input
								type="text"
								class="input"
								placeholder="Search country"
								bind:value={countrySearchTerm}
								on:focus={() => (isCountryOpen = true,isCityOpen=false,isStateOpen=false)}
							/>
							{#if isCountryOpen}
								<div class="select-dropdown country-dropdown">
									{#if filteredCountries.length === 0}
										<div class="option">No countries found</div>
									{:else}
										{#each filteredCountries as country}
											<!-- svelte-ignore a11y_click_events_have_key_events -->
											<!-- svelte-ignore a11y_no_static_element_interactions -->
											<div class="option" on:click={() => selectCountry(country)}>
												{country.name}
											</div>
										{/each}
									{/if}
								</div>
							{/if}
						</div>
					</div>
					<!-- State Select with Search -->
					{#if selectedCountry}
						<div class=" relative">
							<label for="state">State</label>
							<div class="relative">
								<input
									type="text"
									class="input"
									placeholder="Search state"
									bind:value={stateSearchTerm}
									on:focus={() => (isStateOpen = true,isCityOpen=false,isCountryOpen=false)}
								/>
								{#if isStateOpen}
									<div class="select-dropdown state-dropdown">
										{#if filteredStates.length === 0}
											<div class="option">No states found</div>
										{:else}
											{#each filteredStates as state}
												<!-- svelte-ignore a11y_click_events_have_key_events -->
												<!-- svelte-ignore a11y_no_static_element_interactions -->
												<div class="option" on:click={() => selectState(state)}>
													{state.name}
												</div>
											{/each}
										{/if}
									</div>
								{/if}
							</div>
						</div>
					{/if}
					<!-- City Select with Search -->
					{#if selectedState}
						<div class=" relative">
							<label for="city">City</label>
							<div class="relative">
								<input
									type="text"
									class="input"
									placeholder="Search city"
									bind:value={citySearchTerm}
									on:focus={() => (isCityOpen = true,isCountryOpen=false,isStateOpen=false)}
								/>
								{#if isCityOpen}
									<div class="select-dropdown city-dropdown">
										{#if filteredCities.length === 0}
											<div class="option">No cities found</div>
										{:else}
											{#each filteredCities as city}
												<!-- svelte-ignore a11y_click_events_have_key_events -->
												<!-- svelte-ignore a11y_no_static_element_interactions -->
												<div class="option" on:click={() => selectCity(city)}>
													{city.name}
												</div>
											{/each}
										{/if}
									</div>
								{/if}
							</div>
						</div>
					{/if}

					<div>
						<label for="message" class="block text-base font-medium text-[#6B7888]"
							>Message <span class="text-red-500">*</span></label
						>
						<textarea
							id="message"
							bind:value={$formData.message}
							on:input={(e) => handleInput('message', e)}
							class="input h-24"
							placeholder="Enter your message"
						></textarea>
						<p class="text-sm text-red-500" class:invisible={!$errors.message}>
							{$errors.message?.[0]}
						</p>
					</div>

					<div class="flex justify-end">
						<button
							on:click={submitForm}
							class={`w-fit rounded-xl bg-[#178490] px-5 py-2 font-medium text-white ${$submitMutation.isPending?'cursor-not-allowed':'cursor-pointer'}`}
						>
						{#if $submitMutation.isPending}
						<div class="flex gap-2">
  <Icon icon="line-md:loading-twotone-loop" class="text-2xl" />
  <span>Submitting...</span>

						</div>
{:else}
  Submit
{/if}
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>

<style>

	.input {
		width: 100%;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 6px;
		outline: none;
		transition: border-color 0.2s;
	}

	.input:focus {
		border-color: #1d4ed8;
	}

	.select-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: white;
		border: 1px solid #ccc;
		border-radius: 4px;
		max-height: 200px;
		overflow-y: auto;
		z-index: 1000;
	}

	.option {
		padding: 8px;
		cursor: pointer;
	}

	.option:hover {
		background: #f0f0f0;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: #6b7888;
		font-size: 1rem;
		font-weight: 500;
	}
</style>
