<script lang="ts">
	let scrolled = $state(false);

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', () => {
			scrolled = window.scrollY > 50;
		});
	}
</script>

<nav
	class="fixed top-0 left-0 z-50 w-full transition-all duration-300 {scrolled
		? 'border-b border-white/10 bg-background-dark/80 backdrop-blur-md'
		: 'bg-transparent'}"
>
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
		<div class="flex items-center gap-2">
			<div class="flex h-7 w-7 items-center justify-center bg-primary">
				<span class="text-xs font-black text-background-dark">MV</span>
			</div>
			<span class="hidden text-[10px] font-bold tracking-[0.3em] text-white sm:block"
				>CORE_SYSTEM.V01</span
			>
		</div>

		<div class="flex items-center gap-6 font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
			<a href="#home" class="transition-colors hover:text-primary">INIT</a>
			<a href="#projects" class="transition-colors hover:text-primary">DATA_SETS</a>
			<a href="#about" class="transition-colors hover:text-primary">KERNEL</a>
			<a
				href="#contact"
				class="border border-primary px-3 py-1 text-primary transition-all hover:bg-primary hover:text-background-dark"
				>LINK</a
			>
		</div>
	</div>
</nav>
