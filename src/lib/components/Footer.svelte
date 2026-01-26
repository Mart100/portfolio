<script>
	import { EMAIL, GITHUB, LINKEDIN } from '$lib/constants';
</script>

<footer class="relative z-10 border-t border-white/5 bg-black/40 px-6 py-32 backdrop-blur-sm">
	<div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 md:flex-row">
		<div class="space-y-4">
			<div class="flex items-center gap-3">
				<div class="h-px w-8 bg-emerald-500/50"></div>
				<span class="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase">Status</span
				>
			</div>
			<p class="text-sm text-gray-500">Currently taking on new projects for Summer 2026.</p>
		</div>

		<div class="flex flex-col items-center gap-8 md:items-end">
			<div class="flex gap-10 text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
				<a href={'mailto:' + EMAIL} class="transition-colors hover:text-emerald-400">Email</a>
				<a href={GITHUB} class="transition-colors hover:text-emerald-400">Github</a>
				<a href={LINKEDIN} class="transition-colors hover:text-emerald-400">LinkedIn</a>
			</div>
			<div class="text-[10px] font-bold tracking-[0.1em] text-gray-800 uppercase">
				© 2026 Crafted by Mart_ve. Built with Sveltekit.
			</div>
		</div>
	</div>
</footer>
