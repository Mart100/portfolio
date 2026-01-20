<script lang="ts">
	let status = $state('NEURAL_LINK_STABLE');
</script>

<div class="border border-white/10 bg-surface/40 p-4 font-mono backdrop-blur-sm">
	<div class="mb-4 flex items-center justify-between border-b border-white/10 pb-2 text-[10px]">
		<span class="font-bold tracking-widest text-primary">[ OPERATOR_ID ]</span>
		<span class="text-gray-500">v1.0.4</span>
	</div>

	<div class="flex items-start gap-4">
		<div class="relative h-16 w-16 border border-primary/30 p-1">
			<div
				class="flex h-full w-full items-center justify-center bg-primary/20 text-xl font-bold text-primary"
			>
				MV
			</div>
			<div class="absolute -top-1 -left-1 h-3 w-3 border-t border-l border-primary"></div>
			<div class="absolute -right-1 -bottom-1 h-3 w-3 border-r border-b border-primary"></div>
		</div>

		<div class="flex-1 space-y-1">
			<div class="text-xs font-bold tracking-widest text-white">MART_V</div>
			<div
				class="text-[10px] text-primary uppercase underline decoration-dotted underline-offset-4"
			>
				Senior Systems Architect
			</div>
			<div class="text-[9px] leading-tight text-gray-500">
				Located in: <span class="text-gray-300">0.0.0.0 (Global)</span>
			</div>
		</div>
	</div>

	<div class="mt-4 border-t border-white/5 pt-3">
		<div class="mb-1 text-[9px] tracking-widest text-gray-500 uppercase">Current_Activity</div>
		<div class="flex items-center gap-2 bg-white/5 px-2 py-1 text-[10px] text-white">
			<span class="h-1 w-1 animate-ping rounded-full bg-accent"></span>
			{status}
		</div>
	</div>
</div>
