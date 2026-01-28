<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	interface HeaderAction {
		label: string;
		icon?: string;
		onclick: () => void;
	}

	interface Props {
		title: string;
		description: string;
		saving?: boolean;
		message?: string;
		actions?: HeaderAction[];
		hasChanges?: boolean;
	}

	let {
		title,
		description,
		saving = false,
		message = '',
		actions = [],
		hasChanges = false
	}: Props = $props();
</script>

<header
	class="sticky top-0 z-40 border-b border-white/5 bg-neutral-900/80 px-6 py-4 shadow-2xl shadow-black/50 backdrop-blur-xl md:px-12 md:py-6"
>
	<div class="mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div class="flex items-center gap-4 md:gap-6">
			<div>
				<div class="mb-0.5 flex items-center gap-3 md:mb-1">
					<div class="h-px w-4 bg-emerald-500/50 md:w-6"></div>
					<span
						class="text-[8px] font-bold tracking-[0.3em] text-emerald-400 uppercase md:text-[10px]"
					>
						{title}
					</span>
				</div>
				<h1 class="text-lg font-black tracking-tight text-white md:text-2xl">
					{description}
				</h1>
			</div>

			<div class="hidden h-10 w-px bg-white/10 md:block"></div>

			<div class="flex items-center gap-2 md:gap-3">
				{#each actions as action}
					<button
						type="button"
						onclick={action.onclick}
						class="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold tracking-widest text-neutral-300 uppercase transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 md:gap-2 md:px-4 md:py-2"
					>
						{#if action.icon === 'plus'}
							<svg
								class="h-3 w-3 md:h-3.5 md:w-3.5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2.5"
									d="M12 4v16m8-8H4"
								/>
							</svg>
						{:else if action.icon}
							<svg
								class="h-3 w-3 md:h-3.5 md:w-3.5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2.5"
									d={action.icon}
								/>
							</svg>
						{/if}
						{action.label}
					</button>
				{/each}
			</div>
		</div>

		<div class="flex items-center justify-between gap-4 md:justify-end">
			{#if message}
				<div
					in:fly={{ y: 10, duration: 300 }}
					out:fade
					class="text-[10px] font-black tracking-widest text-emerald-400 uppercase"
				>
					{message}
				</div>
			{/if}

			<button
				type="submit"
				disabled={saving}
				class="group relative flex items-center gap-2 overflow-hidden rounded-full border border-emerald-500/20 bg-emerald-500/10 px-6 py-2 text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase transition-all hover:bg-emerald-500 hover:text-black disabled:opacity-50 md:px-8 md:py-2.5"
			>
				{#if saving}
					<div
						class="h-3 w-3 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent group-hover:border-black md:h-4 md:w-4"
					></div>
					<span>Saving...</span>
				{:else if hasChanges}
					<svg class="h-3 w-3 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							d="M5 13l4 4L19 7"
						/>
					</svg>
					<span>Save Changes</span>
				{:else}
					<svg class="h-3 w-3 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
					<span>Sync Status</span>
				{/if}
			</button>
		</div>
	</div>
</header>
