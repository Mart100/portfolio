<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { TripNode } from '$lib/types';

	let {
		nodes,
		index = $bindable(0),
		onclose,
		onnavigate
	}: {
		nodes: TripNode[];
		index: number;
		onclose: () => void;
		onnavigate?: (node: TripNode) => void;
	} = $props();

	let node = $derived(nodes[index]);
	let hasPrev = $derived(index > 0);
	let hasNext = $derived(index < nodes.length - 1);

	function goTo(nextIndex: number) {
		if (nextIndex < 0 || nextIndex >= nodes.length) return;
		index = nextIndex;
		onnavigate?.(nodes[nextIndex]);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
		if (e.key === 'ArrowLeft') goTo(index - 1);
		if (e.key === 'ArrowRight') goTo(index + 1);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	transition:fade={{ duration: 200 }}
	class="absolute inset-0 z-40 bg-black/95 backdrop-blur-md"
	role="dialog"
	aria-modal="true"
	aria-label="{node?.name || 'Trip stop'} photo"
>
	<button
		onclick={onclose}
		class="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-all hover:bg-emerald-500 hover:text-black md:top-5 md:right-5"
		aria-label="Close lightbox"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2"
			stroke="currentColor"
			class="h-5 w-5"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	</button>

	{#if hasPrev}
		<button
			onclick={() => goTo(index - 1)}
			class="group absolute inset-y-0 left-0 z-20 flex w-[14%] items-center justify-start pl-3 md:w-[18%] md:pl-5"
			aria-label="Previous stop"
		>
			<span
				class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/50 opacity-0 transition-all group-hover:opacity-100 group-hover:text-white md:h-12 md:w-12"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</span>
		</button>
	{/if}

	{#if hasNext}
		<button
			onclick={() => goTo(index + 1)}
			class="group absolute inset-y-0 right-0 z-20 flex w-[14%] items-center justify-end pr-3 md:w-[18%] md:pr-5"
			aria-label="Next stop"
		>
			<span
				class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/50 opacity-0 transition-all group-hover:opacity-100 group-hover:text-white md:h-12 md:w-12"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</span>
		</button>
	{/if}

	<!-- Full-bleed media stage -->
	<div class="absolute inset-0 overflow-hidden">
		{#if node?.image}
			<img
				src={node.image}
				alt={node.name}
				class="absolute inset-0 h-full w-full object-contain"
			/>
		{:else}
			<div class="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
				<span
					class="text-[10px] font-bold tracking-[0.35em] text-white/25 uppercase"
				>
					No image
				</span>
			</div>
		{/if}

		<!-- Text always pinned to the stage bottom, not the image bounds -->
		<div
			class="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/70 to-transparent px-6 pt-24 pb-6 md:px-10 md:pt-32 md:pb-8"
		>
			{#if node?.date}
				<span class="text-[10px] font-medium tracking-[0.25em] text-emerald-300/90 uppercase">
					{node.date}
				</span>
			{/if}
			<div class="mt-1 flex items-end justify-between gap-6">
				<div class="min-w-0 space-y-1.5">
					<h3 class="text-lg font-medium tracking-tight text-white md:text-2xl">
						{node?.name}
					</h3>
					{#if node?.caption}
						<p class="max-w-2xl text-xs leading-relaxed text-white/75 md:text-sm">
							{node.caption}
						</p>
					{/if}
				</div>
				<p class="shrink-0 pb-0.5 font-mono text-[9px] tracking-widest text-white/40 uppercase">
					{index + 1} / {nodes.length}
				</p>
			</div>
		</div>
	</div>
</div>
