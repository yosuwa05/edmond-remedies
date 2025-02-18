<script lang="ts">
	import { onMount,onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { _axios } from '$lib/_axios';
	import { createQuery, createMutation } from '@tanstack/svelte-query';
	import { tick } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Paginator from '$lib/components/paginator.svelte';
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { toast } from 'svelte-sonner';
	import Icon from '@iconify/svelte';
	
	let page = 1;
	let limit = 10;
	let search = '';
	let selectedEnquiry = null;
	let isDialogOpen = false;
	let filterStatus = "";
	let filterIsOpen = false;
	
	const statusOptions = [
		{ value: '', label: 'All' },
	  { value: 'pending', label: 'Pending' },
	  { value: 'follow-up', label: 'Follow Up' },
	  { value: 'closed', label: 'Closed' }
	];
  
	const query = createQuery({
	  queryKey: ['enquiries', page, search, filterStatus],
	  queryFn: () => _axios.get(`/enquiryForm/?page=${page}&limit=${limit}&q=${search}&status=${filterStatus}`).then(res => res.data),
	  refetchOnWindowFocus: true,
	  refetchOnMount: true,
	  refetchOnReconnect: true,
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
		const filterDropdown = document.getElementById("filter-dropdown");
		const filterButton = document.getElementById("filter-button");
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
		document.addEventListener("click", handleClickOutside);
	});

	onDestroy(() => {
		document.removeEventListener("click", handleClickOutside);
	});
  </script>
  
  <div class="mt-6 text-maintext w-[calc(100vw-420px)] font-pt mx-auto overflow-auto ">
	<div class="flex justify-end mb-5">
		<Select.Root onValueChange={handleStatusFilter} type="single" bind:value={filterStatus}>
			<Select.Trigger class="w-[180px] border-[#207f8a] focus:ring-0 border rounded-lg px-2 py-1 text-sm bg-[#51949c15] font-medium">
			  {#if filterStatus === ""} 
				Select Status
			  {:else}
				{#if filterStatus === "pending"}
				  Pending
				{:else if filterStatus === "follow-up"}
				  Follow Up
				{:else if filterStatus === "closed"}
				  Closed
				{/if}
			  {/if}
			</Select.Trigger>
			<Select.Content>
			  <Select.Group>
				{#each statusOptions as option}
				  <Select.Item value={option.value}   label={option.label}>
					{option.label}
				  </Select.Item>
				{/each}
			  </Select.Group>
			</Select.Content>
		  </Select.Root>
	</div>
	<div class="overflow-x-auto  h-[calc(100vh-230px)] overflow-y-auto hidescrollbarthumb">
		
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
			<TableHead class="font-bold text-black relative">Status</TableHead>
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
			  <TableCell colspan="9" class="text-center text-xs py-4">No Enquiries Found!</TableCell>
			</TableRow>
		  {:else}
			{#each $query.data?.data || [] as enquiry, i}
			  <TableRow on:click={() => openDialog(enquiry)} class="cursor-pointer hover:bg-neutral-200/60">
				<TableCell>{i + 1 + (page - 1) * limit}</TableCell>
				<TableCell>{enquiry.name}</TableCell>
				<TableCell>{enquiry.phone}</TableCell>
				<TableCell>{enquiry.email}</TableCell>
				<TableCell>{enquiry.hospitalName}</TableCell>
				<TableCell>
				  {`${enquiry.city ? `${enquiry.city}, ` : ''}${enquiry.state ? `${enquiry.state}, ` : ''}${enquiry.country}`}
				</TableCell>
				<TableCell class="line-clamp-2 overflow-hidden max-h-[3.5rem]">{enquiry.message}</TableCell>
				<TableCell>
				  <Badge class={` 
					${enquiry.status === "pending" ? "bg-yellow-500 hover:bg-yellow-500 text-black hover:scale-105 transition-all duration-300" : ""}
					${enquiry.status === "follow-up" ? "bg-[#178490] hover:bg-[#178490] hover:scale-105 transition-all duration-300 text-white text-nowrap" : ""}
					${enquiry.status === "closed" ? "bg-green-700 hover:bg-green-700 hover:scale-105 transition-all duration-300 text-white" : ""}
				  capitalize`}>
					{enquiry.status}
				  </Badge>
				</TableCell>
				<TableCell>{new Date(enquiry.createdAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</TableCell>
			  </TableRow>
			{/each}
		  {/if}
		</TableBody>
	  </Table>
	  <Dialog.Root bind:open={isDialogOpen} on:openChange={closeDialog}>
		<Dialog.Content class="max-w-[800px] max-h-[80%] overflow-y-scroll px-10">
		  <Dialog.Header class="">
			<Dialog.Title class="flex justify-between items-center">
			  <div>
				Enquiry Details 
			  </div> 
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
						selectedEnquiry.status === "pending" ? "bg-yellow-100 border-yellow-500" :
						selectedEnquiry.status === "follow-up" ? "bg-[#27ddf1b7] border-[#178490]" :
						"bg-green-100 border-green-700"
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
					<td class="font-semibold px-6 py-4 border border-gray-300">Name</td>
					<td class="px-6 py-4 border border-gray-300">{selectedEnquiry.name}</td>
				  </tr>
				  <tr>
					<td class="font-semibold px-6 py-4 border border-gray-300">Phone</td>
					<td class="px-6 py-4 border border-gray-300">{selectedEnquiry.phone}</td>
				  </tr>
				  <tr>
					<td class="font-semibold px-6 py-4 border border-gray-300">Email</td>
					<td class="px-6 py-4 border border-gray-300">{selectedEnquiry.email}</td>
				  </tr>
				  <tr>
					<td class="font-semibold px-6 py-4 border border-gray-300">Hospital</td>
					<td class="px-6 py-4 border border-gray-300">{selectedEnquiry.hospitalName}</td>
				  </tr>
				  <tr>
					<td class="font-semibold px-6 py-4 border text-nowrap border-gray-300">Hospital Type</td>
					<td class="px-6 py-4 border border-gray-300">{selectedEnquiry.hospitalType}</td>
				  </tr>
				  <tr>
					<td class="font-semibold px-6 py-4 border border-gray-300">Location</td>
					<td class="px-6 py-4 border border-gray-300">
					  {selectedEnquiry.city ? `${selectedEnquiry.city}, ` : ''}
					  {selectedEnquiry.state ? `${selectedEnquiry.state}, ` : ''}
					  {selectedEnquiry.country}
					</td>
				  </tr>
				  <tr>
					<td class="font-semibold px-6 py-4 border border-gray-300">Message</td>
					<td class="px-6 py-4 border border-gray-300">{selectedEnquiry.message}</td>
				  </tr>
				  <tr>
					<td class="font-semibold px-6 py-4 border text-nowrap border-gray-300">Created At</td>
					<td class="px-6 py-4 border border-gray-300">
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
  