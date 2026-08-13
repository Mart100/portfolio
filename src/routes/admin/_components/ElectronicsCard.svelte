<script lang="ts">
	import type { ElectronicsProject } from '$lib/types';

	let { item = $bindable(), onclick } = $props<{
		item: ElectronicsProject;
		onclick: () => void;
	}>();

	let cover = $derived(item.images?.find(Boolean) || '');
</script>

<div
	class="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/50 transition-all hover:border-emerald-500/30"
>
	<button
		type="button"
		{onclick}
		class="h-full w-full text-left transition-all active:scale-95"
		aria-label="Edit {item.title}"
	>
		{#if cover}
			<img
				src={cover}
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
						d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
					/>
				</svg>
			</div>
		{/if}

		<div
			class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4"
		>
			<span
				class="line-clamp-2 text-[10px] leading-relaxed font-black tracking-[0.2em] text-white uppercase"
			>
				{item.title}
			</span>
			<div class="mt-2 flex items-center gap-2 text-[8px] font-bold text-emerald-500/70">
				<span>{item.created || 'No date'}</span>
				{#if item.images?.length}
					<span class="text-neutral-500">· {item.images.length} photos</span>
				{/if}
				{#if item.circuit}
					<span class="text-emerald-400/80">· Circuit</span>
				{/if}
			</div>
		</div>
	</button>
</div>
