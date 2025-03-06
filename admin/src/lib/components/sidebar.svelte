<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	const routes = $state([
		{
			type: 'heading',
			name: 'Dashboard'
		},
		{
			name: 'Dashboard',
			href: '/hidden-admin-base-007/dashboard/',
			icon: 'uil:analysis',
			subRoutes: '-',
			canManagerAccess: true
		},
		{
			name: 'Enquiries',
			href: '/hidden-admin-base-007/dashboard/enquiry/',
			icon: 'ic:baseline-insert-comment',
			subRoutes: '-',
			canManagerAccess: true
		}
	]);
</script>

<div
	class="font-pt hidescrollbarthumb hidden h-screen min-w-[300px] max-w-[300px] border-r-[2px] border-[#178490] bg-[#F3F9F9] text-zinc-900 md:block"
>
	<div
		class="hidescrollbarthumb flex h-[calc(100vh)] flex-col justify-between gap-2 overflow-y-auto"
	>
		<button onclick={() => goto('/hidden-admin-base-007/dashboard')}>
			<div
				class="flex min-h-[50px] cursor-pointer items-center justify-center gap-2 border-b-[2px] border-[#178490]"
			>
				<!-- <Icon icon="fa-solid:chess-king" class="text-2xl" /> -->
				<h1 class="p-4 text-center text-2xl font-bold">Edmond Remedis</h1>
			</div>
		</button>

		<nav class="flex h-full flex-col items-start px-4 text-sm">
			{#each routes as route}
				{#if route.type === 'heading'}
					<h2 class="text-md mb-2 mt-2 font-bold text-zinc-800">{route.name}</h2>
				{:else}
					<div class="w-full rounded-md">
						<button
							class="w-full py-1"
							onclick={() => {
								if (route.href) goto(route.href);
							}}
						>
							<div
								class={`group flex cursor-pointer items-center justify-start rounded-md p-2 ${
									$page.url.pathname === route.href ||
									(route.href !== '/dashboard/' && $page.url.pathname.startsWith(route.href ?? ''))
										? 'bg-gradient-to-r from-[#17a2b8] to-[#178490] font-bold text-white'
										: 'text-zinc-600'
								}`}
							>
								<Icon
									icon={route.icon ?? ''}
									class="mr-2 h-6 w-6 text-gray-600 group-[.bg-gradient-to-r]:font-bold group-[.bg-gradient-to-r]:text-white"
								/>
								<p
									class="text-md group-text-zinc-900 flex items-center gap-3 rounded-lg px-3 font-normal"
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
