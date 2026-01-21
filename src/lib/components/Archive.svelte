<script lang="ts">
	import archiveData from '$lib/data/archive.json';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { SvelteSet } from 'svelte/reactivity';
	import { browser } from '$app/environment';

	interface Project {
		title: string;
		image: string;
		link?: string;
		code?: string;
		created: string;
		score: number | { $numberLong: string };
		description: string;
		techStack?: string[];
		tags?: string[];
	}

	let sortBy = $state<'date' | 'score'>('score');
	let filterTag = $state<string | null>(null);
	let selectedProject = $state<Project | null>(null);
	let isDropdownOpen = $state(false);

	const projects = archiveData as Project[];

	// Helper to normalize score
	function getScore(p: Project): number {
		if (typeof p.score === 'object' && p.score !== null && '$numberLong' in p.score) {
			return parseInt(p.score.$numberLong);
		}
		return typeof p.score === 'number' ? p.score : 0;
	}

	// Helper to normalize date for sorting
	function getUnixTime(dateStr: string): number {
		if (!dateStr || dateStr === '00/00/0000') return 0;
		try {
			// Clean string (e.g. "00./0/2018")
			const cleanStr = dateStr.replace(/[^0-9\/\-.]/g, '');
			const parts = cleanStr.split(/[\/\-.]/);

			if (parts.length === 3) {
				const day = Math.max(1, parseInt(parts[0]) || 1);
				const month = Math.max(0, (parseInt(parts[1]) || 1) - 1);
				const year = parseInt(parts[2]);
				if (!isNaN(year)) return new Date(year, month, day).getTime();
			} else if (parts.length === 1) {
				const year = parseInt(parts[0]);
				if (!isNaN(year)) return new Date(year, 0, 1).getTime();
			}
		} catch (e) {}
		return 0;
	}

	const allTags = $derived.by(() => {
		const tags = new SvelteSet<string>();
		projects.forEach((p) => {
			if (p.tags) p.tags.forEach((t) => t && tags.add(t));
		});
		return Array.from(tags).sort();
	});

	const filteredProjects = $derived.by(() => {
		const filtered = filterTag
			? projects.filter((p) => p.tags?.includes(filterTag!))
			: [...projects];

		return filtered.sort((a, b) => {
			if (sortBy === 'score') {
				return getScore(b) - getScore(a);
			} else {
				return getUnixTime(b.created) - getUnixTime(a.created);
			}
		});
	});

	function closeModal() {
		selectedProject = null;
	}

	// Close modal on escape
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeModal();
			isDropdownOpen = false;
		}
	}

	// Disable body scroll when modal is open
	$effect(() => {
		if (browser) {
			document.body.style.overflow = selectedProject ? 'hidden' : '';
		}
	});
</script>

<svelte:window onclick={() => (isDropdownOpen = false)} onkeydown={handleKeydown} />

