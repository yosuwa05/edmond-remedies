<script lang="ts">
	import { goto } from '$app/navigation';
	import { _axios } from '$lib/_axios';
	import { writableGlobalStore } from '$lib/stores/global-store';
	// Ensure this is imported
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { z } from 'zod';

	const schema = z.object({
		email: z.string().email(),
		password: z.string().min(4)
	});

	type LoginData = z.infer<typeof schema>;

	let email = $state('');
	let password = $state('');
	let passwordShown = $state(false);

	let loginMutation = createMutation({
		mutationFn: (data: LoginData) => _axios.post('/auth/login', data),
		onSuccess({ data }) {
			if (!data.ok) {
				toast(data.message, {});
				return;
			}

			// Store the email in admindata.email
			$writableGlobalStore.admindata = { email: data.data.email };

			// Store the token in localStorage
			localStorage.setItem('token', data.data.token);
			localStorage.setItem('token', data.data.token);

			// Show success message
			toast(data.message, {});

			// Redirect to the dashboard
			goto('/hidden-admin-base-007/dashboard');
		},
		onError(error, variables, context) {
			console.error('onError', error, variables, context);
			toast('An error occurred during login. Please try again.');
		}
	});

	function login(e: Event) {
		e.preventDefault();
		try {
			const data = schema.parse({
				email,
				password
			});

			$loginMutation.mutate(data);
		} catch (error) {
			console.error(error);
			toast('Invalid email or password');
		}
	}

	// Function to toggle password visibility
	function togglePasswordVisibility() {
		passwordShown = !passwordShown;
	}
</script>

<svelte:head>
	<title>Admin Login | Kingschic</title>
</svelte:head>

<div class="flex h-screen w-full items-center justify-center bg-[#F3F9F9] px-4">
	<div class="mx-auto min-w-[400px] rounded-lg border-2 border-zinc-200 bg-white p-6 shadow-md">
		<div class="mb-6">
			<h2 class="text-3xl font-bold text-zinc-800">Login</h2>
		</div>
		<div>
			<form on:submit|preventDefault={login}>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<label for="email" class="text-sm font-medium text-zinc-700">Email</label>
						<input
							id="email"
							type="email"
							placeholder="admin@example.com"
							required
							bind:value={email}
							class="w-full rounded-md border border-zinc-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
					</div>
					<div class="relative grid gap-2">
						<label for="password" class="text-sm font-medium text-zinc-700">Password</label>
						<input
							id="password"
							placeholder="Password"
							type={passwordShown ? 'text' : 'password'}
							required
							bind:value={password}
							class="w-full rounded-md border border-zinc-300 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
						<!-- svelte-ignore event_directive_deprecated -->
						<button
							type="button"
							on:click={togglePasswordVisibility}
							class="absolute bottom-2.5 right-2 cursor-pointer text-xl text-zinc-500"
						>
							<Icon icon={passwordShown ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
						</button>
					</div>
					<button
						type="submit"
						class="w-full rounded-md bg-[#178490] p-2 font-medium text-white transition hover:bg-[#1b7581]"
					>
						Login
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
