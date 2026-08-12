<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import * as THREE from 'three';
	import ThreeGlobe from 'three-globe';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import type { TravelPlace } from '$lib/types';

	// A country polygon pulled from the countries GeoJSON, carrying its NAME property.
	interface CountryFeature {
		type: 'Feature';
		properties: { NAME: string };
	}

	// A three-globe child Mesh that has feature data attached via __data.
	interface GlobeObject extends THREE.Object3D {
		__data?: { data?: CountryFeature };
	}

	let {
		visitedCountries = [],
		places = [],
		isVisible = true
	} = $props<{
		visitedCountries: string[];
		places: TravelPlace[];
		isVisible?: boolean;
	}>();

	let container = $state<HTMLDivElement>();
	let globe = $state<ThreeGlobe>();
	let scene = $state<THREE.Scene>();
	let camera = $state<THREE.PerspectiveCamera>();
	let renderer = $state<THREE.WebGLRenderer>();
	let controls = $state<OrbitControls>();
	let frameId: number;
	let observer: IntersectionObserver;
	let lastInteractionTime = $state(0);
	const AUTO_ROTATE_DELAY = 5000; // 5 seconds

	// Performance optimization flags
	let needRaycast = $state(false);
	let needRender = $state(true);
	let lastFrameTime = 0;
	const FPS = 30;
	const FRAME_INTERVAL = 1000 / FPS;

	let raycaster = new THREE.Raycaster();
	// Reduce thresholds to prevent "pre-emptive" hits on lines (strokes) or points
	raycaster.params.Line.threshold = 0.01;
	raycaster.params.Points.threshold = 0.01;
	let mouse = new THREE.Vector2();
	let countriesData = $state<CountryFeature[]>([]);

	let hoveredCountry = $state<CountryFeature | null>(null);
	let mousePosition = $state({ x: 0, y: 0 });
	let isIntersecting = $state(true);

	$effect(() => {
		if (isVisible && renderer) {
			handleResize();
			needRender = true;
		}
	});

	$effect(() => {
		if (!isVisible || !isIntersecting) {
			hoveredCountry = null;
		}
	});

	$effect(() => {
		if (globe && places.length > 0) {
			updateGlobePoints();
			needRender = true;
		}
	});

	function updateGlobePoints() {
		if (!globe) return;

		// Add Places (Points)
		globe
			.pointsData(places)
			.pointLat((d: object) => (d as TravelPlace).lat)
			.pointLng((d: object) => (d as TravelPlace).lng)
			.pointColor(() => '#ff0000')
			.pointAltitude(0.015)
			.pointRadius(0.2);
	}

	const handleResize = () => {
		if (!container || !camera || !renderer) return;
		camera.aspect = container.clientWidth / container.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.clientWidth, container.clientHeight);
		needRender = true;
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!container) return;
		mousePosition = { x: e.clientX, y: e.clientY };

		const rect = container.getBoundingClientRect();
		mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
		mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

		needRaycast = true;
		needRender = true;
	};

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('mousemove', handleMouseMove);
			if (observer) observer.disconnect();
			if (frameId) cancelAnimationFrame(frameId);
			if (renderer) renderer.dispose();
		}
	});

	onMount(async () => {
		if (!container) return;

		window.addEventListener('mousemove', handleMouseMove);

		// Intersection observer to clear hover when scrolled out of view
		observer = new IntersectionObserver(
			(entries) => {
				isIntersecting = entries[0].isIntersecting;
			},
			{ threshold: 0.1 }
		);
		observer.observe(container);

		const width = container.clientWidth;
		const height = container.clientHeight;

		// Setup Scene
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x000000);

		// Setup Globe
		globe = new ThreeGlobe()
			.showAtmosphere(true)
			.atmosphereColor('#ffffff')
			.atmosphereAltitude(0.12);

		// Disable raycasting on atmosphere so it doesn't block country hover
		globe.children.forEach((child: THREE.Object3D) => {
			if (child.name === 'atmosphere') {
				child.raycast = () => null;
			}
		});

		// Draw all countries
		const globeInstance = globe; // non-null: created above
		fetch('/countries.geojson')
			.then((res) => res.json())
			.then((geoJson) => {
				countriesData = geoJson.features;
				globeInstance
					.polygonsData(countriesData)
					.polygonCapColor((d: object) => {
						const country = d as CountryFeature;
						if (hoveredCountry && country.properties.NAME === hoveredCountry.properties.NAME) {
							return 'rgba(255, 255, 255, 0.6)';
						}
						return visitedCountries.includes(country.properties.NAME)
							? 'rgba(255, 255, 255, 0.4)'
							: 'rgba(255, 255, 255, 0.05)';
					})
					.polygonSideColor(() => 'rgba(0, 0, 0, 0)')
					.polygonStrokeColor((d: object) =>
						visitedCountries.includes((d as CountryFeature).properties.NAME)
							? 'rgba(255, 255, 255, 0.8)'
							: 'rgba(255, 255, 255, 0.1)'
					)
					.polygonAltitude((d: object) =>
						visitedCountries.includes((d as CountryFeature).properties.NAME) ? 0.012 : 0.01
					);
				needRender = true;
			});

		scene.add(globe);
		scene.add(new THREE.AmbientLight(0xbbbbbb, 0.6));

		const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
		dLight.position.set(-1, 1, 1);
		scene.add(dLight);

		// Setup Camera
		camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
		camera.position.z = 400;

		// Setup Renderer
		renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
		renderer.setSize(width, height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
		// eslint-disable-next-line svelte/no-dom-manipulating -- three.js WebGLRenderer creates & owns its own canvas element; it must be appended to the container at renderer init and cannot be managed by Svelte
		container.appendChild(renderer.domElement);

		// Setup Controls
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.enablePan = false;
		controls.minDistance = 150;
		controls.maxDistance = 400;

		// Track user interactions to pause rotation
		const updateInteractionTime = () => {
			lastInteractionTime = Date.now();
			needRender = true;
		};
		controls.addEventListener('start', updateInteractionTime);
		controls.addEventListener('change', (e) => {
			// Adjust rotation speed based on zoom level (more zoomed in = slower rotation)
			const target = (e as unknown as { target: OrbitControls & { active?: boolean } }).target;
			const distance = target.getDistance();
			const maxDistance = target.maxDistance;
			const minDistance = target.minDistance;

			// Scale rotation speed between ~0.3 and 1.0 based on distance
			target.rotateSpeed = ((distance - minDistance) / (maxDistance - minDistance)) * 0.8 + 0.2;

			if (target.active) {
				updateInteractionTime();
				needRaycast = true;
				needRender = true;
			}
		});

		updateGlobePoints();

		const animate = () => {
			frameId = requestAnimationFrame(animate);

			// Limit FPS for performance
			const now = performance.now();
			const delta = now - lastFrameTime;
			if (delta < FRAME_INTERVAL) return;
			lastFrameTime = now - (delta % FRAME_INTERVAL);

			let didUpdate = false;

			if (globe) {
				// Only rotate if enough time has passed since last interaction
				if (Date.now() - lastInteractionTime > AUTO_ROTATE_DELAY) {
					globe.rotation.y += 0.001;
					didUpdate = true;
				}

				// Raycasting for hover
				if (needRaycast && camera && scene && countriesData.length > 0 && isVisible) {
					raycaster.setFromCamera(mouse, camera);
					// Set raycaster far to not intersect objects behind the globe
					const intersects = raycaster.intersectObjects(globe.children, true);

					let foundData: CountryFeature | null = null;
					// Search through intersections to find the first valid country feature
					for (let i = 0; i < Math.min(intersects.length, 5); i++) {
						const current = intersects[i].object as GlobeObject;

						// Search hierarchy for data
						let dataNode = current;
						while (dataNode && !dataNode.__data && dataNode.parent && dataNode !== globe) {
							dataNode = dataNode.parent;
						}

						// If we found a node with feature data, it's a country
						if (dataNode && dataNode.__data && dataNode.__data.data?.type === 'Feature') {
							foundData = dataNode.__data.data;
							break;
						}

						// CRITICAL: If we hit a Mesh that has NO data, it is the globe's base sphere (the ocean).
						// Since land polygons are at a higher altitude, they would have been caught above.
						// If the first or closest Mesh hit is this base sphere, we are over water.
						if (current.type === 'Mesh' && !dataNode?.__data) {
							break;
						}
					}

					if (foundData !== hoveredCountry) {
						hoveredCountry = foundData;
						if (globe.polygonsData().length > 0) {
							globe.polygonCapColor(globe.polygonCapColor());
						}
						didUpdate = true;
					}
					needRaycast = false;
				}
			}

			if (controls) {
				const changed = controls.update();
				if (changed) didUpdate = true;
			}

			if ((didUpdate || needRender) && renderer && scene && camera) {
				renderer.render(scene, camera);
				needRender = false;
			}
		};
		animate();

		window.addEventListener('resize', handleResize);
	});
</script>

<div bind:this={container} class="group h-full w-full outline-none"></div>

{#if hoveredCountry}
	<div
		class="pointer-events-none fixed z-[100] flex flex-col gap-1 rounded-lg border border-white/10 bg-black/80 p-3 shadow-2xl backdrop-blur-md transition-opacity duration-200"
		style="left: {mousePosition.x + 20}px; top: {mousePosition.y + 20}px;"
	>
		<div class="flex items-center gap-2">
			<div
				class="h-1.5 w-1.5 rounded-full {visitedCountries.includes(hoveredCountry.properties.NAME)
					? 'bg-white'
					: 'bg-white/20'}"
			></div>
			<span class="text-[10px] font-bold tracking-[0.2em] text-white uppercase">
				{hoveredCountry.properties.NAME}
			</span>
		</div>
		<div class="font-mono text-[9px] text-gray-400">
			{visitedCountries.includes(hoveredCountry.properties.NAME)
				? 'STATUS: VISITED'
				: 'STATUS: UNCHARTED'}
		</div>
	</div>
{/if}

<style>
	div :global(canvas) {
		display: block;
		outline: none;
	}
</style>
