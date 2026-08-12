<script lang="ts">
	import Sidebar from './_components/Sidebar.svelte';

	let { children } = $props();

	const tabs = [
		{
			id: 'mainprojects',
			label: 'Main Projects',
			icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
		},
		{
			id: 'archive',
			label: 'Archive',
			icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
		},
		{
			id: 'electronics',
			label: 'Electronics',
			icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
		},
		{
			id: 'travels',
			label: 'Travel Log',
			icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		}
	];
</script>

<div class="min-h-screen bg-neutral-950 font-sans text-neutral-200 selection:bg-emerald-500/30">
	<div class="relative z-10 flex h-screen flex-col overflow-hidden md:flex-row">
		<Sidebar {tabs} />

		<main class="relative flex-1 overflow-y-auto scroll-smooth">
			<div class="relative z-100">
				{@render children()}
			</div>
		</main>
	</div>
</div>

<style>
	:global(body) {
		background-color: #0a0a0a;
	}

	::-webkit-scrollbar {
		width: 6px;
	}

	::-webkit-scrollbar-track {
		background: transparent;
	}

	::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 10px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: rgba(16, 185, 129, 0.2);
	}

	:global(input[type='date']::-webkit-calendar-picker-indicator) {
		filter: invert(1);
		opacity: 0.5;
	}
</style>
