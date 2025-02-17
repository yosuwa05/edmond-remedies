<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { TelInput, clickOutsideAction, isSelected, normalizedCountries } from 'svelte-tel-input';
	import type {
		DetailedValue,
		CountrySelectEvents,
		CountryCode,
		E164Number,
		TelInputOptions,
		Country,
		PhoneNumber

	} from 'svelte-tel-input/types';
	import 'svelte-tel-input/styles/flags.css';
	import { isValid } from 'zod';

	export let clickOutside = true;
	export let closeOnClick = true;
	export let disabled = false;
	export let detailedValue: DetailedValue | null = null;
	export let value: E164Number | null = null;
	export let searchPlaceholder: string | null = 'Search';
	export let selectedCountry: CountryCode = 'IN'; // Set default to India
	export let valid: boolean = false;
	export let options: TelInputOptions = {
		initialCountry: 'IN', // Set initial country to India
		preferredCountries: ['IN'] // Set India as preferred country
	};

	// Get India's dial code for display
	const selectedCountryDialCode = normalizedCountries.find(country => country.iso2 === 'IN')?.dialCode || '91';
	
	let searchText = '';
	let isOpen = false;

	onMount(() => {
		// Ensure India is selected on mount
		if (!selectedCountry) {
			selectedCountry = 'IN';
			onChange('IN');
		}
	});

	// Rest of your code remains the same
	const toggleDropDown = (e?: Event) => {
		e?.preventDefault();
		if (disabled) return;
		isOpen = !isOpen;
	};

	const closeDropdown = (e?: Event) => {
		if (isOpen) {
			e?.preventDefault();
			isOpen = false;
			searchText = '';
		}
	};

	const selectClick = () => {
		if (closeOnClick) closeDropdown();
	};

	const closeOnClickOutside = () => {
		if (clickOutside) {
			closeDropdown();
		}
	};

	const sortCountries = (countries: Country[], text: string) => {
		const normalizedText = text.trim().toLowerCase();
		if (!normalizedText) {
			return countries.sort((a, b) => a.label.localeCompare(b.label));
		}
		return countries.sort((a, b) => {
			const aNameLower = a.name.toLowerCase();
			const bNameLower = b.name.toLowerCase();
			const aStartsWith = aNameLower.startsWith(normalizedText);
			const bStartsWith = bNameLower.startsWith(normalizedText);
			if (aStartsWith && !bStartsWith) return -1;
			if (!aStartsWith && bStartsWith) return 1;
			const aIndex = aNameLower.indexOf(normalizedText);
			const bIndex = bNameLower.indexOf(normalizedText);
			if (aIndex === -1 && bIndex === -1) return a.id.localeCompare(b.id);
			if (aIndex === -1) return 1;
			if (bIndex === -1) return -1;
			const aWeight = aIndex + (aStartsWith ? 0 : 1);
			const bWeight = bIndex + (bStartsWith ? 0 : 1);
			return aWeight - bWeight;
		});
	};

	const handleSelect = (val: CountryCode, e?: Event) => {
		if (disabled) return;
		e?.preventDefault();
		if (
			selectedCountry === undefined ||
			selectedCountry === null ||
			(typeof selectedCountry === typeof val && selectedCountry !== val)
		) {
			selectedCountry = val;
			onChange(val);
			selectClick();
		} else {
			dispatch('same', { option: val });
			selectClick();
		}
	};

	const dispatch = createEventDispatcher<CountrySelectEvents<CountryCode>>();

	const onChange = (selectedCountry: CountryCode) => {
		dispatch('change', { option: selectedCountry });
	};
</script>

<div
	class="flex relative rounded-[6px] {valid
		? ``
		: ` `}"
>
	<div class="flex" use:clickOutsideAction={closeOnClickOutside}>
		<button
			id="states-button"
			data-dropdown-toggle="dropdown-states"
			class="relative flex-shrink-0  overflow-hidden z-10 whitespace-nowrap inline-flex items-center  text-sm px-2 font-medium text-center text-gray-500 bg-transparent border border-[#ccc] rounded-l-[6px] hover:bg-gray-200 focus:outline-none"
			type="button"
			role="combobox"
			aria-controls="dropdown-countries"
			aria-expanded="false"
			aria-haspopup="false"
			on:click={toggleDropDown}
		>
			{#if selectedCountry && selectedCountry !== null}
				<div class="inline-flex items-center text-left">
					<!-- svelte-ignore element_invalid_self_closing_tag -->
					<span class="flag flag-{selectedCountry.toLowerCase()} flex-shrink-0 mr-3" />
					{#if options.format === 'national'}
						<span class="text-gray-600 ">+{selectedCountryDialCode}</span>
					{/if}
				</div>
			{/if}
			<svg
				aria-hidden="true"
				class="ml-1 w-4 h-4 {isOpen ? 'rotate-180' : ''}"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
		{#if isOpen}
			<div
				id="dropdown-countries"
				class="absolute z-10 max-w-fit bg-transparent rounded divide-y divide-gray-100 shadow  overflow-hidden translate-y-11"
				data-popper-reference-hidden=""
				data-popper-escaped=""
				data-popper-placement="bottom"
				aria-orientation="vertical"
				aria-labelledby="country-button"
				tabindex="-1"
			>
				<div
					class="text-sm text-gray-700 bg-white  max-h-48 overflow-y-auto"
					aria-labelledby="countries-button"
					role="listbox"
				>
					<input
						aria-autocomplete="list"
						type="text"
						class="px-4 py-2 border rounded-[6px] border-neutral-400 text-gray-900 focus:outline-none w-full sticky top-0"
						bind:value={searchText}
						placeholder={searchPlaceholder}
					/>
					{#each sortCountries(normalizedCountries, searchText) as country (country.id)}
						{@const isActive = isSelected(country.iso2, selectedCountry)}
						<div id="country-{country.iso2}" role="option" aria-selected={isActive}>
							<button
								value={country.iso2}
								type="button"
								class="inline-flex bg-white py-2 px-4 w-full text-sm hover:bg-gray-100  active:border  overflow-hidden
								{isActive ? ' bg-gray-100' : ' '}"
								on:click={(e) => {
									handleSelect(country.iso2, e);
								}}
							>
								<div class="inline-flex items-center text-left">
									<span class="flag flag-{country.iso2.toLowerCase()} flex-shrink-0 mr-3" />
									<span class="mr-2">{country.name}</span>
									<span class="text-gray-500">+{country.dialCode}</span>
								</div>
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<TelInput
on:input={()=>{
	sessionStorage.setItem('mobileProp', JSON.stringify({ PhoneNumber:value, country: selectedCountry,isValid:valid }));
}}
		bind:country={selectedCountry}
		bind:detailedValue
		bind:value
		bind:valid
		{options}
		required
		on:input={()=>{console.log(detailedValue)}}
		class="text-sm placeholder:text-neutral-400 rounded-r-[6px] block w-full p-2.5 focus:outline-none border border-[#ccc] border-l-0   bg-transparent  text-gray-900"
	/>
	   
</div>
{#if (value && value.length > 4 && !valid)}
    <p class="text-sm text-red-500">Please enter a valid Phone number</p>
{/if}