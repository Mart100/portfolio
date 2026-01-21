<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import ProjectGrid from '$lib/components/ProjectGrid.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Travel from '$lib/components/travel/Travel.svelte';
	import Archive from '$lib/components/Archive.svelte';
</script>

<div class="bg-black text-white selection:bg-white selection:text-black">
	<Navbar />

	<main>
		<Hero />
		<ProjectGrid />
		<Travel />

		<section id="about" class="border-t border-white/5 px-6 py-32">
			<div class="mx-auto max-w-5xl">
				<div class="grid grid-cols-1 gap-20 lg:grid-cols-2">
					<div class="space-y-4">
						<h2 class="text-3xl font-medium text-white">About</h2>
						<div class="h-px w-12 bg-white/20"></div>
					</div>

					<div class="space-y-8">
						<p class="text-xl leading-relaxed text-gray-400">
							I am a software engineer driven by the intersection of design and technology. I
							believe that great software is built at the edge of simplicity and performance.
						</p>
						<p class="text-lg leading-relaxed text-gray-500">
							Currently focusing on building scalable systems with Svelte, Rust, and TypeScript.
							Always looking for new challenges that push the boundaries of what's possible on the
							web.
						</p>
					</div>
				</div>
			</div>
		</section>

		<Archive />
	</main>

	<footer class="border-t border-white/5 px-6 py-20">
		<div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-10 md:flex-row">
			<div class="text-[10px] font-bold tracking-[0.2em] text-gray-700 uppercase">
				© 2026 martvenck.com
			</div>
			<div class="flex gap-8 text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
				<a href="https://github.com" class="transition-colors hover:text-white">Github</a>
				<a href="https://linkedin.com" class="transition-colors hover:text-white">LinkedIn</a>
				<a href="https://twitter.com" class="transition-colors hover:text-white">Twitter</a>
			</div>
		</div>
	</footer>
</div>
