<script lang="ts">
	import { goto } from '$app/navigation';
	import { _axios } from '$lib/_axios';
	import { createMutation } from '@tanstack/svelte-query';
	import { onDestroy, onMount } from 'svelte';

	const logoutMutation = createMutation({
		mutationFn: () => _axios.post('/auth/logout'),
		onSuccess() {
			localStorage.removeItem('token');
			goto('/hidden-admin-base-007/');
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

<div
	class="flex min-h-[66px] items-center justify-start border-b-[2px] border-b-[#178490] bg-[#F3F9F9]"
>
	<div class="dropdown-container relative ml-auto flex items-center gap-2 text-white">
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="relative cursor-pointer pr-5">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<p
				onclick={toggleDropdown}
				class="flex h-10 w-10 items-center justify-center rounded-full border bg-gradient-to-l from-[#17a2b8] to-[#178490] font-medium text-white shadow-lg"
			>
				A
			</p>
		</div>

		{#if showDropdown}
			<div class="absolute right-2 z-50 mt-52 w-48 rounded-md bg-white py-2 shadow-lg">
				<div class="px-4 py-2 font-bold text-gray-700">Account</div>
				<hr />
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100"
					onclick={() => goto('/hidden-admin-base-007/dashboard/settings')}
				>
					Settings
				</div>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100" onclick={logout}>
					Logout
				</div>
			</div>
		{/if}
	</div>
</div>
