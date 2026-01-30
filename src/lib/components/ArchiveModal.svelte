<script lang="ts">
	import { fade, fly } from 'svelte/transition';
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

	let { project, onclose }: { project: Project; onclose: () => void } = $props();

	function getThumbnail(p: Project): string {
		if (p.image && p.image !== '') {
			return 'https://assets.martvenck.com/portfolio/archive/170x170/' + p.image;
		} else if (p.backupImage && p.backupImage !== '') {
			return p.backupImage;
		}
		return '';
	}

	// Disable body scroll when modal is open
	$effect(() => {
		if (browser) {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = '';
			};
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onclose();
		}
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
			class="absolute top-4 right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-gray-400 backdrop-blur-xl transition-all hover:bg-emerald-500 hover:text-black md:top-8 md:right-8 md:h-10 md:w-10"
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

		<div class="relative h-48 w-full shrink-0 bg-neutral-900 sm:h-64 md:h-auto md:w-[45%]">
			<img src={getThumbnail(project)} alt={project.title} class="h-full w-full object-cover" />
			<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
		</div>

		<div class="custom-scrollbar flex flex-1 flex-col overflow-y-auto p-6 sm:p-10 md:p-16">
			<div class="mb-6 md:mb-10">
				<div class="mb-3 flex items-center gap-3 md:mb-4">
					<div class="h-px w-6 bg-emerald-500/50"></div>
					<span
						class="text-[9px] font-bold tracking-[0.3em] text-emerald-400 uppercase md:text-[10px]"
					>
						{project.created}
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

				{#if project.techStack && project.techStack.length > 0}
					<div class="space-y-3 md:space-y-4">
						<h4
							class="text-[9px] font-bold tracking-widest text-emerald-400/60 uppercase md:text-[10px]"
						>
							Tech Stack
						</h4>
						<div class="flex flex-wrap gap-2">
							{#each project.techStack as tech (tech)}
								<span
									class="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-1.5 text-[8px] font-bold tracking-widest text-gray-400 uppercase md:px-4 md:py-2 md:text-[10px]"
								>
									{tech}
								</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<div class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-16 md:gap-4">
				{#if project.link}
					<a
						href={project.link}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-center gap-3 rounded-xl bg-emerald-500 px-5 py-3.5 text-center text-[9px] font-bold tracking-[0.2em] text-black uppercase transition-all hover:scale-[1.02] hover:bg-emerald-400 active:scale-[0.98] md:rounded-2xl md:px-8 md:py-5 md:text-[10px]"
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
				{#if project.code}
					<a
						href={project.code}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-center text-[9px] font-bold tracking-[0.2em] text-white uppercase transition-all hover:bg-white/[0.08] md:rounded-2xl md:px-8 md:py-5 md:text-[10px]"
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

<style>
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
