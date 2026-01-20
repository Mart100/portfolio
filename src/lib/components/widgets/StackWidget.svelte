<script lang="ts">
	const stacks = [
		{ category: 'Runtime', items: ['Bun', 'Node.js', 'V8'] },
		{ category: 'Frontend', items: ['Svelte 5', 'Tailwind', 'Wasm'] },
		{ category: 'Systems', items: ['Rust', 'PostgreSQL', 'Redis'] },
		{ category: 'DevOps', items: ['Docker', 'Nginx', 'CIs'] }
	];
</script>

<div class="h-full border border-white/10 bg-surface/40 p-4 font-mono backdrop-blur-sm">
	<div class="mb-4 flex items-center justify-between border-b border-white/10 pb-2 text-[10px]">
		<span class="font-bold tracking-widest text-primary">[ TECH_STACK ]</span>
		<span class="text-gray-500 italic">compiled.bin</span>
	</div>

	<div class="grid grid-cols-1 gap-4 overflow-hidden">
		{#each stacks as stack}
			<div class="space-y-1.5">
				<div
					class="flex items-center gap-2 text-[9px] font-bold tracking-widest text-gray-500 uppercase"
				>
					<span class="h-1 w-1 bg-white/20"></span>
					{stack.category}
				</div>
				<div class="flex flex-wrap gap-1.5">
					{#each stack.items as item}
						<span
							class="border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] text-white transition-colors hover:border-primary/50"
						>
							{item}
						</span>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
