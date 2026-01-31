<script lang="ts">
	import type { Trip, TripNode } from '$lib/types';

	let { activeTrip, allTrips, onTripSelect, onNodeClick, onBackToList } = $props<{
		activeTrip: Trip | null;
		allTrips: Trip[];
		onTripSelect: (index: number) => void;
		onNodeClick?: (node: TripNode) => void;
		onBackToList?: () => void;
	}>();

	let selectedNode = $state<TripNode | null>(null);
	let view = $state<'list' | 'detail'>('list');
	let scrollContainer = $state<HTMLDivElement>();

	// Intersection Observer to detect node in view
	$effect(() => {
		if (view === 'detail' && activeTrip && scrollContainer) {
			const options = {
				root: scrollContainer,
				rootMargin: '-20% 0px -70% 0px', // Focus area near the top
				threshold: 0.1
			};

			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const nodeIndex = parseInt(entry.target.getAttribute('data-index') || '0');
						const node = activeTrip!.path[nodeIndex];
						if (selectedNode?.name !== node.name) {
							selectNode(node);
						}
					}
				});
			}, options);

			const nodes = scrollContainer.querySelectorAll('.node-item');
			nodes.forEach((n) => observer.observe(n));

			return () => observer.disconnect();
		}
	});

	function selectNode(node: TripNode) {
		selectedNode = node;
		if (onNodeClick) onNodeClick(node);
	}

	function handleTripSelect(index: number) {
		onTripSelect(index);
		view = 'detail';
	}

	function goBackToList() {
		view = 'list';
		if (onBackToList) onBackToList();
	}
</script>

<div class="relative flex h-full flex-col overflow-hidden">
	{#if view === 'detail' && activeTrip}
		<!-- Header for Detail View -->
		<div
			class="hidden items-center justify-between border-b border-white/5 bg-black/20 p-6 md:flex"
		>
			<button
				class="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase transition-colors hover:text-white"
				onclick={goBackToList}
			>
				← All Trips
			</button>
			<span class="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Trip Path</span>
		</div>

		<!-- Path Nodes (Polarsteps Style) -->
		<div bind:this={scrollContainer} class="custom-scrollbar flex-1 overflow-y-auto px-4">
			<div class="relative ml-4 space-y-12 border-l border-white/10 py-8 pl-8">
				{#each activeTrip.path as node, i (node.name + node.date)}
					<div class="node-item group relative block w-full text-left" data-index={i}>
						<!-- Node Dot -->
						<div
							class="absolute top-1.5 -left-[40px] h-4 w-4 rounded-full border-2 border-black transition-all duration-500
							{selectedNode?.name === node.name ? 'scale-125 bg-white ring-4 ring-white/20' : 'bg-white/40'}"
						></div>

						<div
							class="space-y-4 transition-opacity duration-500 {selectedNode?.name === node.name
								? 'opacity-100'
								: 'opacity-40'}"
						>
							<div class="space-y-1">
								<span class="text-[10px] font-medium tracking-widest text-gray-500 uppercase"
									>{node.date}</span
								>
								<h4 class="text-sm font-medium text-white">{node.name}</h4>
							</div>

							{#if node.image}
								<button
									onclick={() => selectNode(node)}
									class="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-500 outline-none hover:scale-[1.02] active:scale-[0.98]
									{selectedNode?.name === node.name ? 'border-white/30' : ''}"
								>
									<img
										src={node.image}
										alt={node.name}
										class="h-full w-full object-cover transition-all duration-700
										{selectedNode?.name === node.name ? 'scale-105 grayscale-0' : 'grayscale hover:grayscale-0'}"
									/>
								</button>
							{/if}

							<p class="text-xs leading-relaxed text-gray-400">{node.caption}</p>
						</div>
					</div>
				{/each}

				<!-- Spacer to allow scrolling the last item into view -->
				<div class="h-64"></div>
			</div>
		</div>
	{:else}
		<!-- Trip Selection List -->
		<div class="flex flex-1 flex-col p-6">
			<div class="mb-8">
				<span class="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase"
					>Select Journey</span
				>
			</div>

			<div class="space-y-4">
				{#each allTrips as trip, i (trip.id)}
					<button
						class="group w-full rounded-xl border border-white/5 p-4 text-left transition-all hover:bg-white/5
						{activeTrip?.id === trip.id ? 'border-white/20 bg-white/10' : ''}"
						onclick={() => handleTripSelect(i)}
					>
						<span class="mb-1 block text-[10px] font-medium tracking-widest text-gray-500 uppercase"
							>{trip.path.length} Stops</span
						>
						<h4 class="text-sm font-medium text-white transition-colors group-hover:text-primary">
							{trip.name}
						</h4>
						<p class="mt-1 line-clamp-1 text-xs text-gray-500">{trip.description}</p>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
	}
</style>
