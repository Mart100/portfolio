<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import TripSidepanel from './TripSidepanel.svelte';
	import travelData from '$lib/data/travel.json';

	let activeTripIndex = $state(-1); // -1 means global view (Globe)
	let activeTrip = $derived(activeTripIndex === -1 ? null : travelData.trips[activeTripIndex]);
	let selectedNode = $state<any>(null);

	// Components loaded dynamically to prevent SSR issues and improve performance
	let Globe = $state<any>(null);
	let MapLibreView = $state<any>(null);

	// Reset selected node when trip changes
	$effect(() => {
		if (activeTripIndex !== -1) {
			selectedNode = null;
		}
	});

	onMount(async () => {
		if (browser) {
			const [GlobeMod, MapMod] = await Promise.all([
				import('./Globe.svelte'),
				import('./MapLibreView.svelte')
			]);
			Globe = GlobeMod.default;
			MapLibreView = MapMod.default;
		}
	});

	function handleNodeClick(node: any) {
		selectedNode = node;
	}
</script>

<section id="travel" class="overflow-hidden border-t border-white/5 py-32">
	<div class="mx-auto max-w-7xl px-6">
		<div class="mb-20 flex flex-col justify-between gap-6 md:flex-row md:items-end">
			<div class="space-y-4">
				<div class="flex items-center gap-3">
					<div class="h-px w-8 bg-emerald-500/50"></div>
					<span class="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase">
						Digital Nomad
					</span>
				</div>
				<h2 class="text-3xl font-medium tracking-tight text-white md:text-5xl">
					Travel <span class="text-gray-500 italic">Log.</span>
				</h2>
				<p class="max-w-md text-gray-400">
					Mapping out the patches of the world I've explored. Toggle trips to see detailed routes
					and local nodes.
				</p>
			</div>

			{#if activeTripIndex !== -1}
				<button
					onclick={() => (activeTripIndex = -1)}
					class="group flex items-center gap-2 text-[10px] font-bold tracking-widest text-emerald-400 uppercase transition-colors hover:text-white"
				>
					<span class="transition-transform group-hover:-translate-x-1">←</span>
					Back to Globe
				</button>
			{/if}
		</div>

		<div
			class="grid grid-cols-1 gap-px overflow-hidden rounded-[32px] border border-white/5 bg-white/[0.02] shadow-2xl lg:grid-cols-12"
		>
			<!-- Timeline Sidebar -->
			<div
				class="flex h-[600px] flex-col border-r border-white/5 bg-black/40 backdrop-blur-xl lg:col-span-4"
			>
				<TripSidepanel
					{activeTrip}
					allTrips={travelData.trips}
					onTripSelect={(index) => (activeTripIndex = index)}
					onNodeClick={handleNodeClick}
					onBackToList={() => (activeTripIndex = -1)}
				/>
			</div>

			<!-- Interactive Visualization -->
			<div class="relative h-[600px] bg-black lg:col-span-8">
				<div class="absolute inset-0" class:hidden={activeTripIndex !== -1}>
					{#if Globe}
						<Globe
							visitedCountries={travelData.visited}
							places={travelData.places}
							isVisible={activeTripIndex === -1}
						/>
					{:else}
						<div
							class="flex h-full items-center justify-center font-mono text-[10px] tracking-widest text-white/20 uppercase"
						>
							Initializing Globe...
						</div>
					{/if}
				</div>

				{#if MapLibreView}
					<div class="absolute inset-0" class:hidden={activeTripIndex === -1}>
						<MapLibreView {activeTrip} {selectedNode} isVisible={activeTripIndex !== -1} />
					</div>
				{:else if activeTripIndex !== -1}
					<div
						class="flex h-full items-center justify-center font-mono text-[10px] tracking-widest text-white/20 uppercase"
					>
						Initializing Map System...
					</div>
				{/if}

				<!-- HUD -->
				<div class="pointer-events-none absolute bottom-8 left-8">
					<div class="space-y-2">
						<div class="flex items-center gap-3">
							<div class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></div>
							<span class="text-[10px] font-bold tracking-widest text-white uppercase">
								{activeTripIndex === -1 ? 'Globe Exploration' : 'Mapping ' + activeTrip?.name}
							</span>
						</div>
						<div class="font-mono text-[9px] tracking-tight text-gray-500 uppercase">
							{activeTripIndex === -1 ? 'Click countries to view nodes' : '52.3676° N, 4.9041° E'}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
