<script lang="ts">
	let {
		project = $bindable(),
		index,
		total
	} = $props<{
		project: any;
		index: number;
		total: number;
	}>();
</script>

<div
	class="group relative overflow-hidden rounded-2xl border border-white/5 bg-black/40 p-6 transition-all hover:border-emerald-500/30"
>
	<div class="mb-6 flex items-center justify-between">
		<div class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
			<span class="text-[10px] font-black tracking-widest text-emerald-500 uppercase"
				>Entry #{total - index}</span
			>
		</div>
	</div>

	<div class="grid gap-8 md:grid-cols-[140px_1fr]">
		<div class="group/img relative">
			<div
				class="aspect-square overflow-hidden rounded-xl border border-white/10 bg-neutral-800 transition-colors group-hover/img:border-emerald-500/50"
			>
				{#if project.image}
					<img
						src={project.image}
						alt={project.title}
						class="h-full w-full object-cover opacity-80 transition-opacity group-hover/img:opacity-100"
					/>
				{:else}
					<div
						class="flex h-full w-full items-center justify-center text-xs text-neutral-600 italic"
					>
						No Preview
					</div>
				{/if}
			</div>
			<div class="mt-4">
				<label
					for="asset-path-{index}"
					class="mb-1 block text-[10px] font-black tracking-tighter text-neutral-500 uppercase"
					>Asset Path</label
				>
				<input
					id="asset-path-{index}"
					bind:value={project.image}
					class="w-full rounded-lg border border-white/10 bg-black/50 px-2 py-1 text-[10px] transition-all outline-none focus:border-emerald-500"
				/>
			</div>
		</div>

		<div class="space-y-4">
			<div class="grid gap-4 md:grid-cols-2">
				<label class="block space-y-1">
					<span class="text-[9px] font-bold tracking-widest text-emerald-500/70 uppercase"
						>Project Title</span
					>
					<input
						bind:value={project.title}
						class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-bold text-white transition-all outline-none focus:ring-1 focus:ring-emerald-500"
					/>
				</label>
				<label class="block space-y-1">
					<span class="text-[9px] font-bold tracking-widest text-emerald-500/70 uppercase"
						>External Link</span
					>
					<input
						bind:value={project.link}
						class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs transition-all outline-none focus:ring-1 focus:ring-emerald-500"
					/>
				</label>
			</div>

			<label class="block space-y-1">
				<span class="text-[9px] font-bold tracking-widest text-emerald-500/70 uppercase"
					>Description</span
				>
				<textarea
					bind:value={project.description}
					class="h-24 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed transition-all outline-none focus:ring-1 focus:ring-emerald-500"
				></textarea>
			</label>

			<label class="block space-y-1">
				<span class="text-[9px] font-bold tracking-widest text-emerald-500/70 uppercase"
					>Technology Tags</span
				>
				<input
					value={project.tags.join(', ')}
					oninput={(e) =>
						(project.tags = (e.target as HTMLInputElement).value
							.split(',')
							.map((t) => t.trim())
							.filter(Boolean))}
					placeholder="Svelte, Rust, UI..."
					class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm transition-all outline-none focus:ring-1 focus:ring-emerald-500"
				/>
			</label>
		</div>
	</div>
</div>
