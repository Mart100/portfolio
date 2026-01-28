<script lang="ts">
	import { slide } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import CoordPickerModal from './CoordPickerModal.svelte';
	import ImagePickerModal from './ImagePickerModal.svelte';

	let {
		trip = $bindable(),
		index,
		isExpanded,
		onToggle,
		onRemove
	} = $props<{
		trip: any;
		index: number;
		isExpanded: boolean;
		onToggle: () => void;
		onRemove: () => void;
	}>();

	let mapContainer = $state<HTMLDivElement>();
	let map: maplibregl.Map | null = null;
	let isLoaded = $state(false);

	// Modal state
	let isPickerOpen = $state(false);
	let isImagePickerOpen = $state(false);
	let activePointIndex = $state<number | null>(null);

	function addPathPoint() {
		trip.path = [
			...trip.path,
			{
				name: '',
				lat: 0,
				lng: 0,
				date: '',
				caption: '',
				image: ''
			}
		];
	}

	function removePathPoint(pIndex: number) {
		trip.path = trip.path.filter((_: any, i: number) => i !== pIndex);
	}

	function openPicker(pIndex: number) {
		activePointIndex = pIndex;
		isPickerOpen = true;
	}

	function initMap() {
		if (!mapContainer || map) return;

		map = new maplibregl.Map({
			container: mapContainer,
			style: {
				version: 8,
				sources: {
					'raster-tiles': {
						type: 'raster',
						tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'],
						tileSize: 256,
						attribution: '&copy; OpenStreetMap &copy; CARTO'
					}
				},
				layers: [
					{
						id: 'simple-tiles',
						type: 'raster',
						source: 'raster-tiles',
						minzoom: 0,
						maxzoom: 22
					}
				]
			},
			center: [0, 0],
			zoom: 1,
			attributionControl: false
		});

		map.on('load', () => {
			isLoaded = true;
			updateMap();
		});
	}

	function updateMap() {
		if (!map || !isLoaded) return;

		const points = trip.path.filter((p: any) => p.lat !== 0 || p.lng !== 0);
		const sourceId = 'trip-path';
		const lineLayerId = 'trip-line';
		const pointLayerId = 'trip-points';

		const geojson: any = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: points.map((p: any) => [p.lng, p.lat])
					}
				},
				...points.map((p: any) => ({
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [p.lng, p.lat]
					}
				}))
			]
		};

		if (map.getSource(sourceId)) {
			(map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geojson);
		} else {
			map.addSource(sourceId, { type: 'geojson', data: geojson });
			map.addLayer({
				id: lineLayerId,
				type: 'line',
				source: sourceId,
				paint: { 'line-color': '#10b981', 'line-width': 2, 'line-dasharray': [2, 2] }
			});
			map.addLayer({
				id: pointLayerId,
				type: 'circle',
				source: sourceId,
				filter: ['==', '$type', 'Point'],
				paint: {
					'circle-radius': 4,
					'circle-color': '#10b981',
					'circle-stroke-width': 2,
					'circle-stroke-color': '#fff'
				}
			});
		}

		if (points.length > 0) {
			const bounds = new maplibregl.LngLatBounds();
			points.forEach((p: any) => bounds.extend([p.lng, p.lat]));
			map.fitBounds(bounds, { padding: 40, maxZoom: 10 });
		}
	}

	$effect(() => {
		if (isExpanded) {
			setTimeout(initMap, 400); // Wait for slide transition
		} else {
			map?.remove();
			map = null;
			isLoaded = false;
		}
	});

	$effect(() => {
		if (isLoaded && trip.path) {
			updateMap();
		}
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<div
	class="overflow-hidden rounded-3xl border border-white/5 bg-black/30 {isExpanded
		? 'shadow-lg ring-1 shadow-emerald-500/5 ring-emerald-500/20'
		: ''}"
>
	<button
		onclick={onToggle}
		type="button"
		aria-label={isExpanded ? 'Collapse trip detail' : 'Expand trip detail'}
		class="group flex w-full items-center justify-between p-6"
	>
		<div class="flex items-center gap-4">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-neutral-500 transition-colors group-hover:text-emerald-500"
			>
				{index + 1}
			</div>
			<div class="text-left">
				<span class="mb-1 block text-[9px] font-black tracking-widest text-emerald-500 uppercase"
					>{trip.id}</span
				>
				<h4
					class="text-lg font-black tracking-tighter transition-colors group-hover:text-emerald-400"
				>
					{trip.name || 'Untitled Discovery'}
				</h4>
			</div>
		</div>
		<div class="flex items-center gap-6">
			<div class="hidden text-right md:block">
				<span class="text-[10px] font-bold tracking-widest text-neutral-600 uppercase"
					>Route Intensity</span
				>
				<div class="mt-1 flex justify-end gap-1">
					{#each { length: Math.min(5, trip.path?.length || 0) } as _, i (i)}
						<div class="h-1 w-2.5 rounded-full bg-emerald-500"></div>
					{/each}
				</div>
			</div>
			<svg
				class="h-5 w-5 transition-transform duration-300 {isExpanded ? 'rotate-180' : ''}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 9l-7 7-7-7"
				/></svg
			>
		</div>
	</button>

	{#if isExpanded}
		<div transition:slide class="border-t border-white/5 bg-black/20">
			<!-- Top Section: Generic Info -->
			<div class="p-8">
				<div class="grid gap-8 md:grid-cols-2">
					<div class="space-y-6">
						<div class="grid grid-cols-2 gap-4">
							<label class="space-y-1">
								<span class="pb-1 text-[9px] font-black text-neutral-500 uppercase">Ident</span>
								<input
									bind:value={trip.id}
									class="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-2 font-mono text-xs"
								/>
							</label>
							<label class="space-y-1">
								<span class="pb-1 text-[9px] font-black text-neutral-500 uppercase">Name</span>
								<input
									bind:value={trip.name}
									class="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-2"
								/>
							</label>
							<label class="space-y-1">
								<span class="pb-1 text-[9px] font-black text-neutral-500 uppercase"
									>Launch Date</span
								>
								<input
									type="date"
									bind:value={trip.startDate}
									class="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-2 text-xs"
								/>
							</label>
							<label class="space-y-1">
								<span class="pb-1 text-[9px] font-black text-neutral-500 uppercase">End Date</span>
								<input
									type="date"
									bind:value={trip.endDate}
									class="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-2 text-xs"
								/>
							</label>
							<label class="col-span-2 space-y-1">
								<span class="pb-1 text-[9px] font-black text-neutral-500 uppercase"
									>Assets Base Path</span
								>
								<input
									bind:value={trip.basePath}
									placeholder="travel/germany"
									class="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-2 text-xs"
								/>
							</label>
						</div>
						<label class="block">
							<span class="pb-1 text-[9px] font-black text-neutral-500 uppercase">Briefing</span>
							<textarea
								bind:value={trip.description}
								class="h-32 w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm leading-relaxed"
							></textarea>
						</label>
						<button
							type="button"
							onclick={onRemove}
							class="text-[10px] font-black tracking-widest text-red-500/50 uppercase transition-colors hover:text-red-500"
							>Terminate Mission Entry</button
						>
					</div>

					<!-- Visual Context: Small Preview Map -->
					<div class="relative overflow-hidden rounded-3xl border border-white/5 bg-black">
						<div bind:this={mapContainer} class="h-full min-h-[300px] w-full"></div>
						<div
							class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity"
							class:opacity-100={!isLoaded}
						>
							<div class="flex items-center gap-3">
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"
								></div>
								<span class="text-[10px] font-black tracking-widest text-emerald-500 uppercase"
									>Initializing Radar...</span
								>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Bottom Section: Navigation Points -->
			<div class="border-t border-white/5 bg-neutral-950/50 p-8">
				<div class="mb-6 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="h-px w-8 bg-emerald-500/50"></div>
						<span class="text-[10px] font-black tracking-[0.3em] text-emerald-400 uppercase"
							>Navigation Points</span
						>
					</div>
					<button
						type="button"
						onclick={addPathPoint}
						class="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[10px] font-black tracking-widest text-emerald-400 uppercase transition-all hover:scale-105 hover:bg-emerald-500/20 active:scale-95"
					>
						<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path
								d="M12 5v14M5 12h14"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						Deploy Additive
					</button>
				</div>

				<div class="grid grid-cols-1 gap-6">
					{#each trip.path as point, pi (pi)}
						<div
							class="group/point relative rounded-3xl border border-white/5 bg-neutral-900/40 p-6 transition-all hover:bg-neutral-900/60"
						>
							<button
								type="button"
								onclick={() => removePathPoint(pi)}
								aria-label="Remove point"
								class="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition-opacity group-hover/point:opacity-100 hover:scale-110 active:scale-90"
							>
								<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M18 6L6 18M6 6l12 12" stroke-width="4" stroke-linecap="round" />
								</svg>
							</button>

							<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<div class="space-y-4">
									<label class="block space-y-1">
										<span class="text-[8px] font-black text-neutral-600 uppercase">Location</span>
										<input
											bind:value={point.name}
											placeholder="Destination Name"
											class="w-full border-b border-white/5 bg-transparent py-1 text-sm font-bold text-white outline-none focus:border-emerald-500"
										/>
									</label>

									<label class="block space-y-1">
										<span class="text-[8px] font-black text-neutral-600 uppercase">Date</span>
										<input
											type="date"
											bind:value={point.date}
											class="w-full border-b border-white/5 bg-transparent py-1 text-xs text-neutral-400 outline-none focus:border-emerald-500"
										/>
									</label>

									<div class="grid grid-cols-2 gap-2">
										<div class="space-y-1">
											<span class="text-[8px] font-black text-neutral-600 uppercase">Lat</span>
											<input
												type="number"
												step="any"
												bind:value={point.lat}
												class="w-full rounded bg-white/5 px-2 py-1 font-mono text-[10px] text-emerald-400"
											/>
										</div>
										<div class="space-y-1">
											<span class="text-[8px] font-black text-neutral-600 uppercase">Lng</span>
											<input
												type="number"
												step="any"
												bind:value={point.lng}
												class="w-full rounded bg-white/5 px-2 py-1 font-mono text-[10px] text-emerald-400"
											/>
										</div>
									</div>

									<button
										type="button"
										onclick={() => openPicker(pi)}
										class="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-[9px] font-black tracking-widest text-neutral-400 uppercase transition-all hover:bg-white/10 hover:text-white"
									>
										<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
											<path
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
												stroke-width="2"
											/>
											<path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" />
										</svg>
										Pick on Map
									</button>
								</div>

								<div class="space-y-4">
									<label class="block space-y-1">
										<span class="text-[8px] font-black text-neutral-600 uppercase">Thumbnail</span>
										<div class="flex items-center gap-2">
											<input
												bind:value={point.image}
												placeholder="/images/travel/..."
												class="w-full border-b border-white/5 bg-transparent py-1 text-[10px] text-neutral-500 outline-none focus:border-emerald-500"
											/>
											<button
												type="button"
												onclick={() => {
													activePointIndex = pi;
													isImagePickerOpen = true;
												}}
												class="rounded bg-white/5 px-2 py-1 text-[8px] font-black tracking-widest text-neutral-400 uppercase transition-all hover:bg-white/10 hover:text-white"
											>
												Browse
											</button>
										</div>
									</label>

									<label class="block space-y-1">
										<span class="text-[8px] font-black text-neutral-600 uppercase">Caption</span>
										<textarea
											bind:value={point.caption}
											placeholder="Brief memories..."
											class="h-[84px] w-full border-b border-white/5 bg-transparent py-1 text-xs text-neutral-300 outline-none focus:border-emerald-500"
										></textarea>
									</label>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

{#if activePointIndex !== null}
	<CoordPickerModal
		bind:isOpen={isPickerOpen}
		bind:lat={trip.path[activePointIndex].lat}
		bind:lng={trip.path[activePointIndex].lng}
		title="Set Coordinates: {trip.path[activePointIndex].name || 'New Point'}"
	/>
{/if}

{#if activePointIndex !== null}
	<ImagePickerModal
		bind:isOpen={isImagePickerOpen}
		basePath={trip.basePath}
		onSelect={(url) => {
			if (activePointIndex !== null) {
				trip.path[activePointIndex].image = url;
			}
		}}
	/>
{/if}

<style>
	:global(.maplibregl-ctrl-attrib) {
		display: none;
	}
</style>
