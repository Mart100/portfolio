<script lang="ts">
	import type { ElectronicsProject } from '$lib/types';
	import ElectronicsModal from './ElectronicsModal.svelte';

	let { projects = [] } = $props<{ projects: ElectronicsProject[] }>();

	let selected = $state<ElectronicsProject | null>(null);

	function cover(project: ElectronicsProject): string {
		return project.images?.find(Boolean) || '';
	}
</script>

<section id="electronics" class="overflow-hidden border-t border-white/5 px-6 py-16 md:py-32">
	<div class="mx-auto max-w-7xl">
		<div class="mb-12 space-y-6 md:mb-20">
			<div class="flex items-center gap-3">
				<div class="h-px w-8 bg-emerald-400/50"></div>
				<span class="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase">
					Hardware Lab
				</span>
			</div>
			<h2 class="text-4xl font-medium tracking-tight text-white md:text-5xl">
				Electronics <span class="text-gray-500 italic">Builds.</span>
			</h2>
			<p class="max-w-lg text-lg text-gray-400">
				Boards, circuits, and things that blink. Click a build to see more.
			</p>
		</div>

		{#if projects.length === 0}
			<div
				class="rounded-[32px] border border-white/5 bg-white/[0.02] px-8 py-16 text-center text-sm text-gray-500"
			>
				Nothing here yet — projects will show up once they’re added in the admin panel.
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
				{#each projects as project (project.id)}
					<button
						onclick={() => (selected = project)}
						aria-label="View {project.title}"
						class="group relative overflow-hidden rounded-[28px] border border-white/5 bg-white/[0.02] text-left transition-all hover:border-white/15 hover:bg-white/[0.04] active:scale-[0.99]"
					>
						<div class="relative aspect-[16/10] overflow-hidden bg-neutral-900">
							{#if cover(project)}
								<img
									src={cover(project)}
									alt={project.title}
									class="h-full w-full object-cover opacity-70 grayscale-[0.3] transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
								/>
							{:else}
								<div
									class="flex h-full w-full items-center justify-center text-[10px] font-bold tracking-widest text-white/20 uppercase"
								>
									No image
								</div>
							{/if}
							<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
						</div>
						<div class="space-y-3 p-5 sm:p-6">
							<div class="flex items-start justify-between gap-3">
								<h3
									class="text-lg font-medium tracking-tight text-white transition-colors group-hover:text-emerald-400"
								>
									{project.title}
								</h3>
								<div class="flex shrink-0 flex-wrap justify-end gap-1.5">
									{#if project.circuit}
										<span
											class="rounded-full border border-emerald-400/30 px-2 py-0.5 text-[9px] font-bold tracking-widest text-emerald-400/80 uppercase"
										>
											Circuit
										</span>
									{/if}
									{#if project.images?.length > 1}
										<span
											class="rounded-full border border-white/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-gray-500 uppercase"
										>
											{project.images.length} photos
										</span>
									{/if}
								</div>
							</div>
							{#if project.tags?.length}
								<div
									class="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase"
								>
									{#each project.tags as tag, i (tag)}
										<span>{tag}</span>
										{#if i < project.tags.length - 1}
											<span class="text-white/10">•</span>
										{/if}
									{/each}
								</div>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</section>

{#if selected}
	{#key selected.id}
		<ElectronicsModal project={selected} onclose={() => (selected = null)} />
	{/key}
{/if}
