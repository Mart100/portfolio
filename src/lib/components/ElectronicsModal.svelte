<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import type { ElectronicsProject } from '$lib/types';
	import CircuitEmbed from './CircuitEmbed.svelte';

	let { project, onclose }: { project: ElectronicsProject; onclose: () => void } = $props();

	let imageIndex = $state(0);
	let showingCircuit = $state(false);
	let images = $derived(project.images?.filter(Boolean) ?? []);
	let currentImage = $derived(images[imageIndex] ?? '');
	let hasPrev = $derived(!showingCircuit && imageIndex > 0);
	let hasNext = $derived(!showingCircuit && imageIndex < images.length - 1);
	let showCircuit = $derived(Boolean(project.circuit) && (showingCircuit || images.length === 0));

	$effect(() => {
		if (browser) {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = '';
			};
		}
	});

	function goTo(nextIndex: number) {
		if (nextIndex < 0 || nextIndex >= images.length) return;
		imageIndex = nextIndex;
		showingCircuit = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
		if (document.activeElement?.tagName === 'IFRAME') return;
		if (e.key === 'ArrowLeft') goTo(imageIndex - 1);
		if (e.key === 'ArrowRight') goTo(imageIndex + 1);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	transition:fade={{ duration: 200 }}
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-6"
	onclick={onclose}
>
	<div
		transition:fly={{ y: 20, duration: 400 }}
		class="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0a0a] shadow-[0_0_100px_rgba(0,0,0,0.5)] md:max-h-[85vh] md:flex-row md:rounded-[32px]"
		onclick={(e) => e.stopPropagation()}
	>
		<button
			onclick={onclose}
			class="absolute top-4 right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-md transition-all hover:bg-emerald-500 hover:text-black md:top-8 md:right-8 md:h-10 md:w-10"
			aria-label="Close modal"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="h-4 w-4 md:h-5 md:w-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>

		<div class="relative flex w-full shrink-0 flex-col bg-neutral-900 md:w-[48%]">
			<div
				class="relative min-h-48 flex-1 sm:min-h-64 {showCircuit ? 'min-h-[320px] md:min-h-0' : ''}"
			>
				{#if project.circuit}
					<div class="absolute inset-0 {showCircuit ? '' : 'pointer-events-none invisible'}">
						<CircuitEmbed board={project.circuit} title="{project.title} circuit" />
					</div>
				{/if}

				{#if !showCircuit && currentImage}
					<img
						src={currentImage}
						alt={project.title}
						class="absolute inset-0 h-full w-full object-contain"
					/>
				{:else if !showCircuit}
					<div
						class="absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-widest text-white/25 uppercase"
					>
						No image
					</div>
				{/if}

				{#if hasPrev}
					<button
						onclick={() => goTo(imageIndex - 1)}
						class="absolute inset-y-0 left-0 z-10 flex w-[22%] items-center justify-start pl-3"
						aria-label="Previous image"
					>
						<span
							class="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 backdrop-blur-sm"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
						onclick={() => goTo(imageIndex + 1)}
						class="absolute inset-y-0 right-0 z-10 flex w-[22%] items-center justify-end pr-3"
						aria-label="Next image"
					>
						<span
							class="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 backdrop-blur-sm"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
			</div>

			{#if images.length > 1 || (project.circuit && images.length > 0)}
				<div class="flex gap-2 overflow-x-auto p-3">
					{#each images as src, i (src + i)}
						<button
							onclick={() => goTo(i)}
							class="h-14 w-14 shrink-0 overflow-hidden rounded-lg border transition-all {!showingCircuit &&
							i === imageIndex
								? 'border-emerald-400 ring-2 ring-emerald-400/30'
								: 'border-white/10 opacity-60 hover:opacity-100'}"
							aria-label="Show image {i + 1}"
						>
							<img {src} alt="" class="h-full w-full object-cover" />
						</button>
					{/each}
					{#if project.circuit}
						<button
							onclick={() => (showingCircuit = true)}
							class="ml-auto flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border transition-all {showingCircuit
								? 'border-emerald-400 bg-emerald-500/15 text-emerald-400 ring-2 ring-emerald-400/30'
								: 'border-white/10 text-gray-500 opacity-70 hover:opacity-100 hover:text-emerald-400'}"
							aria-label="Show interactive circuit"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.8"
									d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
								/>
							</svg>
							<span class="text-[7px] font-bold tracking-widest uppercase">Circuit</span>
						</button>
					{/if}
				</div>
			{/if}
		</div>

		<div class="custom-scrollbar flex flex-1 flex-col overflow-y-auto p-6 sm:p-10 md:p-16">
			<div class="mb-6 md:mb-10">
				<div class="mb-3 flex items-center gap-3 md:mb-4">
					<div class="h-px w-6 bg-emerald-500/50"></div>
					<span
						class="text-[9px] font-bold tracking-[0.3em] text-emerald-400 uppercase md:text-[10px]"
					>
						{project.created || 'Hardware'}
					</span>
				</div>
				<h3 class="text-2xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl">
					{project.title.split(' ')[0]}
					<span class="text-gray-500 italic">{project.title.split(' ').slice(1).join(' ')}</span>
				</h3>
			</div>

			<div class="flex-grow space-y-6 md:space-y-10">
				<div class="text-sm leading-relaxed text-gray-400 md:text-lg">
					{@html project.description}
				</div>

				{#if project.tags && project.tags.length > 0}
					<div class="space-y-3 md:space-y-4">
						<h4
							class="text-[9px] font-bold tracking-widest text-emerald-400/60 uppercase md:text-[10px]"
						>
							Tags
						</h4>
						<div class="flex flex-wrap gap-2">
							{#each project.tags as tag (tag)}
								<span
									class="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-1.5 text-[8px] font-bold tracking-widest text-gray-400 uppercase md:px-4 md:py-2 md:text-[10px]"
								>
									{tag}
								</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			{#if project.link}
				<div class="mt-8 md:mt-16">
					<a
						href={project.link}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-center gap-3 rounded-xl bg-emerald-500 px-5 py-3.5 text-center text-[9px] font-bold tracking-[0.2em] text-black uppercase transition-all hover:scale-[1.02] hover:bg-emerald-400 active:scale-[0.98] md:rounded-2xl md:px-8 md:py-5 md:text-[10px]"
					>
						View more
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2.5"
							stroke="currentColor"
							class="h-3 w-3"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
							/>
						</svg>
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>
