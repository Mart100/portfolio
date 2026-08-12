<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';

	interface Place {
		name: string;
		lat: number;
		lng: number;
	}

	let { places = $bindable() } = $props<{
		places: Place[];
	}>();

	let mapContainer = $state<HTMLDivElement>();
	let map: maplibregl.Map | null = null;
	let markers = new SvelteMap<Place, maplibregl.Marker>();
	let isLoaded = $state(false);
	let selectedPlace = $state<Place | null>(null);
	let isDraggingMarker = false;

	// Center map on selected place
	$effect(() => {
		if (selectedPlace && map) {
			map.flyTo({
				center: [selectedPlace.lng, selectedPlace.lat],
				zoom: map.getZoom() < 4 ? 4 : map.getZoom(),
				duration: 1000
			});
		}
	});

	onMount(() => {
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
			center: [0, 0],
			zoom: 1,
			attributionControl: false
		});

		map.on('load', () => {
			isLoaded = true;
			syncMarkers();
		});

		map.on('click', (e) => {
			if (isDraggingMarker) return;

			// Check if we clicked on a marker element or its children
			const target = e.originalEvent.target as HTMLElement;
			if (target.closest('.admin-marker')) return;

			if (selectedPlace) {
				selectedPlace = null;
			} else {
				addNewMarkerAtClick(e);
			}
		});

		// Ensure map resizes when container resizes
		const resizeObserver = new ResizeObserver(() => {
			map?.resize();
		});
		if (mapContainer) {
			resizeObserver.observe(mapContainer);
		}
	});

	onDestroy(() => {
		map?.remove();
	});

	function syncMarkers() {
		if (!map || !isLoaded || !places) return;

		// 1. Clean up stale markers
		for (const [place, marker] of markers.entries()) {
			if (!places.includes(place)) {
				marker.remove();
				markers.delete(place);
			}
		}

		// 2. Sync markers
		places.forEach((place: Place) => {
			let marker = markers.get(place);

			if (!marker) {
				const el = document.createElement('div');
				el.className = 'admin-marker';
				el.innerHTML = `
					<div class="marker-pin"></div>
					<div class="marker-label">${place.name}</div>
				`;

				el.addEventListener('click', (e) => {
					e.stopPropagation();
					if (isDraggingMarker) return;

					if (selectedPlace === place) {
						const newName = prompt('Rename this place:', place.name);
						if (newName !== null && newName.trim() !== '') {
							place.name = newName.trim();
							const label = el.querySelector('.marker-label');
							if (label) label.textContent = place.name;
						}
					}
					selectedPlace = place;
				});

				el.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (confirm(`Remove "${place.name}"?`)) {
						places = places.filter((p: Place) => p !== place);
					}
				});

				marker = new maplibregl.Marker({
					element: el,
					draggable: true,
					anchor: 'center'
				})
					.setLngLat([place.lng, place.lat])
					.addTo(map!);

				marker.on('dragstart', () => {
					isDraggingMarker = true;
					selectedPlace = place;
				});

				marker.on('dragend', () => {
					const lngLat = marker!.getLngLat();
					place.lat = Number(lngLat.lat.toFixed(6));
					place.lng = Number(lngLat.lng.toFixed(6));
					// Small timeout to skip the click event that might follow dragend
					setTimeout(() => {
						isDraggingMarker = false;
					}, 100);
				});

				markers.set(place, marker);
			}

			// 3. Update state
			const markerElement = marker.getElement();
			const label = markerElement.querySelector('.marker-label');
			if (label) label.textContent = place.name;

			if (selectedPlace === place) {
				markerElement.classList.add('is-active');
			} else {
				markerElement.classList.remove('is-active');
			}

			const currentPos = marker.getLngLat();
			if (
				Math.abs(currentPos.lat - place.lat) > 0.00001 ||
				Math.abs(currentPos.lng - place.lng) > 0.00001
			) {
				marker.setLngLat([place.lng, place.lat]);
			}
		});
	}

	$effect(() => {
		if (isLoaded && places) {
			syncMarkers();
		}
	});

	export function flyTo(lat: number, lng: number) {
		const place = places.find((p: Place) => p.lat === lat && p.lng === lng);
		if (place) {
			selectedPlace = place;
		} else {
			// Fallback if reference matching fails
			map?.flyTo({ center: [lng, lat], zoom: 10 });
		}
	}

	function addNewMarkerAtClick(e: maplibregl.MapMouseEvent) {
		const lngLat = e.lngLat;
		const newPlace = {
			name: 'New Marker',
			lat: Number(lngLat.lat.toFixed(6)),
			lng: Number(lngLat.lng.toFixed(6))
		};
		places = [newPlace, ...places];

		// Wait for sync then select
		setTimeout(() => {
			selectedPlace = newPlace;
		}, 0);
	}
</script>

<div class="relative h-[400px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black">
	<div bind:this={mapContainer} class="h-full w-full"></div>
</div>

<style>
	:global(.maplibregl-ctrl-attrib) {
		display: none;
	}

	:global(.admin-marker) {
		display: block;
		width: 0;
		height: 0;
		position: relative;
		z-index: 1;
	}

	:global(.admin-marker.is-active) {
		z-index: 100;
	}

	:global(.marker-pin) {
		position: absolute;
		top: 0;
		left: 0;
		transform: translate(-50%, -50%);
		width: 14px;
		height: 14px;
		background: #10b981;
		border-radius: 50%;
		border: 2px solid white;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		cursor: pointer;
		transition: all 0.2s;
		z-index: 2;
	}

	:global(.marker-label) {
		position: absolute;
		bottom: 15px;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(0, 0, 0, 0.85);
		color: white;
		padding: 4px 10px;
		border-radius: 8px;
		font-size: 10px;
		font-weight: bold;
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		transition: all 0.2s;
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(4px);
		z-index: 1;
	}

	:global(.admin-marker:hover .marker-label),
	:global(.admin-marker.is-active .marker-label) {
		opacity: 1;
		bottom: 20px;
	}

	:global(.admin-marker.is-active .marker-pin) {
		transform: translate(-50%, -50%) scale(1.3);
		background: #34d399;
		box-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
	}
</style>
