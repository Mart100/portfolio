<script lang="ts">
	import { fade, scale } from 'svelte/transition';

	let {
		isOpen = $bindable(false),
		onSelect,
		basePath = ''
	} = $props<{
		isOpen: boolean;
		onSelect: (url: string) => void;
		basePath: string;
	}>();

	let images = $state<{ url: string }[]>([]);
	let loading = $state(false);
	let error = $state('');

	async function fetchImages() {
		if (!basePath) {
			error = 'No base path specified for this trip';
			return;
		}
		loading = true;
		error = '';
		try {
			const res = await fetch(`/api/images?path=${basePath}`);
			if (!res.ok) throw new Error();
			const result = await res.json();
			if (result && result.images) {
				images = result.images;
			} else {
				error = 'No images found in this sector';
			}
		} catch (e) {
			error = 'Failed to fetch asset manifest';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			fetchImages();
		}
	});

	function close() {
		isOpen = false;
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8"
		transition:fade={{ duration: 200 }}
	>
		<!-- Backdrop -->
		<button
			type="button"
			class="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
			onclick={close}
			aria-label="Close picker"
		></button>

		<!-- Modal Content -->
		<div
			class="relative flex h-full max-h-[700px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl"
			transition:scale={{ start: 0.95, duration: 200 }}
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-white/5 p-6">
				<div>
					<h3 class="text-lg font-black tracking-tighter text-white uppercase">
						Asset Intelligence
					</h3>
					<p class="mt-1 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
						Scanning: {basePath}
					</p>
				</div>
				<button
					type="button"
					onclick={close}
					aria-label="Close asset intelligence"
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
				>
					<svg
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
					>
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Grid -->
			<div class="custom-scrollbar flex-1 overflow-y-auto p-8">
				{#if loading}
					<div class="flex h-64 flex-col items-center justify-center gap-4">
						<div
							class="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)]"
						></div>
						<span class="text-[10px] font-black tracking-widest text-emerald-500 uppercase"
							>Retrieving Artifacts...</span
						>
					</div>
				{:else if error}
					<div class="flex h-64 flex-col items-center justify-center gap-6">
						<div class="rounded-2xl bg-red-500/10 p-4">
							<span class="text-[10px] font-black tracking-widest text-red-400 uppercase"
								>{error}</span
							>
						</div>
						<button
							type="button"
							onclick={fetchImages}
							class="rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-[10px] font-black tracking-widest text-neutral-400 uppercase transition-all hover:bg-white/10 hover:text-white"
						>
							Restart Scan
						</button>
					</div>
				{:else}
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{#each images as img}
							<button
								type="button"
								onclick={() => {
									onSelect(img.url);
									close();
								}}
								class="group relative aspect-square overflow-hidden rounded-2xl border border-white/5 bg-black transition-all hover:scale-[1.02] hover:border-emerald-500/50"
							>
								<img
									src={img.url}
									alt="Resource"
									class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-40"
								/>
								<div
									class="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
								>
									<div class="rounded-lg bg-emerald-500 p-2 text-white shadow-lg">
										<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
											<path
												d="M5 13l4 4L19 7"
												stroke-width="3"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</div>
									<span class="mt-2 text-[8px] font-black tracking-widest text-white uppercase"
										>Select</span
									>
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 20px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(16, 185, 129, 0.5);
	}
</style>
