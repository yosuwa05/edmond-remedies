<script lang="ts">
	import { Pagination } from 'flowbite-svelte';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
  
	type Props = {
	  total: number;
	  limit: number;
	  page: number;
	  callback: (page: number) => void;
	  showTotal?: boolean;
	};
  
	let { total, limit, page, callback, showTotal = true }: Props = $props();
  
	let start = $derived((page - 1) * limit + 1);
	let end = $derived(Math.min(page * limit, total));
  </script>
  
  <Pagination
	class="mt-4"
	currentPage={page}
	totalPages={Math.ceil(total / limit)}
	onPageChange={(_page) => {
	  if (_page === page) return;
	  page = _page;
	  callback(page);
	}}
  >
	<div class="flex items-center justify-between w-full">
	  <!-- Left Side - Previous Button -->
	  <Pagination.PrevButton class="flex items-center justify-center text-zinc-900">
		<ChevronLeft class="size-4" />
		<span class="hidden sm:block">Previous</span>
	  </Pagination.PrevButton>
  
	  <!-- Page Numbers and Ellipsis -->
	  <Pagination.Content class="flex items-center justify-center text-zinc-900">
		{#each pages as page (page.key)}
		  {#if page.type === 'ellipsis'}
			<Pagination.Item>
			  <span class="text-sm text-zinc-900">...</span>
			</Pagination.Item>
		  {:else}
			<Pagination.Item>
			  <Pagination.Link {page} isActive={currentPage === page.value}>
				{page.value}
			  </Pagination.Link>
			</Pagination.Item>
		  {/if}
		{/each}
	  </Pagination.Content>
  
	  <!-- Right Side - Next Button -->
	  <Pagination.NextButton class="flex items-center justify-center text-zinc-900">
		<span class="hidden sm:block">Next</span>
		<ChevronRight class="size-4" />
	  </Pagination.NextButton>
	</div>
  
	{#if showTotal}
	  <div class="text-sm text-zinc-900">
		{start} - {end} of {total}
	  </div>
	{/if}
  </Pagination>
  