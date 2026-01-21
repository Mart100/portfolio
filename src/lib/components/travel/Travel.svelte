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
				<h2 class="text-3xl font-medium tracking-tight">Travel Log</h2>
				<div class="h-px w-12 bg-white/20"></div>
				<p class="max-w-md text-gray-500">
					From global perspectives to local paths. Toggle trips to see detailed routes on the map.
				</p>
			</div>

			{#if activeTripIndex !== -1}
				<button
					onclick={() => (activeTripIndex = -1)}
					class="text-[10px] font-bold tracking-widest text-white/40 uppercase transition-colors hover:text-white"
				>
					Back to Globe →
				</button>
			{/if}
		</div>

		<div
			class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 shadow-2xl lg:grid-cols-12"
		>
			<!-- Timeline Sidebar -->
			<div class="flex h-[600px] flex-col bg-black/40 backdrop-blur-xl lg:col-span-4">
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
				<div class="pointer-events-none absolute bottom-6 left-6">
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<div class="h-2 w-2 animate-pulse rounded-full bg-white"></div>
							<span class="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
								System: {activeTripIndex === -1 ? 'Globe Mode' : 'Map Mode'}
							</span>
						</div>
						<div class="font-mono text-[9px] text-gray-600 uppercase">
							{activeTripIndex === -1 ? 'Rotate to Explore' : 'Viewing ' + activeTrip?.name}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
