<script lang="ts">
	let scrolled = $state(false);

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', () => {
			scrolled = window.scrollY > 20;
		});
	}
</script>

<nav
	class="fixed top-0 left-0 z-50 w-full transition-all duration-500 {scrolled
		? 'border-b border-white/5 bg-black/50 py-4 backdrop-blur-xl'
		: 'bg-transparent py-8'}"
>
	<div class="mx-auto flex max-w-5xl items-center justify-between px-6">
		<a href="/" class="group flex items-center gap-2">
			<span class="text-sm font-medium tracking-tight text-white">MART_V</span>
		</a>

		<div class="flex items-center gap-8">
			<div class="flex items-center gap-6 text-[11px] font-medium tracking-wide uppercase">
				<a href="#work" class="text-gray-400 transition-colors hover:text-white">Work</a>
				<a href="#travel" class="text-gray-400 transition-colors hover:text-white">Travel</a>
				<a href="#about" class="text-gray-400 transition-colors hover:text-white">About</a>
			</div>
			<a
				href="mailto:hello@example.com"
				class="rounded-full bg-white px-4 py-1.5 text-[11px] font-medium text-black transition-transform hover:scale-105"
			>
				Contact
			</a>
		</div>
	</div>
</nav>
