<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import TripSidepanel from './TripSidepanel.svelte';
	import TripLightbox from './TripLightbox.svelte';
	import type { TravelData, Trip, TripNode } from '$lib/types';

	let { travelData = { visited: [], trips: [], places: [] } } = $props<{
		travelData: TravelData;
	}>();

	let activeTripIndex = $state(-1); // -1 means global view (Globe)
	let activeTrip = $derived(
		activeTripIndex === -1 ? null : (travelData.trips[activeTripIndex] as Trip)
	);
	let selectedNode = $state<TripNode | null>(null);
	let mobileTab = $state<'list' | 'map'>('map');
	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);

	// Components loaded dynamically to prevent SSR issues and improve performance
	let Globe = $state<any>(null);
	let MapLibreView = $state<any>(null);

	// Reset selected node when trip changes
	$effect(() => {
		if (activeTripIndex !== -1) {
			selectedNode = null;
		} else {
			lightboxOpen = false;
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

	function handleNodeClick(node: TripNode) {
		selectedNode = node;
	}

	function openLightbox(index: number) {
		lightboxIndex = index;
		lightboxOpen = true;
	}
</script>

<section id="travel" class="overflow-hidden border-t border-white/5 py-16 md:py-32">
	<div class="mx-auto max-w-7xl px-6">
		<div class="mb-12 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
			<div class="space-y-4">
				<div class="flex items-center gap-3">
					<div class="h-px w-8 bg-emerald-400/50"></div>
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
					class="group hidden items-center gap-2 text-[10px] font-bold tracking-widest text-emerald-400 uppercase transition-colors hover:text-white md:flex"
				>
					<span class="transition-transform group-hover:-translate-x-1">←</span>
					Back to Globe
				</button>
			{/if}
		</div>

		<div
			class="relative grid grid-cols-1 overflow-hidden rounded-[32px] border border-white/5 bg-white/[0.02] shadow-2xl lg:grid-cols-12"
		>
			<!-- Mobile Tab Switcher -->
			<div class="flex border-b border-white/5 bg-black/40 lg:hidden">
				{#if activeTripIndex !== -1 && mobileTab === 'list'}
					<button
						onclick={() => (activeTripIndex = -1)}
						class="flex items-center justify-center border-r border-white/5 px-6 text-emerald-400 transition-colors active:bg-white/5"
						aria-label="Back to all trips"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2.5"
							stroke="currentColor"
							class="h-4 w-4"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
							/>
						</svg>
					</button>
				{/if}
				<button
					onclick={() => (mobileTab = 'map')}
					class="flex-1 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all {mobileTab ===
					'map'
						? 'text-emerald-400'
						: 'text-gray-500'}"
				>
					Visual
					{#if mobileTab === 'map'}
						<div class="mx-auto mt-1 h-0.5 w-4 bg-emerald-400"></div>
					{/if}
				</button>
				<div class="w-px bg-white/5"></div>
				<button
					onclick={() => (mobileTab = 'list')}
					class="flex-1 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all {mobileTab ===
					'list'
						? 'text-emerald-400'
						: 'text-gray-500'}"
				>
					{activeTripIndex === -1 ? 'Details' : 'Trip Nodes'}
					{#if mobileTab === 'list'}
						<div class="mx-auto mt-1 h-0.5 w-4 bg-emerald-400"></div>
					{/if}
				</button>
			</div>

			<!-- Timeline Sidebar -->
			<div
				class="flex h-[450px] flex-col border-white/5 bg-black/40 backdrop-blur-xl {mobileTab ===
				'list'
					? 'flex'
					: 'hidden'} lg:col-span-4 lg:flex lg:h-[600px] lg:border-r"
			>
				<TripSidepanel
					{activeTrip}
					allTrips={travelData.trips}
					onTripSelect={(index) => {
						activeTripIndex = index;
						lightboxOpen = false;
					}}
					onNodeClick={(node) => {
						handleNodeClick(node);
					}}
					onBackToList={() => {
						activeTripIndex = -1;
						lightboxOpen = false;
					}}
					onImageClick={openLightbox}
				/>
			</div>

			<!-- Interactive Visualization -->
			<div
				class="relative h-[450px] bg-black {mobileTab === 'map'
					? 'block'
					: 'hidden'} lg:col-span-8 lg:block lg:h-[600px]"
			>
				<!-- Show Globe: Always on mobile map tab, or on desktop when no trip is active -->
				<div class="absolute inset-0" class:lg:hidden={activeTripIndex !== -1} class:block={true}>
					{#if Globe}
						<Globe
							visitedCountries={travelData.visited}
							places={travelData.places}
							isVisible={mobileTab === 'map' || activeTripIndex === -1}
						/>
					{:else}
						<div
							class="flex h-full items-center justify-center font-mono text-[10px] tracking-widest text-white/20 uppercase"
						>
							Initializing Globe...
						</div>
					{/if}
				</div>

				<!-- Show Map: Only on desktop when a trip is active -->
				{#if MapLibreView}
					<div class="absolute inset-0 hidden lg:block" class:lg:hidden={activeTripIndex === -1}>
						<MapLibreView {activeTrip} {selectedNode} isVisible={activeTripIndex !== -1} />
					</div>
				{:else if activeTripIndex !== -1}
					<div
						class="absolute inset-0 hidden items-center justify-center font-mono text-[10px] tracking-widest text-white/20 uppercase lg:flex"
					>
						Initializing Map System...
					</div>
				{/if}

				<!-- HUD -->
				<div class="pointer-events-none absolute bottom-8 left-8">
					<div class="space-y-1 lg:space-y-2">
						<div class="flex items-center gap-3">
							<div class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></div>
							<span
								class="text-[9px] font-bold tracking-widest text-white uppercase md:text-[10px]"
							>
								{activeTripIndex === -1 ? 'Globe Exploration' : 'Mapping ' + activeTrip?.name}
							</span>
						</div>
						<div class="font-mono text-[8px] tracking-tight text-gray-500 uppercase md:text-[9px]">
							{activeTripIndex === -1 ? 'Click countries to view nodes' : '52.3676° N, 4.9041° E'}
						</div>
					</div>
				</div>
			</div>

			{#if lightboxOpen && activeTrip}
				<TripLightbox
					nodes={activeTrip.path}
					bind:index={lightboxIndex}
					onclose={() => (lightboxOpen = false)}
					onnavigate={(node) => handleNodeClick(node)}
				/>
			{/if}
		</div>
	</div>
</section>
