<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import ProjectGrid from '$lib/components/ProjectGrid.svelte';
	import Terminal from '$lib/components/Terminal.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar />

<main class="relative z-10">
	<Hero />
	<ProjectGrid />
	<Terminal />

	<section id="contact" class="border-t border-white/5 bg-surface/10 py-24">
		<div class="mx-auto max-w-7xl space-y-8 px-6 text-center">
			<div
				class="inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.5em] text-primary uppercase"
			>
				[ TRANSMISSION ]
			</div>
			<h2 class="text-5xl font-black tracking-tighter uppercase italic">
				Establish <span class="text-primary not-italic">Link</span>
			</h2>
			<p
				class="mx-auto max-w-lg text-[11px] leading-relaxed font-medium tracking-wide text-gray-500 uppercase"
			>
				Currently open for collaboration on high-impact projects. If you have a concept that needs
				technical execution, let's connect.
			</p>
			<div class="pt-4">
				<a
					href="mailto:hello@example.com"
					class="inline-block bg-white px-10 py-4 text-xs font-black tracking-[0.2em] text-background-dark uppercase transition-all duration-500 hover:bg-primary"
				>
					SEND_PACKET.bin
				</a>
			</div>
		</div>
	</section>
</main>

<footer class="border-t border-white/5 bg-background-dark py-12">
	<div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
		<div class="font-mono text-[10px] tracking-widest text-gray-600">
			© 2026 ARCHIVE.V01 // BUILT WITH SVELTE 5 // DEPLOYED AT EDGE
		</div>
		<div class="flex gap-8 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
			<a href="https://github.com" class="transition-colors hover:text-primary">GITHUB</a>
			<a href="https://linkedin.com" class="transition-colors hover:text-primary">LINKEDIN</a>
			<a href="https://twitter.com" class="transition-colors hover:text-primary">X_TWITTER</a>
		</div>
	</div>
</footer>
