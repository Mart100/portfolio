<script lang="ts">
	import type { ArchiveItem } from '$lib/types';

	let { item = $bindable(), onclick } = $props<{
		item: ArchiveItem;
		onclick: () => void;
	}>();

	function getThumbnail(image: string): string {
		if (!image) return '';
		if (image.startsWith('http')) return image;
		return 'https://assets.martvenck.com/portfolio/archive/170x170/' + image;
	}

	function getScore(score: any): number {
		if (typeof score === 'object' && score !== null && '$numberLong' in score) {
			return parseInt(score.$numberLong);
		}
		return typeof score === 'number' ? score : 0;
	}

	const displayScore = $derived(getScore(item.score));
</script>

<div
	class="group relative aspect-square w-full overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/50 transition-all hover:border-emerald-500/30"
>
	<button
		type="button"
		{onclick}
		class="h-full w-full text-left transition-all active:scale-95"
		aria-label="Edit {item.title}"
	>
		{#if item.image}
			<img
				src={getThumbnail(item.image)}
				alt={item.title}
				class="h-full w-full object-cover opacity-60 grayscale-[0.5] transition-all duration-700 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0"
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center bg-neutral-800 text-neutral-600">
				<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			</div>
		{/if}

		<div
			class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 transition-opacity duration-300"
		>
			<span
				class="line-clamp-2 text-[10px] leading-relaxed font-black tracking-[0.2em] text-white uppercase"
			>
				{item.title}
			</span>

			<div class="mt-2 flex items-center gap-2">
				<span class="text-[8px] font-bold text-emerald-500/70">{item.created}</span>
				<div class="flex gap-0.5">
					{#each { length: 3 } as _, starI}
						<div
							class="h-1 w-1 rounded-full {displayScore > starI * 30
								? 'bg-emerald-500'
								: 'bg-neutral-800'}"
						></div>
					{/each}
				</div>
			</div>
		</div>
	</button>
</div>
