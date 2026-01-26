<script lang="ts">
	import { GITHUB, LINKEDIN } from '$lib/constants';
</script>

<section
	id="home"
	class="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-32 pb-20"
>
	<!-- Subtle ambient background -->
	<div
		class="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[120px]"
	></div>

	<div class="mx-auto w-full max-w-5xl">
		<div class="flex flex-col gap-20 lg:flex-row lg:items-center lg:justify-between">
			<div class="max-w-2xl space-y-12">
				<div class="space-y-8">
					<div
						class="inline-flex items-center gap-3 rounded-full border border-white/5 bg-white/[0.02] px-3 py-1 backdrop-blur-sm"
					>
						<span class="relative flex h-2 w-2">
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
							></span>
							<span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
						</span>
						<span class="text-[10px] font-bold tracking-widest text-emerald-400/80 uppercase">
							Currently in The Netherlands
						</span>
					</div>

					<div class="space-y-6">
						<h1 class="text-6xl font-medium tracking-tight text-white md:text-8xl lg:text-9xl">
							Hi, I'm <span class="tracking-tighter text-emerald-400/90 italic">Mart.</span>
						</h1>
						<p class="max-w-xl text-2xl leading-snug font-light text-gray-400 md:text-3xl">
							I build and ship quality <span class="text-white">software</span>, try to join the
							<span class="text-white">AI</span>
							hype-train, and <span class="text-white">travel</span> wherever the map takes me.
						</p>
					</div>

					<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
						<div class="hidden h-px w-12 bg-white/10 sm:block"></div>
						<p class="font-mono text-[11px] tracking-[0.2em] text-gray-500 uppercase">
							Building since 2018
						</p>
					</div>
				</div>

				<div class="flex flex-wrap items-center gap-8 pt-4">
					<a
						href="#work"
						class="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[11px] font-bold tracking-[0.2em] text-black uppercase transition-all hover:scale-105 hover:bg-emerald-400 active:scale-95"
					>
						Dive into my work
						<span class="transition-transform group-hover:translate-x-1">→</span>
					</a>
					<div class="flex gap-8">
						<a
							href={GITHUB}
							target="_blank"
							class="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase transition-colors hover:text-white"
							>Github</a
						>
						<a
							href={LINKEDIN}
							target="_blank"
							class="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase transition-colors hover:text-white"
							>LinkedIn</a
						>
					</div>
				</div>
			</div>

			<div class="relative flex items-center justify-center self-center lg:self-auto">
				<!-- Main Portrait Container -->
				<div class="group relative z-10 w-72 sm:w-80">
					<!-- Interactive Background Glow -->
					<div
						class="absolute -inset-4 -z-10 rounded-[60px] bg-emerald-500/10 blur-2xl transition-all duration-700 group-hover:bg-emerald-500/20 group-hover:blur-3xl"
					></div>

					<!-- The "Modern Frame" -->
					<div
						class="relative aspect-[4/5] overflow-hidden rounded-[40px] border border-white/10 bg-neutral-900 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
					>
						<img
							src="/images/profile.jpg"
							alt="Me in a tunnel"
							class="h-full w-full object-cover transition-all duration-1000 group-hover:scale-110"
						/>

						<!-- Simple Glass Overlay -->
						<div
							class="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/40 p-6 backdrop-blur-md"
						>
							<div class="flex items-center justify-between">
								<span class="text-[9px] font-bold tracking-[0.3em] text-white/60 uppercase">
									Creative Dev
								</span>
								<span class="flex items-center gap-2">
									<span class="h-1 w-1 rounded-full bg-emerald-400"></span>
									<span class="text-[9px] font-medium tracking-widest text-emerald-400/90 uppercase"
										>Available</span
									>
								</span>
							</div>
						</div>
					</div>

					<!-- Personality "Pills" / Tags -->
					<div
						class="absolute -top-6 -right-12 z-20 flex flex-col gap-3 transition-transform duration-500 group-hover:translate-x-2"
					>
						<div
							class="flex items-center gap-2 rounded-full border border-white/10 border-l-emerald-500/50 bg-black/40 px-4 py-2 text-[10px] font-medium text-white shadow-xl backdrop-blur-xl transition-colors hover:bg-emerald-500 hover:text-black"
						>
							<span>🎉</span>
							22 Years old
						</div>
						<div
							class="flex translate-x-4 items-center gap-2 rounded-full border border-white/10 border-l-emerald-500/50 bg-black/40 px-4 py-2 text-[10px] font-medium text-white shadow-xl backdrop-blur-xl transition-colors hover:bg-emerald-500 hover:text-black"
						>
							<span>🌍</span>
							24 Countries
						</div>
					</div>

					<div
						class="absolute -bottom-4 -left-12 z-20 flex gap-3 transition-transform duration-500 group-hover:-translate-x-2"
					>
						<div
							class="flex items-center gap-2 rounded-full border border-white/10 border-l-emerald-500/50 bg-black/40 px-4 py-2 text-[10px] font-medium text-white shadow-xl backdrop-blur-xl transition-colors hover:bg-emerald-500 hover:text-black"
						>
							<span>🌟</span>
							Sveltekit + TS
						</div>
					</div>
				</div>

				<!-- Subtle side text -->
				<div
					class="absolute top-1/2 -right-20 hidden -rotate-90 font-mono text-[8px] tracking-[0.5em] whitespace-nowrap text-white/5 uppercase lg:block"
				>
					System Precision / Creative Chaos
				</div>
			</div>
		</div>
	</div>
</section>

<style>
</style>
