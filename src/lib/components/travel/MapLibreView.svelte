<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import 'maplibre-gl/dist/maplibre-gl.css';

	let { activeTrip, selectedNode, isVisible } = $props<{
		activeTrip: any;
		selectedNode: any;
		isVisible: boolean;
	}>();

	let mapContainer: HTMLDivElement;
	let map: any = null;
	let ml: any = null; // Store maplibre-gl library reference
	let isLoaded = $state(false);
	let isFirstNodeForTrip = $state(true);
	let lastTripId = $state<string | null>(null);

	onMount(async () => {
		if (!browser) return;

		const maplibregl = await import('maplibre-gl');
		ml = maplibregl.default;

		if (!mapContainer) return;

		map = new ml.Map({
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
			center: [selectedNode?.lng || 0, selectedNode?.lat || 0],
			zoom: 2,
			attributionControl: false
		});

		map.on('load', () => {
			isLoaded = true;
			updateTripPath();
			updateSelectedNodeHighlight();
		});
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});

	// Watch for visibility changes to resize the map
	$effect(() => {
		if (isVisible && map && isLoaded) {
			requestAnimationFrame(() => {
				map?.resize();
				updateTripPath();
			});
		}
	});

	// Watch for trip changes
	$effect(() => {
		if (!activeTrip) {
			lastTripId = null;
			return;
		}

		if (map && isLoaded && isVisible) {
			if (activeTrip.id !== lastTripId) {
				isFirstNodeForTrip = true;
				lastTripId = activeTrip.id;
			}
			updateTripPath();
		}
	});

	// Watch for selected node changes to fly to it
	$effect(() => {
		if (selectedNode && map && isLoaded && isVisible) {
			let targetZoom;

			if (isFirstNodeForTrip) {
				// Zoom in to the node on initial entry/selection
				targetZoom = 12;
			} else {
				// While scrolling, stay at the zoom level that shows the entire trip
				const bounds = getTripBounds();
				const camera = bounds ? map.cameraForBounds(bounds, { padding: 80 }) : null;
				targetZoom = camera?.zoom || map.getZoom();
			}

			map.flyTo({
				center: [selectedNode.lng, selectedNode.lat],
				zoom: targetZoom,
				duration: 2000,
				essential: true
			});

			isFirstNodeForTrip = false;
			updateSelectedNodeHighlight();
		}
	});

	function getTripBounds() {
		if (!activeTrip || !activeTrip.path || activeTrip.path.length === 0 || !ml) return null;
		const path = activeTrip.path;
		const coordinates = path.map((p: any) => [p.lng, p.lat] as [number, number]);
		return coordinates.reduce(
			(acc: any, coord: [number, number]) => acc.extend(coord),
			new ml.LngLatBounds(coordinates[0], coordinates[0])
		);
	}

	function updateSelectedNodeHighlight() {
		if (!map || !isLoaded || !selectedNode) return;

		const sourceId = 'selected-node';
		const geojson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'Point',
						coordinates: [selectedNode.lng, selectedNode.lat]
					}
				}
			]
		};

		const source = map.getSource(sourceId);
		if (source) {
			(source as any).setData(geojson);
		} else {
			map.addSource(sourceId, { type: 'geojson', data: geojson });
			map.addLayer({
				id: 'selected-node-outer',
				type: 'circle',
				source: sourceId,
				paint: {
					'circle-radius': 15,
					'circle-color': '#ffffff',
					'circle-opacity': 0.2,
					'circle-stroke-width': 1,
					'circle-stroke-color': '#ffffff'
				}
			});
			map.addLayer({
				id: 'selected-node-inner',
				type: 'circle',
				source: sourceId,
				paint: {
					'circle-radius': 5,
					'circle-color': '#ffffff'
				}
			});
		}
	}

	function updateTripPath() {
		if (!map || !isLoaded || !activeTrip || !isVisible) return;

		const routeSourceId = 'route';
		const nodesSourceId = 'nodes';

		const path = activeTrip.path || [];
		if (path.length === 0) return;

		// Route Line GeoJSON
		const routeGeojson: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'LineString',
						coordinates: path.map((p: any) => [p.lng, p.lat])
					}
				}
			]
		};

		// Nodes Points GeoJSON
		const nodesGeojson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
			type: 'FeatureCollection',
			features: path.map((p: any) => ({
				type: 'Feature',
				properties: { name: p.name },
				geometry: {
					type: 'Point',
					coordinates: [p.lng, p.lat]
				}
			}))
		};

		// Update or Add Route
		const routeSource = map.getSource(routeSourceId);
		if (routeSource) {
			(routeSource as any).setData(routeGeojson);
		} else {
			map.addSource(routeSourceId, { type: 'geojson', data: routeGeojson });
			map.addLayer({
				id: 'route-layer',
				type: 'line',
				source: routeSourceId,
				layout: { 'line-join': 'round', 'line-cap': 'round' },
				paint: { 'line-color': '#ffffff', 'line-width': 2, 'line-dasharray': [2, 2] }
			});
		}

		// Update or Add Nodes
		const nodesSource = map.getSource(nodesSourceId);
		if (nodesSource) {
			(nodesSource as any).setData(nodesGeojson);
		} else {
			map.addSource(nodesSourceId, { type: 'geojson', data: nodesGeojson });
			map.addLayer({
				id: 'nodes-layer',
				type: 'circle',
				source: nodesSourceId,
				paint: {
					'circle-radius': 4,
					'circle-color': '#000000',
					'circle-stroke-width': 2,
					'circle-stroke-color': '#ffffff'
				}
			});
		}

		// Calculate bounds if not specifically looking at a node
		if (!selectedNode) {
			const bounds = getTripBounds();
			if (bounds) {
				map.fitBounds(bounds, { padding: 80, duration: 800, animate: true });
			}
		}
	}
</script>

<div bind:this={mapContainer} class="h-full w-full bg-black"></div>

<style>
	:global(.maplibregl-canvas) {
		outline: none;
	}
	:global(.maplibregl-ctrl-attrib) {
		display: none;
	}
</style>
