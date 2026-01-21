<script lang="ts">
	interface Props {
		title: string;
		description: string;
		tags: string[];
		image: string;
		link: string;
	}

	let { title, description, tags, image, link }: Props = $props();
</script>

<a
	href={link}
	target="_blank"
	rel="noopener noreferrer"
	class="group relative flex flex-col gap-6 rounded-2xl p-6 transition-all duration-500 hover:bg-white/[0.03]"
>
	<div class="relative aspect-video w-full overflow-hidden rounded-xl bg-surface">
		<img
			src={image}
			alt={title}
			class="h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
		/>
	</div>

	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="text-xl font-medium text-white group-hover:text-primary">
				{title}
			</h3>
			<span class="text-xs text-gray-500 transition-transform group-hover:translate-x-1">→</span>
		</div>

		<p class="text-sm leading-relaxed text-gray-400">
			{description}
		</p>

		<div class="flex flex-wrap gap-2 text-[10px] font-medium tracking-wide text-gray-500 uppercase">
			{#each tags as tag}
				<span class="transition-colors group-hover:text-white">{tag}</span>
				{#if tag !== tags[tags.length - 1]}
					<span class="text-white/10">/</span>
				{/if}
			{/each}
		</div>
	</div>
</a>
