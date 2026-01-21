<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import * as THREE from 'three';
	import ThreeGlobe from 'three-globe';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

	let {
		visitedCountries = [],
		places = [],
		isVisible = true
	} = $props<{
		visitedCountries: string[];
		places: any[];
		isVisible?: boolean;
	}>();

	let container = $state<HTMLDivElement>();
	let globe = $state<any>();
	let scene = $state<THREE.Scene>();
	let camera = $state<THREE.PerspectiveCamera>();
	let renderer = $state<THREE.WebGLRenderer>();
	let controls = $state<any>();
	let frameId: number;
	let lastInteractionTime = $state(0);
	const AUTO_ROTATE_DELAY = 5000; // 5 seconds

	// Performance optimization flags
	let needRaycast = $state(false);
	let needRender = $state(true);
	let lastFrameTime = 0;
	const FPS = 30;
	const FRAME_INTERVAL = 1000 / FPS;

	let raycaster = new THREE.Raycaster();
	let mouse = new THREE.Vector2();
	let countriesData = $state<any[]>([]);

	let hoveredCountry = $state<any>(null);
	let mousePosition = $state({ x: 0, y: 0 });

	$effect(() => {
		if (isVisible && renderer) {
			handleResize();
			needRender = true;
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
			.pointLat((d: any) => d.lat)
			.pointLng((d: any) => d.lng)
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
			if (frameId) cancelAnimationFrame(frameId);
			if (renderer) renderer.dispose();
		}
	});

	onMount(async () => {
		if (!container) return;

		window.addEventListener('mousemove', handleMouseMove);

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
		globe.children.forEach((child: any) => {
			if (child.name === 'atmosphere') {
				child.raycast = () => null;
			}
		});

		// Draw all countries
		fetch('/countries.geojson')
			.then((res) => res.json())
			.then((geoJson) => {
				countriesData = geoJson.features;
				globe
					.polygonsData(countriesData)
					.polygonCapColor((d: any) => {
						if (hoveredCountry && d.properties.NAME === hoveredCountry.properties.NAME) {
							return 'rgba(255, 255, 255, 0.6)';
						}
						return visitedCountries.includes(d.properties.NAME)
							? 'rgba(255, 255, 255, 0.4)'
							: 'rgba(255, 255, 255, 0.05)';
					})
					.polygonSideColor(() => 'rgba(0, 0, 0, 0)')
					.polygonStrokeColor((d: any) =>
						visitedCountries.includes(d.properties.NAME)
							? 'rgba(255, 255, 255, 0.8)'
							: 'rgba(255, 255, 255, 0.1)'
					)
					.polygonAltitude((d: any) =>
						visitedCountries.includes(d.properties.NAME) ? 0.012 : 0.01
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
		controls.addEventListener('change', (e: any) => {
			if (e.target.active) {
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
					const intersects = raycaster.intersectObjects(globe.children, true);

					let foundData = null;
					if (intersects.length > 0) {
						let current = intersects[0].object as any;
						while (current && !current.__data && current.parent && current !== globe) {
							current = current.parent;
						}
						if (current && current.__data) {
							const data = current.__data.data;
							if (data?.type === 'Feature') foundData = data;
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
