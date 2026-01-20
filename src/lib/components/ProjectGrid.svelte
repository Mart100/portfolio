<script lang="ts">
	import ProjectCard from './ProjectCard.svelte';
	import projects from '$lib/data/projects.json';
</script>

<section id="projects" class="tech-grid border-y border-white/5 bg-background-dark/50 py-20">
	<div class="mx-auto max-w-7xl px-6">
		<div class="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
			<div class="space-y-3">
				<div
					class="inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.5em] text-primary uppercase"
				>
					[ DEPLOYED_WORK ]
				</div>
				<h2 class="text-3xl font-black tracking-tighter uppercase italic md:text-4xl">
					System <span class="text-primary not-italic">Archive</span>
				</h2>
			</div>
			<p
				class="max-w-xs border-r border-white/10 pr-4 text-right text-[10px] leading-tight text-gray-500 uppercase italic"
			>
				High-fidelity prototypes <br /> verified & benchmarked.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each projects as project, i (i)}
				<ProjectCard {...project} />
			{/each}
		</div>
	</div>
</section>
