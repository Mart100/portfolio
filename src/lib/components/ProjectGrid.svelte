<script lang="ts">
	import type { Project } from '$lib/types';
	import ProjectCard from './ProjectCard.svelte';

	let { projects = [] } = $props<{ projects: Project[] }>();
</script>

<section id="work" class="px-6 py-16 md:py-32">
	<div class="mx-auto max-w-7xl">
		<div class="mb-12 space-y-6 md:mb-24">
			<div class="flex items-center gap-3">
				<div class="h-px w-8 bg-emerald-400/50"></div>
				<span class="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase"
					>Featured Work</span
				>
			</div>
			<h2 class="text-4xl font-medium tracking-tight text-white md:text-5xl">
				Selected <span class="text-gray-500 italic">Projects.</span>
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-10">
			{#each projects as project}
				<ProjectCard {...project} />
			{/each}
		</div>
	</div>
</section>
