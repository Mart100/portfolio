<script lang="ts">
	import { scrollY } from 'svelte/reactivity/window';

	let scrolled = $derived((scrollY.current ?? 0) > 20);

	function handleAnchorClick(event: MouseEvent) {
		const link = event.currentTarget as HTMLAnchorElement;
		const anchorId = link.getAttribute('href');
		if (anchorId?.startsWith('#')) {
			event.preventDefault();
			const element = document.querySelector(anchorId);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		}
	}
</script>

<nav
	class="fixed top-0 left-0 z-50 w-full transition-all duration-500 {scrolled ? 'py-4' : 'py-8'}"
>
	<div class="mx-auto flex max-w-5xl items-center justify-between px-6">
		<div
			class="flex w-full items-center justify-between rounded-full border border-white/5 bg-black/40 px-6 py-3 shadow-2xl backdrop-blur-xl transition-all {scrolled
				? 'border-white/10'
				: ''}"
		>
			<a href="/" class="group flex items-center gap-2">
				<div class="h-2 w-2 rounded-full bg-emerald-500"></div>
				<span class="text-xs font-bold tracking-[0.2em] text-white uppercase">MART_VE</span>
			</a>

			<div class="flex items-center gap-8">
				<div
					class="hidden items-center gap-8 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase md:flex"
				>
					<a href="#work" onclick={handleAnchorClick} class="transition-colors hover:text-white"
						>Work</a
					>
					<a href="#travel" onclick={handleAnchorClick} class="transition-colors hover:text-white"
						>Travel</a
					>
					<a href="#about" onclick={handleAnchorClick} class="transition-colors hover:text-white"
						>About</a
					>
				</div>
				<a
					href="#contact"
					onclick={handleAnchorClick}
					class="rounded-full bg-emerald-500 px-5 py-2 text-[10px] font-bold tracking-[0.1em] text-black uppercase transition-all hover:scale-105 hover:bg-emerald-400 active:scale-95"
				>
					Contact
				</a>
			</div>
		</div>
	</div>
</nav>
