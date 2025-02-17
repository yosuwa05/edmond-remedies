<script lang="ts">
	import { goto } from '$app/navigation';
	import { _axios } from '$lib/_axios';
	import Paginator from '$lib/components/paginator.svelte';
	import { Button } from 'flowbite-svelte';
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { tick } from 'svelte';

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
			<TableHead>
				<TableHeadCell>Sl.No</TableHeadCell>
				<TableHeadCell>Name</TableHeadCell>
				<TableHeadCell>Phone</TableHeadCell>
				<TableHeadCell>Email</TableHeadCell>
				<TableHeadCell>Hospital Name</TableHeadCell>
				<TableHeadCell>City</TableHeadCell>
				<TableHeadCell>Message</TableHeadCell>
				<TableHeadCell>Created At</TableHeadCell>
			</TableHead>

			{#if $query.isLoading || $query.isRefetching}
				<caption class="text-center py-4">Loading...</caption>
			{:else if $query?.data?.data.length === 0}
				<caption class="text-center py-4 text-gray-500">No Enquiries Found!</caption>
			{:else}
				<TableBody>
					{#each $query.data?.data || [] as enquiry, i}
						<TableBodyRow>
							<TableBodyCell>{i + 1 + (page - 1) * limit}</TableBodyCell>
							<TableBodyCell>{enquiry.name}</TableBodyCell>
							<TableBodyCell>{enquiry.phone}</TableBodyCell>
							<TableBodyCell>{enquiry.email}</TableBodyCell>
							<TableBodyCell>{enquiry.hospitalName}</TableBodyCell>
							<TableBodyCell>{enquiry.city}</TableBodyCell>
							<TableBodyCell>{enquiry.message}</TableBodyCell>
							<TableBodyCell>
								{new Date(enquiry.createdAt).toLocaleString('en-GB', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									hour12: true
								})}
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			{/if}
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
