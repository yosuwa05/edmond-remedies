<script>
    let config = {
        cUrl: 'https://api.countrystatecity.in/v1/countries',
        ckey: 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=='
    };

    let countries = [], states = [], cities = [];
    let selectedCountry = "", selectedState = "";

    async function loadCountries() {
        try {
            const response = await fetch(config.cUrl, { headers: { "X-CSCAPI-KEY": config.ckey } });
            countries = await response.json();
        } catch (error) {
            console.error('Error loading countries:', error);
        }
    }

    async function loadStates() {
        states = [];
        cities = [];
        if (!selectedCountry) return;

        try {
            const response = await fetch(`${config.cUrl}/${selectedCountry}/states`, { headers: { "X-CSCAPI-KEY": config.ckey } });
            states = await response.json();
        } catch (error) {
            console.error('Error loading states:', error);
        }
    }

    async function loadCities() {
        cities = [];
        if (!selectedCountry || !selectedState) return;

        try {
            const response = await fetch(`${config.cUrl}/${selectedCountry}/states/${selectedState}/cities`, { headers: { "X-CSCAPI-KEY": config.ckey } });
            cities = await response.json();
        } catch (error) {
            console.error('Error loading cities:', error);
        }
    }

    loadCountries();
</script>

<select bind:value={selectedCountry} on:change={loadStates}>
    <option value="">Select Country</option>
    {#each countries as country}
        <option value={country.iso2}>{country.name}</option>
    {/each}
</select>

<select bind:value={selectedState} on:change={loadCities} disabled={!selectedCountry}>
    <option value="">Select State</option>
    {#each states as state}
        <option value={state.iso2}>{state.name}</option>
    {/each}
</select>

<select disabled={!selectedState}>
    <option value="">Select City</option>
    {#each cities as city}
        <option value={city.name}>{city.name}</option>
    {/each}
</select>
