<script lang="ts">
	import ProjectCard from './ProjectCard.svelte';
	import projects from '$lib/data/projects.json';
</script>

<section id="work" class="px-6 py-32">
	<div class="mx-auto max-w-5xl">
		<div class="mb-20 space-y-4">
			<h2 class="text-3xl font-medium text-white">Selected projects</h2>
			<div class="h-px w-12 bg-white/20"></div>
		</div>

		<div class="grid grid-cols-1 gap-12 sm:grid-cols-2">
			{#each projects as project}
				<ProjectCard {...project} />
			{/each}
		</div>
	</div>
</section>
