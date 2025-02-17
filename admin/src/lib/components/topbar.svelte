<script lang="ts">
	import { goto } from '$app/navigation';
	import { _axios } from '$lib/_axios';
	import { imgUrl } from '$lib/config';
	import { writableGlobalStore } from '$lib/stores/global-store';
	import { createMutation } from '@tanstack/svelte-query';

	const logoutMutation = createMutation({
		mutationFn: () => _axios.post('/auth/logout'),
		onSuccess() {
			localStorage.removeItem('token');
			goto('/');
		}
	});

	// Use `let` (already correct), but no need for reactivity operator `$`
	let showDropdown = false;

	function logout() {
		logoutMutation.mutate(); // Corrected `$logoutMutation` to `logoutMutation`
	}

	function closeDropdown(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.dropdown-container')) {
			showDropdown = false;
		}
	}

	// Attach event listener to close the dropdown when clicking outside
	window.addEventListener('click', closeDropdown);
</script>

<div class="bg-[#F3F9F9] flex items-center justify-start min-h-[66px] border-b-[#178490] border-b-[2px]">
	<div class="ml-auto flex text-white gap-2 items-center relative dropdown-container">
		<div class="relative pr-5 cursor-pointer" onClick={showDropdown = !showDropdown}>
			<p class="rounded-full font-medium shadow-lg border w-10 h-10 flex text-white  bg-gradient-to-l from-[#17a2b8] to-[#178490] items-center justify-center">A</p>
		</div>

		{#if showDropdown}
			<div class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
				<div class="px-4 py-2 text-gray-700 font-bold">Account</div>
				<hr />
				<div class="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => goto('/dashboard/settings')}>Settings</div>
				<div class="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100" onClick={logout}>Logout</div>
			</div>
		{/if}
	</div>
</div>
