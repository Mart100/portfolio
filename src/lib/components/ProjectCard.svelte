<script lang="ts">
	interface Props {
		title: string;
		description: string;
		tags: string[];
		image: string;
		link: string;
		status: string;
	}

	let { title, description, tags, image, link, status }: Props = $props();
</script>

<div
	class="group flex flex-col overflow-hidden border border-white/10 bg-surface/30 backdrop-blur-sm transition-all duration-500 hover:border-primary/50"
>
	<div class="relative h-32 overflow-hidden">
		<img
			src={image}
			alt={title}
			class="h-full w-full object-cover opacity-30 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-60 group-hover:grayscale-0"
		/>
		<div
			class="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent opacity-60"
		></div>
		<div
			class="absolute top-2 right-2 border border-primary/40 bg-primary/20 px-2 py-0.5 text-[8px] font-bold tracking-tighter text-primary"
		>
			{status}
		</div>
	</div>

	<div class="flex flex-1 flex-col space-y-3 p-4">
		<div class="space-y-1">
			<h3
				class="text-lg font-bold tracking-tight uppercase transition-colors group-hover:text-primary"
			>
				{title}
			</h3>
			<p class="line-clamp-2 text-[11px] leading-snug text-gray-500">
				{description}
			</p>
		</div>

		<div class="flex flex-wrap gap-1.5 pt-1">
			{#each tags as tag, i (i)}
				<span
					class="border border-white/5 bg-white/5 px-1.5 py-0.5 text-[8px] font-bold text-gray-400 uppercase transition-colors group-hover:border-primary/20 group-hover:text-primary/60"
				>
					{tag}
				</span>
			{/each}
		</div>

		<div class="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
			<a
				href={link}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-white uppercase transition-all group-hover:gap-3 hover:text-primary"
			>
				LINK <span class="text-primary italic">→</span>
			</a>
			<span class="font-mono text-[9px] text-gray-600">v0.1</span>
		</div>
	</div>
</div>
