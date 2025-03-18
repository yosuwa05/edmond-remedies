<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import { queryClient } from '$lib/query-client';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { Toaster } from 'svelte-sonner';
</script>

<Toaster position="top-right" />
<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