<section id="archive" class="border-t border-white/5 px-6 py-32">
	<div class="mx-auto max-w-7xl">
		<div class="mb-20 space-y-4">
			<h2 class="text-3xl font-medium text-white">Project Archive</h2>
			<div class="h-px w-12 bg-white/20"></div>
			<p class="text-sm text-gray-500">
				A collection of experiments, games, and tools from the past.
			</p>
		</div>

		<div
			class="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/5 bg-white/5 shadow-2xl lg:grid-cols-12"
		>
			<!-- Controls Sidebar -->
			<div
				class="flex flex-col border-b border-white/5 bg-black/40 p-8 backdrop-blur-xl lg:col-span-3 lg:border-r lg:border-b-0"
			>
				<div class="space-y-8">
					<div class="space-y-4">
						<h3 class="text-[10px] font-bold tracking-widest text-white/40 uppercase">Sort By</h3>
						<div class="flex flex-col gap-2">
							<button
								onclick={(e) => {
									e.stopPropagation();
									sortBy = 'score';
								}}
								class="flex items-center justify-between rounded-full border px-6 py-3 text-[10px] font-bold tracking-widest uppercase transition-all {sortBy ===
								'score'
									? 'border-white bg-white text-black'
									: 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'}"
							>
								Best
								{#if sortBy === 'score'}
									<div class="h-1 w-1 rounded-full bg-black"></div>
								{/if}
							</button>
							<button
								onclick={(e) => {
									e.stopPropagation();
									sortBy = 'date';
								}}
								class="flex items-center justify-between rounded-full border px-6 py-3 text-[10px] font-bold tracking-widest uppercase transition-all {sortBy ===
								'date'
									? 'border-white bg-white text-black'
									: 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'}"
							>
								Recent
								{#if sortBy === 'date'}
									<div class="h-1 w-1 rounded-full bg-black"></div>
								{/if}
							</button>
						</div>
					</div>

					<div class="space-y-4">
						<h3 class="text-[10px] font-bold tracking-widest text-white/40 uppercase">Category</h3>
						<div class="relative">
							<button
								onclick={(e) => {
									e.stopPropagation();
									isDropdownOpen = !isDropdownOpen;
								}}
								class="flex w-full items-center justify-between rounded-full border border-white/10 bg-black/50 px-6 py-3 text-[10px] font-bold tracking-widest text-white uppercase transition-colors outline-none hover:border-white/30"
							>
								<span>{filterTag || 'All'}</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2.5"
									stroke="currentColor"
									class="ml-2 h-3 w-3 transition-transform {isDropdownOpen ? 'rotate-180' : ''}"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m19.5 8.25-7.5 7.5-7.5-7.5"
									/>
								</svg>
							</button>

							<!-- svelte-ignore a11y_no_static_element_interactions -->
							{#if isDropdownOpen}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<div
									transition:fade={{ duration: 100 }}
									class="custom-scrollbar absolute top-full left-0 z-30 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-white/10 bg-neutral-900 p-2 shadow-2xl backdrop-blur-xl"
									onclick={(e) => e.stopPropagation()}
								>
									<!-- Dropdown content omitted for brevity in replacement but I will include it all in the final file -->
									<button
										onclick={() => {
											filterTag = null;
											isDropdownOpen = false;
										}}
										class="flex w-full items-center rounded-lg px-4 py-2 text-left text-[10px] font-bold tracking-widest uppercase transition-colors {filterTag ===
										null
											? 'bg-white/10 text-white'
											: 'text-gray-500 hover:bg-white/5 hover:text-white'}"
									>
										All Categories
									</button>
									{#each allTags as tag (tag)}
										<button
											onclick={() => {
												filterTag = tag;
												isDropdownOpen = false;
											}}
											class="flex w-full items-center rounded-lg px-4 py-2 text-left text-[10px] font-bold tracking-widest uppercase transition-colors {filterTag ===
											tag
												? 'bg-white/10 text-white'
												: 'text-gray-500 hover:bg-white/5 hover:text-white'}"
										>
											{tag}
										</button>
									{/each}
								</div>
							{/if}
						</div>
					</div>

					<div class="pt-8">
						<div class="font-mono text-[9px] text-white/20 uppercase">
							Showing {filteredProjects.length} Projects
						</div>
					</div>
				</div>
			</div>

			<!-- Grid Area -->
			<div class="bg-black/20 lg:col-span-9">
				<div class="custom-scrollbar h-[600px] overflow-y-auto p-8">
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
						{#each filteredProjects as project (project.title)}
							<button
								onclick={() => (selectedProject = project)}
								class="group relative aspect-square overflow-hidden rounded-xl bg-neutral-900/50 text-left transition-all active:scale-95"
							>
								<img
									src={project.image}
									alt={project.title}
									class="h-full w-full object-cover opacity-70 grayscale-[0.4] transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
								/>
								<div
									class="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100"
								>
									<span
										class="line-clamp-2 text-[10px] font-bold tracking-widest text-white uppercase"
									>
										{project.title}
									</span>
								</div>
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

{#if selectedProject}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm"
		onclick={closeModal}
	>
		<div
			transition:fly={{ y: 20, duration: 400 }}
			class="relative flex max-h-[60vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl md:flex-row"
			onclick={(e) => e.stopPropagation()}
		>
			<button
				onclick={closeModal}
				class="absolute top-6 right-6 z-20 text-gray-500 transition-colors hover:text-white"
				aria-label="Close modal"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<div class="w-full bg-neutral-900 md:w-[40%]">
				<img
					src={selectedProject.image}
					alt={selectedProject.title}
					class="h-full w-full object-cover"
				/>
			</div>

			<div class="custom-scrollbar flex flex-1 flex-col overflow-y-auto p-8 md:p-12">
				<div class="mb-8">
					<div class="mb-2 text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
						{selectedProject.created}
					</div>
					<h3 class="text-3xl font-medium tracking-tight text-white uppercase">
						{selectedProject.title}
					</h3>
				</div>

				<div class="flex-grow space-y-8">
					<div class="text-base leading-relaxed text-gray-400">
						{@html selectedProject.description}
					</div>

					{#if selectedProject.techStack && selectedProject.techStack.length > 0}
						<div class="space-y-4">
							<h4 class="text-[10px] font-bold tracking-widest text-white/40 uppercase">
								Tech Stack
							</h4>
							<div class="flex flex-wrap gap-2">
								{#each selectedProject.techStack as tech (tech)}
									<span
										class="rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-[10px] text-gray-400"
									>
										{tech}
									</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				<div class="mt-12 flex flex-col gap-3">
					{#if selectedProject.link}
						<a
							href={selectedProject.link}
							target="_blank"
							rel="noopener noreferrer"
							class="w-full rounded-full bg-white px-8 py-4 text-center text-[10px] font-bold tracking-[0.2em] text-black uppercase transition-transform hover:scale-[1.01] active:scale-[0.99]"
						>
							Launch Project
						</a>
					{/if}
					{#if selectedProject.code}
						<a
							href={selectedProject.code}
							target="_blank"
							rel="noopener noreferrer"
							class="w-full rounded-full border border-white/10 px-8 py-4 text-center text-[10px] font-bold tracking-[0.2em] text-white uppercase transition-colors hover:bg-white/5"
						>
							View Source
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Custom scrollbar */
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.02);
		border-radius: 2px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 2px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.2);
	}
</style>
