<script lang="ts">
	import { _axios } from '$lib/_axios';
	import Paginator from '$lib/components/paginator.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { createQuery } from '@tanstack/svelte-query';
	import { onDestroy, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let page = 1;
	let limit = 7;
	let search = '';
	let selectedEnquiry = null;
	let isDialogOpen = false;
	let filterStatus = '';
	let filterIsOpen = false;

	const statusOptions = [
		{ value: '', label: 'All' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'follow-up', label: 'Follow Up' },
		{ value: 'closed', label: 'Closed' }
	];

	const query = createQuery({
		queryKey: ['enquiries', page, search, filterStatus],
		queryFn: () =>
			_axios
				.get(`/enquiryForm/?page=${page}&limit=${limit}&q=${search}&status=${filterStatus}`)
				.then((res) => res.data),
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		refetchOnReconnect: true
	});

	function openDialog(enquiry) {
		selectedEnquiry = enquiry;
		isDialogOpen = true;
	}

	function closeDialog() {
		isDialogOpen = false;
		selectedEnquiry = null;
	}

	async function updateStatus(newStatus: string) {
		if (!newStatus) return;
		if (selectedEnquiry.status === 'closed') {
			toast('Closed enquiries cannot be modified');
			return;
		}
		try {
			await _axios.put(`/enquiryForm/${selectedEnquiry._id}/status`, {
				status: newStatus
			});
			toast.success('Enquiry status updated successfully');
			selectedEnquiry.status = newStatus;
			query.refetch();
		} catch (error) {
			toast.error('Failed to update enquiry status');
		}
	}

	function handleStatusFilter(status: string) {
		filterStatus = status;
		filterIsOpen = false;
		$query.refetch();
	}

	function filterToggle() {
		filterIsOpen = !filterIsOpen;
	}
	function handleClickOutside(event: MouseEvent) {
		// Check if the click is outside the filter dropdown
		const filterDropdown = document.getElementById('filter-dropdown');
		const filterButton = document.getElementById('filter-button');
		if (
			filterDropdown &&
			!filterDropdown.contains(event.target as Node) &&
			filterButton &&
			!filterButton.contains(event.target as Node)
		) {
			filterIsOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
	});
</script>

<div class="text-maintext font-pt mx-auto mt-6 w-[calc(100vw-420px)] overflow-auto">
	<div class="mb-5 flex justify-end">
		<Select.Root onValueChange={handleStatusFilter} type="single" bind:value={filterStatus}>
			<Select.Trigger
				class="w-[180px] rounded-lg border border-[#207f8a] bg-[#51949c15] px-2 py-1 text-sm font-medium focus:ring-0"
			>
				{#if filterStatus === ''}
					Select Status
				{:else if filterStatus === 'pending'}
					Pending
				{:else if filterStatus === 'follow-up'}
					Follow Up
				{:else if filterStatus === 'closed'}
					Closed
				{/if}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each statusOptions as option}
						<Select.Item value={option.value} label={option.label}>
							{option.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
	<div class="hidescrollbarthumb h-[calc(100vh-230px)] overflow-x-auto overflow-y-auto">
		<Table class="">
			<TableHeader class="relative">
				<TableRow>
					<TableHead class="font-bold text-black">Sl.No</TableHead>
					<TableHead class="font-bold text-black">Name</TableHead>
					<TableHead class="font-bold text-black">Phone</TableHead>
					<TableHead class="font-bold text-black">Email</TableHead>
					<TableHead class="font-bold text-black">Hospital Name</TableHead>
					<TableHead class="font-bold text-black">Location</TableHead>
					<TableHead class="font-bold text-black">Message</TableHead>
					<TableHead class="relative font-bold text-black">Status</TableHead>
					<TableHead class="font-bold text-black">Created At</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#if $query.isLoading || $query.isRefetching}
					{#each Array(limit) as _, i}
						<TableRow>
							<TableCell colspan="9"><Skeleton class="h-9 w-full" /></TableCell>
						</TableRow>
					{/each}
				{:else if $query?.data?.data.length === 0}
					<TableRow>
						<TableCell colspan="9" class="py-4 text-center text-xs">No Enquiries Found!</TableCell>
					</TableRow>
				{:else}
					{#each $query.data?.data || [] as enquiry, i}
						<TableRow
							on:click={() => openDialog(enquiry)}
							class="cursor-pointer hover:bg-neutral-200/60"
						>
							<TableCell>{i + 1 + (page - 1) * limit}</TableCell>
							<TableCell>{enquiry.name}</TableCell>
							<TableCell>{enquiry.phone}</TableCell>
							<TableCell>{enquiry.email}</TableCell>
							<TableCell>{enquiry.hospitalName}</TableCell>
							<TableCell>
								{`${enquiry.city ? `${enquiry.city}, ` : ''}${enquiry.state ? `${enquiry.state}, ` : ''}${enquiry.country}`}
							</TableCell>
							<TableCell class="line-clamp-2 max-h-[3.5rem] overflow-hidden"
								>{enquiry.message}</TableCell
							>
							<TableCell>
								<Badge
									class={` 
					${enquiry.status === 'pending' ? 'bg-yellow-500 text-black transition-all duration-300 hover:scale-105 hover:bg-yellow-500' : ''}
					${enquiry.status === 'follow-up' ? 'text-nowrap bg-[#178490] text-white transition-all duration-300 hover:scale-105 hover:bg-[#178490]' : ''}
					${enquiry.status === 'closed' ? 'bg-green-700 text-white transition-all duration-300 hover:scale-105 hover:bg-green-700' : ''}
				  capitalize`}
								>
									{enquiry.status}
								</Badge>
							</TableCell>
							<TableCell
								>{new Date(enquiry.createdAt).toLocaleString('en-GB', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									hour12: true
								})}</TableCell
							>
						</TableRow>
					{/each}
				{/if}
			</TableBody>
		</Table>
		<Dialog.Root bind:open={isDialogOpen} on:openChange={closeDialog}>
			<Dialog.Content class="max-h-[80%] max-w-[800px] overflow-y-scroll px-10">
				<Dialog.Header class="">
					<Dialog.Title class="flex items-center justify-between">
						<div>Enquiry Details</div>
						<div class="pr-10">
							{#if selectedEnquiry}
								<Select.Root
									type="single"
									value={selectedEnquiry.status}
									onValueChange={(value) => updateStatus(value)}
									disabled={selectedEnquiry.status === 'closed'}
								>
									<Select.Trigger
										class={`w-[120px] ${
											selectedEnquiry.status === 'pending'
												? 'border-yellow-500 bg-yellow-100'
												: selectedEnquiry.status === 'follow-up'
													? 'border-[#178490] bg-[#27ddf1b7]'
													: 'border-green-700 bg-green-100'
										} capitalize focus:ring-0`}
									>
										{selectedEnquiry.status}
									</Select.Trigger>
									<Select.Content>
										{#each statusOptions as option}
											<Select.Item
												value={option.value}
												disabled={selectedEnquiry.status === 'closed'}
											>
												{option.label}
											</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							{/if}
						</div>
					</Dialog.Title>
				</Dialog.Header>

				{#if selectedEnquiry}
					<div class="py-4">
						<table class="min-w-full table-auto border-collapse border border-gray-300">
							<tbody>
								<tr class="">
									<td class="border border-gray-300 px-6 py-4 font-semibold">Name</td>
									<td class="border border-gray-300 px-6 py-4">{selectedEnquiry.name}</td>
								</tr>
								<tr>
									<td class="border border-gray-300 px-6 py-4 font-semibold">Phone</td>
									<td class="border border-gray-300 px-6 py-4">{selectedEnquiry.phone}</td>
								</tr>
								<tr>
									<td class="border border-gray-300 px-6 py-4 font-semibold">Email</td>
									<td class="border border-gray-300 px-6 py-4">{selectedEnquiry.email}</td>
								</tr>
								<tr>
									<td class="border border-gray-300 px-6 py-4 font-semibold">Hospital</td>
									<td class="border border-gray-300 px-6 py-4">{selectedEnquiry.hospitalName}</td>
								</tr>
								<tr>
									<td class="text-nowrap border border-gray-300 px-6 py-4 font-semibold"
										>Hospital Type</td
									>
									<td class="border border-gray-300 px-6 py-4">{selectedEnquiry.hospitalType}</td>
								</tr>
								<tr>
									<td class="border border-gray-300 px-6 py-4 font-semibold">Location</td>
									<td class="border border-gray-300 px-6 py-4">
										{selectedEnquiry.city ? `${selectedEnquiry.city}, ` : ''}
										{selectedEnquiry.state ? `${selectedEnquiry.state}, ` : ''}
										{selectedEnquiry.country}
									</td>
								</tr>
								<tr>
									<td class="border border-gray-300 px-6 py-4 font-semibold">Message</td>
									<td class="border border-gray-300 px-6 py-4">{selectedEnquiry.message}</td>
								</tr>
								<tr>
									<td class="text-nowrap border border-gray-300 px-6 py-4 font-semibold"
										>Created At</td
									>
									<td class="border border-gray-300 px-6 py-4">
										{new Date(selectedEnquiry.createdAt).toLocaleString('en-GB', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
											hour12: true
										})}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				{/if}
			</Dialog.Content>
		</Dialog.Root>
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
