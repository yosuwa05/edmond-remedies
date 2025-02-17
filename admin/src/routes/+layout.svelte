<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import { goto } from '$app/navigation';
	import { baseUrl } from '$lib/config';
	import { queryClient } from '$lib/query-client';
	import { writableGlobalStore } from '$lib/stores/global-store';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-sonner';

	onMount(() => {
		// if (!localStorage.getItem('restaurent')) {
		// 	goto('/');
		// }
		// $writableGlobalStore.adminDetails = JSON.parse(localStorage.getItem('restaurent') || '{}');
		// $writableGlobalStore.isManager = JSON.parse(localStorage.getItem('isManager') || 'false');
	});
</script>

<Toaster position="top-right" />
<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
