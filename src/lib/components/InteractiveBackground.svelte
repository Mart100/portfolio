<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let mouse = { x: 0, y: 0 };
	let size = { width: 0, height: 0 };

	let particleCount = $state(60);
	let connectionDistance = $state(180);
	let mouseInfluence = $state(150);

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
	}

	let particles: Particle[] = [];

	function init() {
		particles = [];
		for (let i = 0; i < particleCount; i++) {
			particles.push({
				x: Math.random() * size.width,
				y: Math.random() * size.height,
				vx: (Math.random() - 0.5) * 0.5,
				vy: (Math.random() - 0.5) * 0.5,
				size: Math.random() * 1.5 + 0.5
			});
		}
	}

	function resize() {
		size.width = window.innerWidth;
		size.height = window.innerHeight;
		if (canvas) {
			canvas.width = size.width;
			canvas.height = size.height;
		}
		particleCount = size.width < 768 ? 20 : 60;
		connectionDistance = size.width < 768 ? 100 : 180;
		mouseInfluence = size.width < 768 ? 80 : 150;
		init();
	}

	onMount(() => {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		resize();
		window.addEventListener('resize', resize);

		const handleMouseMove = (e: MouseEvent) => {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);

		let animationFrame: number;

		const draw = () => {
			if (!ctx) return;
			ctx.clearRect(0, 0, size.width, size.height);

			// Draw connections
			ctx.lineWidth = 1;

			for (let i = 0; i < particles.length; i++) {
				const p1 = particles[i];

				// Move
				p1.x += p1.vx;
				p1.y += p1.vy;

				// Bounce
				if (p1.x < 0) p1.x = size.width;
				if (p1.x > size.width) p1.x = 0;
				if (p1.y < 0) p1.y = size.height;
				if (p1.y > size.height) p1.y = 0;

				// Mouse influence
				const dx = mouse.x - p1.x;
				const dy = mouse.y - p1.y;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < mouseInfluence) {
					const angle = Math.atan2(dy, dx);
					const force = (mouseInfluence - dist) / mouseInfluence;
					p1.x -= Math.cos(angle) * force * 1.5;
					p1.y -= Math.sin(angle) * force * 1.5;
				}

				// Draw particle
				ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
				ctx.beginPath();
				ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
				ctx.fill();

				// Check connections
				for (let j = i + 1; j < particles.length; j++) {
					const p2 = particles[j];
					const dx = p1.x - p2.x;
					const dy = p1.y - p2.y;
					const dist = Math.sqrt(dx * dx + dy * dy);

					if (dist < connectionDistance) {
						ctx.strokeStyle = `rgba(16, 185, 129, ${0.4 * (1 - dist / connectionDistance)})`;
						ctx.beginPath();
						ctx.moveTo(p1.x, p1.y);
						ctx.lineTo(p2.x, p2.y);
						ctx.stroke();
					}
				}
			}

			animationFrame = requestAnimationFrame(draw);
		};

		draw();

		return () => {
			window.removeEventListener('resize', resize);
			window.removeEventListener('mousemove', handleMouseMove);
			cancelAnimationFrame(animationFrame);
		};
	});
</script>

<canvas bind:this={canvas} class="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-80"
></canvas>
