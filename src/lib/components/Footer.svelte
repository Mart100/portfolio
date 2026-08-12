<script>
	import { EMAIL, GITHUB, LINKEDIN } from '$lib/constants';
</script>

<footer
	class="relative z-10 border-t border-white/5 bg-black/40 px-6 py-12 backdrop-blur-sm md:py-32"
>
	<div
		class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row md:gap-12"
	>
		<div class="space-y-4 text-center md:text-left">
			<div class="flex items-center justify-center gap-3 md:justify-start">
				<div class="h-px w-8 bg-emerald-400/50"></div>
				<span class="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase">Status</span
				>
			</div>
			<p class="text-xs text-gray-500 md:text-sm">
				Currently taking on new projects for Summer 2026.
			</p>
		</div>

		<div class="flex flex-col items-center gap-8 md:items-end">
			<div
				class="flex flex-wrap justify-center gap-6 text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase sm:gap-10"
			>
				<a href={'mailto:' + EMAIL} class="transition-colors hover:text-emerald-400">Email</a>
				<a rel="external" href={GITHUB} class="transition-colors hover:text-emerald-400">Github</a>
				<a rel="external" href={LINKEDIN} class="transition-colors hover:text-emerald-400"
					>LinkedIn</a
				>
			</div>
			<div
				class="text-center text-[9px] font-bold tracking-[0.1em] text-gray-800 uppercase md:text-right md:text-[10px]"
			>
				© 2026 Crafted by Mart_ve. Built with Sveltekit.
			</div>
		</div>
	</div>
</footer>
