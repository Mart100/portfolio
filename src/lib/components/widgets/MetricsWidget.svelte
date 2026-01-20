<script lang="ts">
	import { onMount } from 'svelte';

	let cpuUsage = $state(0);
	let memUsage = $state(0);
	let pulse = $state(false);

	onMount(() => {
		const interval = setInterval(() => {
			cpuUsage = Math.floor(Math.random() * 30) + 10;
			memUsage = Math.floor(Math.random() * 20) + 40;
			pulse = !pulse;
		}, 2000);
		return () => clearInterval(interval);
	});
</script>

<div class="border border-white/10 bg-surface/40 p-4 font-mono text-[10px] backdrop-blur-sm">
	<div class="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
		<span class="font-bold tracking-widest text-primary">[ SYSTEM_METRICS ]</span>
		<span class="flex items-center gap-2">
			<span
				class="h-1.5 w-1.5 rounded-full {pulse
					? 'bg-primary shadow-[0_0_5px_#00ff41]'
					: 'bg-primary/30'}"
			></span>
			LIVE_FEED
		</span>
	</div>

	<div class="space-y-3">
		<div class="space-y-1">
			<div class="flex justify-between text-gray-400">
				<span>CPU_LOAD</span>
				<span>{cpuUsage}%</span>
			</div>
			<div class="h-1 w-full bg-white/5">
				<div
					class="h-full bg-primary transition-all duration-1000"
					style="width: {cpuUsage}%"
				></div>
			</div>
		</div>

		<div class="space-y-1">
			<div class="flex justify-between text-gray-400">
				<span>MEMORY_CORE</span>
				<span>{memUsage}%</span>
			</div>
			<div class="h-1 w-full bg-white/5">
				<div class="h-full bg-accent transition-all duration-1000" style="width: {memUsage}%"></div>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-2 pt-2">
			<div class="border border-white/5 bg-white/5 p-2 text-center">
				<div class="text-gray-500">THREADS</div>
				<div class="text-xs text-white">128_ACTIVE</div>
			</div>
			<div class="border border-white/5 bg-white/5 p-2 text-center">
				<div class="text-gray-500">UPTIME</div>
				<div class="text-xs text-white">99.9%</div>
			</div>
		</div>
	</div>
</div>
