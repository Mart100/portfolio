<script lang="ts">
	import archiveData from '$lib/data/archive.json';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { SvelteSet } from 'svelte/reactivity';
	import { browser } from '$app/environment';

	interface Project {
		title: string;
		image: string;
		backupImage?: string;
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

	function getThumbnail(p: Project): string {
		if (p.image && p.image !== '') {
			return 'https://assets.martvenck.com/portfolio/archive/170x170/' + p.image;
		} else if (p.backupImage && p.backupImage !== '') {
			return p.backupImage;
		}

		return '';
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

<section id="archive" class="relative overflow-hidden border-t border-white/5 px-6 py-16 md:py-32">
	<div class="mx-auto max-w-7xl">
		<div class="mb-12 space-y-6 md:mb-20">
			<div class="flex items-center gap-3">
				<div class="h-px w-8 bg-emerald-500/50"></div>
				<span class="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase">
					The Vault
				</span>
			</div>
			<h2 class="text-4xl font-medium text-white md:text-5xl">
				Project <span class="text-gray-500 italic">Archive.</span>
			</h2>
			<p class="max-w-lg text-lg text-gray-400">
				A messy collection of all of my projects over the years.
			</p>
		</div>

		<div
			class="grid grid-cols-1 overflow-hidden rounded-[32px] border border-white/5 bg-white/[0.02] shadow-2xl lg:grid-cols-12"
		>
			<!-- Controls Sidebar -->
			<div
				class="flex flex-col border-b border-white/5 bg-black/40 p-6 backdrop-blur-xl md:p-8 lg:col-span-3 lg:border-r lg:border-b-0"
			>
				<div class="space-y-8 md:space-y-10">
					<div class="space-y-4">
						<h3 class="text-[10px] font-bold tracking-widest text-emerald-400/60 uppercase">
							Sort By
						</h3>
						<div class="flex flex-col gap-2">
							<button
								onclick={(e) => {
									e.stopPropagation();
									sortBy = 'score';
								}}
								class="flex items-center justify-between rounded-xl border px-5 py-3 text-[10px] font-bold tracking-widest uppercase transition-all {sortBy ===
								'score'
									? 'border-emerald-500/50 bg-emerald-500 text-black'
									: 'border-white/5 bg-white/[0.03] text-gray-500 hover:border-white/20 hover:text-white'}"
							>
								Quality
								{#if sortBy === 'score'}
									<div class="h-1 w-1 rounded-full bg-black"></div>
								{/if}
							</button>
							<button
								onclick={(e) => {
									e.stopPropagation();
									sortBy = 'date';
								}}
								class="flex items-center justify-between rounded-xl border px-5 py-3 text-[10px] font-bold tracking-widest uppercase transition-all {sortBy ===
								'date'
									? 'border-emerald-500/50 bg-emerald-500 text-black'
									: 'border-white/5 bg-white/[0.03] text-gray-500 hover:border-white/20 hover:text-white'}"
							>
								Chronological
								{#if sortBy === 'date'}
									<div class="h-1 w-1 rounded-full bg-black"></div>
								{/if}
							</button>
						</div>
					</div>

					<div class="space-y-4">
						<h3 class="text-[10px] font-bold tracking-widest text-emerald-400/60 uppercase">
							Filter
						</h3>
						<div class="relative">
							<button
								onclick={(e) => {
									e.stopPropagation();
									isDropdownOpen = !isDropdownOpen;
								}}
								class="flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-5 py-3 text-[10px] font-bold tracking-widest text-white uppercase transition-colors outline-none hover:border-white/20"
							>
								<span>{filterTag || 'All Categories'}</span>
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

					<div class="space-y-4 pt-4">
						<h3 class="text-[10px] font-bold tracking-widest text-emerald-400/60 uppercase">
							Stats
						</h3>
						<div class="grid grid-cols-2 gap-4">
							<div
								class="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-center sm:text-left"
							>
								<div class="text-[8px] font-bold text-gray-500 uppercase md:text-[10px]">Total</div>
								<div class="text-lg font-medium text-white md:text-xl">{archiveData.length}</div>
							</div>
							<div
								class="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-center sm:text-left"
							>
								<div class="text-[8px] font-bold text-gray-500 uppercase md:text-[10px]">Tags</div>
								<div class="text-lg font-medium text-white md:text-xl">{allTags.length}</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Grid Area -->
			<div class="bg-black/20 backdrop-blur-lg lg:col-span-9">
				<div class="custom-scrollbar h-[500px] overflow-y-auto p-6 md:h-[600px] md:p-12">
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 xl:grid-cols-5">
						{#each filteredProjects as project (project.title)}
							<button
								onclick={() => (selectedProject = project)}
								class="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-900/50 text-left transition-all active:scale-95"
							>
								<img
									src={getThumbnail(project)}
									alt={project.title}
									class="h-full w-full object-cover opacity-60 grayscale-[0.5] transition-all duration-700 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0"
								/>
								<div
									class="absolute inset-0 flex items-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								>
									<span
										class="line-clamp-2 text-[10px] leading-relaxed font-bold tracking-[0.2em] text-white uppercase"
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
			class="relative flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0a0a] shadow-[0_0_100px_rgba(0,0,0,0.5)] md:flex-row"
			onclick={(e) => e.stopPropagation()}
		>
			<button
				onclick={closeModal}
				class="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-gray-400 backdrop-blur-xl transition-all hover:bg-emerald-500 hover:text-black sm:top-8 sm:right-8"
				aria-label="Close modal"
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

			<div class="relative w-full bg-neutral-900 md:w-[45%]">
				<img
					src={getThumbnail(selectedProject)}
					alt={selectedProject.title}
					class="h-full w-full object-cover"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
			</div>

			<div class="custom-scrollbar flex flex-1 flex-col overflow-y-auto p-8 sm:p-10 md:p-16">
				<div class="mb-8 md:mb-10">
					<div class="mb-4 flex items-center gap-3">
						<div class="h-px w-6 bg-emerald-500/50"></div>
						<span class="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase">
							{selectedProject.created}
						</span>
					</div>
					<h3 class="text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl">
						{selectedProject.title.split(' ')[0]}
						<span class="text-gray-500 italic"
							>{selectedProject.title.split(' ').slice(1).join(' ')}</span
						>
					</h3>
				</div>

				<div class="flex-grow space-y-8 md:space-y-10">
					<div class="text-base leading-relaxed text-gray-400 md:text-lg">
						{@html selectedProject.description}
					</div>

					{#if selectedProject.techStack && selectedProject.techStack.length > 0}
						<div class="space-y-4">
							<h4 class="text-[10px] font-bold tracking-widest text-emerald-400/60 uppercase">
								Tech Stack
							</h4>
							<div class="flex flex-wrap gap-2">
								{#each selectedProject.techStack as tech (tech)}
									<span
										class="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-[9px] font-bold tracking-widest text-gray-400 uppercase md:px-4 md:text-[10px]"
									>
										{tech}
									</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				<div class="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-16 md:gap-4">
					{#if selectedProject.link}
						<a
							href={selectedProject.link}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-6 py-4 text-center text-[10px] font-bold tracking-[0.2em] text-black uppercase transition-all hover:scale-[1.02] hover:bg-emerald-400 active:scale-[0.98] md:px-8 md:py-5"
						>
							Live Demo
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
					{/if}
					{#if selectedProject.code}
						<a
							href={selectedProject.code}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 text-center text-[10px] font-bold tracking-[0.2em] text-white uppercase transition-all hover:bg-white/[0.08] md:px-8 md:py-5"
						>
							Source Code
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
									d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
								/>
							</svg>
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
