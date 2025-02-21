<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { writableGlobalStore } from '$lib/stores/global-store';
	import Icon from '@iconify/svelte';

	const routes = $state([
		{
			type: 'heading',
			name: 'Dashboard'
		},
		{
			name: 'Dashboard',
			href: '/dashboard/',
			icon: 'uil:analysis',
			subRoutes: '-',
			canManagerAccess: true
		},
		{
			name: 'Enquiries',
			href: '/dashboard/enquiry/',
			icon: 'ic:baseline-insert-comment',
			subRoutes: '-',
			canManagerAccess: true
		},
	]);
</script>

<div
	class="hidden bg-[#F3F9F9] border-[#178490] min-w-[300px] max-w-[300px] border-r-[2px]  md:block h-screen text-zinc-900 font-pt hidescrollbarthumb"
>
	<div
		class="flex flex-col justify-between h-[calc(100vh)] overflow-y-auto gap-2 hidescrollbarthumb"
	>
		<button onclick={() => goto('/dashboard')}>
			<div
				class="border-b-[2px] border-[#178490] min-h-[50px] cursor-pointer flex gap-2 justify-center items-center"
			>
				<!-- <Icon icon="fa-solid:chess-king" class="text-2xl" /> -->
				<h1 class="text-2xl font-bold p-4 text-center">Edmond Remedis</h1>
			</div>
		</button>

		<nav class="flex flex-col items-start text-sm px-4 h-full">
			{#each routes as route}
				{#if route.type === 'heading'}
					<h2 class="text-md text-zinc-800 font-bold mt-2 mb-2">{route.name}</h2>
				{:else}
					<div class="w-full rounded-md">
						<button
							class="w-full py-1"
							onclick={() => {
								if (route.href) goto(route.href);
							}}
						>
							<div
								class={`flex cursor-pointer items-center justify-start rounded-md p-2 group ${
									$page.url.pathname === route.href ||
									(route.href !== '/dashboard/' &&
										$page.url.pathname.startsWith(route.href ?? ''))
										? 'bg-gradient-to-r from-[#17a2b8] to-[#178490] text-white font-bold'
										: 'text-zinc-600'
								}`}
							>
								<Icon
									icon={route.icon ?? ''}
									class="mr-2 h-6 w-6 group-[.bg-gradient-to-r]:text-white group-[.bg-gradient-to-r]:font-bold text-gray-600"
								/>
								<p
									class="text-md flex items-center gap-3 rounded-lg px-3 font-normal group-text-zinc-900"
								>
									{route.name}
								</p>
							</div>
						</button>
					</div>
				{/if}
			{/each}

			<!-- <button
				class="w-full py-1 mt-auto"
				onclick={() => goto('/hidden-admin-base-007/dashboard/settings')}
			>
				<div
					class={`flex cursor-pointer items-center my-2 bg-zinc-300 text-zinc-800 font-bold justify-start rounded-md p-2`}
				>
					<Icon icon={'uil:setting'} class="mr-2 h-6 w-6 text-zinc-800" />
					<p class="text-md flex text-zinc-800 items-center gap-3 rounded-lg px-3 font-normal">
						Settings
					</p>
					<Icon icon={'ep:arrow-right-bold'} class="ml-auto h-4 w-4 text-zinc-800 " />
				</div>
			</button> -->
		</nav>
	</div>
</div>
