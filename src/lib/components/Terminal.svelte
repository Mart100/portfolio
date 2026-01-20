<script lang="ts">
	import { onMount } from 'svelte';

	let logs = $state<string[]>([]);
	let userInput = $state('');
	let container: HTMLElement;

	const initialLogs = [
		'Initializing neural bridge...',
		'Querying PostgreSQL cluster... OK',
		'Connecting to Vercel Edge... SUCCESS',
		'Hydrating Svelte templates...',
		"System ready. Enter 'help' for available commands."
	];

	onMount(() => {
		let i = 0;
		const interval = setInterval(() => {
			if (i < initialLogs.length) {
				logs.push(initialLogs[i]);
				i++;
			} else {
				clearInterval(interval);
			}
		}, 400);

		return () => clearInterval(interval);
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			const cmd = userInput.toLowerCase().trim();
			logs.push(`> ${userInput}`);

			switch (cmd) {
				case 'help':
					logs.push('Available: bio, stack, contact, clear');
					break;
				case 'bio':
					logs.push('Fullstack engineer focused on building robust architectures.');
					break;
				case 'stack':
					logs.push('Typescript, Rust, Svelte, Tailwind, PostgreSQL.');
					break;
				case 'contact':
					logs.push('Redirecting to mailto:hello@martv.dev...');
					break;
				case 'clear':
					logs = ['System cleared.'];
					break;
				default:
					logs.push(`Command not found: ${cmd}`);
			}

			userInput = '';
			setTimeout(() => {
				if (container) container.scrollTop = container.scrollHeight;
			}, 0);
		}
	}
</script>

<section id="about" class="border-b border-white/5 bg-background-dark py-20">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
			<div class="space-y-6 lg:col-span-5">
				<div
					class="inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.5em] text-primary uppercase"
				>
					[ CORE_DOCUMENTATION ]
				</div>
				<h2 class="text-3xl font-black tracking-tighter uppercase italic">
					Kernel <span class="text-primary not-italic">Summary</span>
				</h2>
				<p class="text-xs leading-relaxed font-medium text-gray-500 uppercase">
					Specializing in high-concurrency systems and low-latency frontend architectures. bridging
					the gap between hardware constraints and user experience.
				</p>
				<div class="grid grid-cols-1 gap-2 border-l border-white/10 pl-6">
					<div class="flex items-center justify-between border-b border-white/5 py-2 text-[10px]">
						<span class="text-gray-400">SPECIALIZATION</span>
						<span class="font-mono text-white">DISTRIBUTED_SYSTEMS</span>
					</div>
					<div class="flex items-center justify-between border-b border-white/5 py-2 text-[10px]">
						<span class="text-gray-400">FAV_RUNTIME</span>
						<span class="font-mono text-white">BUN_CORE</span>
					</div>
					<div class="flex items-center justify-between border-b border-white/5 py-2 text-[10px]">
						<span class="text-gray-400">LOC_COORDS</span>
						<span class="font-mono text-white">51.5074°_N</span>
					</div>
				</div>
			</div>

			<div class="lg:col-span-7">
				<div class="border border-white/10 bg-black/40 p-1 backdrop-blur-sm">
					<div
						class="flex items-center justify-between border-b border-white/10 bg-white/5 px-3 py-1.5"
					>
						<div class="flex gap-1.5">
							<div class="h-1.5 w-1.5 rounded-full bg-red-500/40"></div>
							<div class="h-1.5 w-1.5 rounded-full bg-yellow-500/40"></div>
							<div class="h-1.5 w-1.5 rounded-full bg-green-500/40"></div>
						</div>
						<div class="font-mono text-[8px] tracking-widest text-gray-500 uppercase">
							system_shell.v1
						</div>
						<div class="w-10"></div>
					</div>

					<div
						bind:this={container}
						class="scrollbar-hide h-64 space-y-1 overflow-y-auto p-4 font-mono text-xs"
					>
						{#each logs as log, i (i)}
							<div class={log.startsWith('>') ? 'text-primary' : 'text-gray-400'}>
								{log.startsWith('>') ? log : `[info] ${log}`}
							</div>
						{/each}

						<div class="flex items-center gap-2 pt-1">
							<span class="text-primary">$</span>
							<input
								type="text"
								bind:value={userInput}
								onkeydown={handleKeydown}
								class="flex-1 border-none bg-transparent p-0 text-white outline-none focus:ring-0"
								aria-label="Terminal input"
								placeholder="type help..."
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
