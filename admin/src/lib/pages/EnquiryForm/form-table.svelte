<script lang="ts">
	import { goto } from '$app/navigation';
	import { _axios } from '$lib/_axios';
	import { createQuery } from '@tanstack/svelte-query';
	import { tick } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Paginator from '$lib/components/paginator.svelte';
	
	let page = 1;
	let limit = 10;
	let search = '';
  
	async function fetchEnquiries() {
	  const res = await _axios.get(`/enquiryForm/?page=${page}&limit=${limit}&q=${search}`);
	  return res.data;
	}
  
	let debounceTimeout: any;
	function debounceSearch() {
	  clearTimeout(debounceTimeout);
	  debounceTimeout = setTimeout(async () => {
		await tick();
		$query.refetch();
	  }, 500);
	}
  
	const query = createQuery({
	  queryKey: ['enquiries', page, search],
	  queryFn: () => fetchEnquiries()
	});
  </script>
  
  <div class="mt-6 text-maintext w-[calc(100vw-420px)] font-pt mx-auto overflow-auto">
	<div class="overflow-x-auto h-[calc(100vh-200px)] overflow-y-auto hidescrollbarthumb">
	  <Table>
		<TableHeader>
		  <TableRow>
			<TableHead>Sl.No</TableHead>
			<TableHead>Name</TableHead>
			<TableHead>Phone</TableHead>
			<TableHead>Email</TableHead>
			<TableHead>Hospital Name</TableHead>
			<TableHead>City</TableHead>
			<TableHead>Message</TableHead>
			<TableHead>Created At</TableHead>
		  </TableRow>
		</TableHeader>
		<TableBody>
		  {#if $query.isLoading || $query.isRefetching}
			{#each Array(limit) as _, i}
			  <TableRow>
				<TableCell colspan="8"><Skeleton class="h-5 w-full" /></TableCell>
			  </TableRow>
			{/each}
		  {:else if $query?.data?.data.length === 0}
			<TableRow>
			  <TableCell colspan="8" class="text-center text-xs py-4">No Enquiries Found!</TableCell>
			</TableRow>
		  {:else}
			{#each $query.data?.data || [] as enquiry, i}
			  <TableRow>
				<TableCell>{i + 1 + (page - 1) * limit}</TableCell>
				<TableCell>{enquiry.name}</TableCell>
				<TableCell>{enquiry.phone}</TableCell>
				<TableCell>{enquiry.email}</TableCell>
				<TableCell>{enquiry.hospitalName}</TableCell>
				<TableCell>{enquiry.city}</TableCell>
				<TableCell>{enquiry.message}</TableCell>
				<TableCell>{new Date(enquiry.createdAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</TableCell>
			  </TableRow>
			{/each}
		  {/if}
		</TableBody>
	  </Table>
	</div>
  
	{#if !$query.isLoading && $query?.data?.pagination.total > 0}
	  <Paginator
		total={$query?.data?.pagination.total || 0}
		{limit}
		{page}
		callback={(_page: number) => {
		  if (_page === page) return;
		  page = _page;
		  $query.refetch();
		}}
	  />
	{/if}
  </div>
  