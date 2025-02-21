<script lang="ts">
	import { goto } from '$app/navigation';
	import { _axios } from '$lib/_axios';
	import { createMutation } from '@tanstack/svelte-query';
	import { onMount, onDestroy } from 'svelte';

	const logoutMutation = createMutation({
		mutationFn: () => _axios.post('/auth/logout'),
		onSuccess() {
			localStorage.removeItem('token');
			goto('/');
		}
	});

	let showDropdown = false;

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	function closeDropdown(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.dropdown-container')) {
			showDropdown = false;
		}
	}

	onMount(() => {
		window.addEventListener('click', closeDropdown);
	});

	onDestroy(() => {
		window.removeEventListener('click', closeDropdown);
	});

	function logout() {
		$logoutMutation.mutate();
	}
</script>

<div class="bg-[#F3F9F9] flex items-center justify-start min-h-[66px] border-b-[#178490] border-b-[2px]">
	<div class="ml-auto flex text-white gap-2 items-center relative dropdown-container">
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="relative pr-5 cursor-pointer" >
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<p onclick={toggleDropdown} class="rounded-full font-medium shadow-lg border w-10 h-10 flex text-white  bg-gradient-to-l from-[#17a2b8] to-[#178490] items-center justify-center">A</p>
		</div>

		{#if showDropdown}
			<div class="absolute right-2 mt-52 w-48 bg-white shadow-lg rounded-md py-2 z-50">
				<div class="px-4 py-2 text-gray-700 font-bold">Account</div>
				<hr />
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100" onclick={() => goto('/dashboard/settings')}>Settings</div>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100" onclick={logout}>Logout</div>
			</div>
		{/if}
	</div>
</div>
