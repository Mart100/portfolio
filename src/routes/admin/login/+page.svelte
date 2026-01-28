<script lang="ts">
	import { enhance } from '$app/forms';
	import { fly } from 'svelte/transition';

	let { form } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Admin Login | Portfolio</title>
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-neutral-950 p-6 font-sans text-neutral-200 selection:bg-emerald-500/30"
>
	<div class="pointer-events-none fixed inset-0 overflow-hidden opacity-20">
		<div
			class="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:40px_40px]"
		></div>
	</div>

	<div in:fly={{ y: 20, duration: 600 }} class="relative z-10 w-full max-w-md">
		<div class="mb-8 text-center">
			<div
				class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500"
			>
				<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					/>
				</svg>
			</div>
			<h1 class="text-3xl font-black tracking-tighter text-white">
				ADMIN <span class="text-emerald-500">ACCESS</span>
			</h1>
			<p class="mt-2 text-sm text-neutral-500">Enter password to manage portfolio data</p>
		</div>

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
			class="space-y-4"
		>
			<div class="space-y-2">
				<label
					for="password"
					class="px-1 text-[10px] font-black tracking-widest text-neutral-500 uppercase"
					>Password</label
				>
				<input
					type="password"
					name="password"
					id="password"
					required
					placeholder="••••••••"
					class="w-full rounded-2xl border border-white/5 bg-neutral-900/50 p-4 text-white transition-all outline-none placeholder:text-neutral-700 focus:ring-1 focus:ring-emerald-500"
				/>
			</div>

			{#if form?.incorrect}
				<p in:fly={{ y: -10 }} class="text-center text-xs font-bold text-red-500">
					Invalid password. Please try again.
				</p>
			{/if}

			<button
				disabled={loading}
				class="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-sm font-black tracking-widest text-black uppercase transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
			>
				{#if loading}
					<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
							fill="none"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Authenticating...
				{:else}
					Unlock Dashboard
				{/if}
			</button>
		</form>

		<div class="mt-12 text-center">
			<a
				href="/"
				class="text-[10px] font-black tracking-widest text-neutral-600 uppercase transition-colors hover:text-emerald-500"
			>
				← Return to Site
			</a>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: #0a0a0a;
	}
</style>
