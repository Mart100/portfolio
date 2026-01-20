<script lang="ts">
	import { onMount } from 'svelte';
	import ProfileWidget from './widgets/ProfileWidget.svelte';
	import MetricsWidget from './widgets/MetricsWidget.svelte';
	import StackWidget from './widgets/StackWidget.svelte';

	let time = $state('00:00:00');

	onMount(() => {
		const update = () => {
			const now = new Date();
			time = now.toTimeString().split(' ')[0];
			requestAnimationFrame(update);
		};
		update();
	});
</script>

<section
	id="home"
	class="tech-grid relative flex min-h-[600px] items-center overflow-hidden pt-32 pb-16"
>
	<!-- Decorative subtle scanlines -->
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.03]"
		style="background: repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px); background-size: 100% 4px;"
	></div>

	<div class="mx-auto w-full max-w-7xl px-6">
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
			<!-- Big Title / Mission -->
			<div class="flex flex-col justify-center space-y-8 lg:col-span-8">
				<div class="space-y-4">
					<div
						class="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.4em] text-primary uppercase"
					>
						<span class="h-1.5 w-1.5 animate-pulse bg-primary"></span>
						Interface established // {time}
					</div>
					<h1 class="text-5xl font-black tracking-tighter uppercase md:text-7xl">
						Architecting <span class="glow-text text-primary">Scalable</span><br />
						Digital Systems
					</h1>
					<p
						class="max-w-2xl border-l border-white/10 pl-6 text-sm leading-relaxed font-medium text-gray-400 uppercase italic md:text-base"
					>
						Focusing on performance optimization, distributed computing, and high-fidelity user
						interactions. Turning complex problems into streamlined, technical solutions.
					</p>
				</div>

				<div class="flex flex-wrap gap-4">
					<a
						href="#projects"
						class="flex items-center gap-2 bg-primary px-6 py-3 text-xs font-bold tracking-[0.2em] text-background-dark uppercase transition-all hover:bg-white"
					>
						VIEW_SYSTEMS <span class="text-sm">⌄</span>
					</a>
					<button
						class="border border-white/10 px-6 py-3 text-xs font-bold tracking-[0.2em] text-white uppercase transition-all hover:bg-white/10"
					>
						DOWNLOAD_LOGS.PDF
					</button>
				</div>
			</div>

			<!-- Quick Stats / Widgets -->
			<div class="grid grid-cols-1 gap-4 lg:col-span-4">
				<ProfileWidget />
				<div class="grid grid-cols-1">
					<MetricsWidget />
				</div>
			</div>
		</div>

		<!-- Bottom Row Widgets -->
		<div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
			<div class="md:col-span-3">
				<StackWidget />
			</div>
			<div
				class="flex flex-col justify-center border border-white/10 bg-surface/20 p-4 font-mono backdrop-blur-sm"
			>
				<div class="mb-2 text-[9px] text-gray-500 uppercase">Build_Status</div>
				<div class="flex items-center gap-4">
					<div class="h-2 flex-1 overflow-hidden bg-white/5">
						<div class="h-full w-[85%] bg-primary/40"></div>
					</div>
					<span class="text-[10px] text-primary">STABLE</span>
				</div>
				<div class="mt-4 flex items-end justify-between">
					<div class="text-[9px] text-gray-400">
						Hash: <span class="text-gray-600">af72_1e9c_4f01</span><br />
						Node: <span class="text-gray-600">cluster-04-ny</span>
					</div>
					<div class="flex h-8 w-8 items-center justify-center border border-white/5 bg-white/5">
						<svg
							class="h-4 w-4 text-primary opacity-50"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							><path
								d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
							/></svg
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
