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
	class="group relative flex flex-col gap-6 rounded-[32px] border border-transparent p-4 transition-all duration-500 hover:border-white/10 hover:bg-white/[0.03] hover:shadow-2xl sm:gap-8 sm:rounded-[40px] sm:p-6"
>
	<div
		class="relative aspect-[16/10] w-full overflow-hidden rounded-[24px] bg-neutral-900 sm:rounded-[28px]"
	>
		<img
			src={image}
			alt={title}
			class="h-full w-full object-cover opacity-60 grayscale-[0.3] transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
	</div>

	<div class="space-y-4 px-2 sm:space-y-5">
		<div class="flex items-center justify-between">
			<h3
				class="text-xl font-medium tracking-tight text-white transition-colors group-hover:text-emerald-400 sm:text-2xl"
			>
				{title}
			</h3>
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] transition-all group-hover:border-emerald-500/50 group-hover:bg-emerald-500 group-hover:text-black sm:h-10 sm:w-10"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					stroke="currentColor"
					class="h-4 w-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
					/>
				</svg>
			</div>
		</div>

		<p class="text-base leading-relaxed text-gray-400">
			{description}
		</p>

		<div
			class="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase"
		>
			{#each tags as tag}
				<span class="transition-colors group-hover:text-emerald-400">{tag}</span>
				{#if tag !== tags[tags.length - 1]}
					<span class="text-white/10">•</span>
				{/if}
			{/each}
		</div>
	</div>
</a>
