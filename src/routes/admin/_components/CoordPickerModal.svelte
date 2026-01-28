<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { fade, scale } from 'svelte/transition';

	let {
		isOpen = $bindable(false),
		lat = $bindable(),
		lng = $bindable(),
		title = 'Select Location'
	} = $props<{
		isOpen: boolean;
		lat: number;
		lng: number;
		title?: string;
	}>();

	let mapContainer = $state<HTMLDivElement>();
	let map: maplibregl.Map | null = null;
	let marker: maplibregl.Marker | null = null;

	function initMap() {
		if (!mapContainer) return;

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
			center: [lng || 0, lat || 0],
			zoom: lat && lng ? 8 : 2,
			attributionControl: false
		});

		marker = new maplibregl.Marker({
			draggable: true,
			color: '#10b981'
		})
			.setLngLat([lng || 0, lat || 0])
			.addTo(map);

		marker.on('dragend', () => {
			const pos = marker!.getLngLat();
			lat = Number(pos.lat.toFixed(6));
			lng = Number(pos.lng.toFixed(6));
		});

		map.on('click', (e) => {
			const pos = e.lngLat;
			marker?.setLngLat(pos);
			lat = Number(pos.lat.toFixed(6));
			lng = Number(pos.lng.toFixed(6));
		});
	}

	$effect(() => {
		if (isOpen) {
			// Small delay to ensure container is rendered
			setTimeout(initMap, 50);
		} else {
			map?.remove();
			map = null;
		}
	});

	onDestroy(() => {
		map?.remove();
	});

	function close() {
		isOpen = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
		transition:fade={{ duration: 200 }}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- Backdrop -->
		<button
			type="button"
			class="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
			onclick={close}
			aria-label="Close modal"
		></button>

		<!-- Modal Content -->
		<div
			class="relative flex h-full max-h-[800px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl"
			transition:scale={{ start: 0.95, duration: 200 }}
		>
			<div class="flex items-center justify-between border-b border-white/5 p-6">
				<div>
					<h3 class="text-lg font-black tracking-tighter text-white uppercase">{title}</h3>
					<p class="mt-1 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
						Drag marker or click map to set coordinates
					</p>
				</div>
				<button
					type="button"
					onclick={close}
					aria-label="Close coordinate picker"
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
				>
					<svg
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
					>
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="relative flex-1 bg-black">
				<div bind:this={mapContainer} class="h-full w-full"></div>

				<div class="pointer-events-none absolute right-6 bottom-6 left-6 flex justify-center">
					<div
						class="pointer-events-auto flex gap-4 rounded-2xl border border-white/10 bg-black/80 px-6 py-3 shadow-2xl backdrop-blur-xl"
					>
						<div class="space-y-1">
							<span class="block text-[8px] font-black text-neutral-500 uppercase">Latitude</span>
							<span class="font-mono text-xs text-emerald-400">{lat}</span>
						</div>
						<div class="w-px bg-white/10"></div>
						<div class="space-y-1">
							<span class="block text-[8px] font-black text-neutral-500 uppercase">Longitude</span>
							<span class="font-mono text-xs text-emerald-400">{lng}</span>
						</div>
					</div>
				</div>
			</div>

			<div class="flex justify-end border-t border-white/5 p-6">
				<button
					type="button"
					onclick={close}
					class="rounded-xl bg-emerald-500 px-8 py-3 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
				>
					Save Coordinates
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(.maplibregl-ctrl-attrib) {
		display: none;
	}
</style>
