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
		commitMessage?: string;
	}

	let {
		title,
		description,
		saving = false,
		message = '',
		actions = [],
		hasChanges = false,
		commitMessage = $bindable('')
	}: Props = $props();
</script>

<header
	class="sticky top-0 z-40 border-b border-white/5 bg-neutral-900/80 px-6 py-4 shadow-2xl shadow-black/50 backdrop-blur-xl md:px-12 md:py-6"
>
	{#if saving}
		<div class="absolute top-0 left-0 h-0.5 w-full overflow-hidden bg-emerald-500/20">
			<div
				class="h-full w-1/3 animate-[loading_1s_infinite_linear] bg-emerald-500 shadow-[0_0_10px_#10b981]"
			></div>
		</div>
	{/if}

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
				{#each actions as action (action.label)}
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

		<div class="flex items-center justify-end gap-3 md:gap-6">
			<div class="grid items-center justify-end">
				{#if hasChanges || saving}
					<div
						transition:fade={{ duration: 150 }}
						class="col-start-1 row-start-1 flex items-center gap-3 rounded-full border border-white/5 bg-white/[0.02] px-1 py-1 pr-4 shadow-inner"
					>
						<input
							type="text"
							name="message"
							bind:value={commitMessage}
							disabled={saving}
							placeholder="Commit message..."
							class="h-7 w-28 rounded-full bg-black/40 px-3 text-[10px] text-white placeholder:text-neutral-700 focus:ring-1 focus:ring-emerald-500/30 focus:outline-none md:w-44"
						/>
						<div class="flex items-center gap-2">
							<div
								class="h-1.5 w-1.5 rounded-full {saving
									? 'animate-pulse bg-emerald-500'
									: 'bg-amber-500'}"
							></div>
							<span
								class="hidden text-[9px] font-black tracking-widest uppercase md:block {saving
									? 'text-emerald-500'
									: 'text-amber-500'}"
							>
								{saving ? 'Saving' : 'Pending'}
							</span>
						</div>
					</div>
				{:else if message}
					<div
						in:fly={{ y: 5, duration: 200, delay: 100 }}
						out:fade={{ duration: 150 }}
						class="col-start-1 row-start-1 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5"
					>
						<svg
							class="h-3 w-3 text-emerald-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="3"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						<span class="text-[9px] font-black tracking-widest text-emerald-400 uppercase">
							{message.replace('Successfully saved ', '')}
						</span>
					</div>
				{:else}
					<div
						transition:fade={{ duration: 150 }}
						class="col-start-1 row-start-1 flex items-center gap-2 px-2 text-right opacity-40"
					>
						<div class="h-1 w-1 rounded-full bg-neutral-600"></div>
						<span class="text-[9px] font-black tracking-widest text-neutral-600 uppercase"
							>Cloud Synced</span
						>
					</div>
				{/if}
			</div>

			<button
				type="submit"
				disabled={saving || !hasChanges}
				class="group relative flex h-10 items-center justify-center overflow-hidden rounded-full border px-6 text-[10px] font-black tracking-[0.2em] uppercase transition-all md:px-10
				{saving
					? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
					: hasChanges
						? 'border-emerald-500 bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95'
						: 'cursor-not-allowed border-white/5 bg-white/[0.02] text-neutral-500'}"
			>
				{#if saving}
					<div
						class="h-3 w-3 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent"
					></div>
				{:else if hasChanges}
					<span>Deploy Changes</span>
				{:else}
					<div class="flex items-center gap-2">
						<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span class="hidden sm:inline">Up to date</span>
					</div>
				{/if}
			</button>
		</div>
	</div>
</header>

<style>
	@keyframes loading {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(300%);
		}
	}
</style>
