<script lang="ts">
	import '../app.css';
	import { queryClient } from '$lib/query-client';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { Toaster } from 'svelte-sonner';

	let { children } = $props();
</script>

<Toaster position="top-right" />
<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
