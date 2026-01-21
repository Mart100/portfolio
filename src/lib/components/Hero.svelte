<script lang="ts">
</script>

<section id="home" class="relative flex min-h-[90vh] flex-col justify-center px-6 pt-40 pb-20">
	<div class="mx-auto w-full max-w-5xl">
		<div class="flex flex-col gap-16 md:flex-row md:items-center">
			<div class="max-w-3xl flex-1 space-y-12">
				<div class="space-y-6">
					<div class="flex items-center gap-3">
						<div class="h-px w-8 bg-white/20"></div>
						<span class="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">
							Creative Developer
						</span>
					</div>
					<h1 class="text-5xl leading-[1.1] font-medium text-white md:text-7xl">
						Shipping AI systems,<br />
						<span class="text-gray-500 italic">fast and effectively.</span>
					</h1>
					<p class="max-w-lg text-lg leading-relaxed text-gray-400">
						I build AI-powered applications by iterating quickly, testing ideas in real
						environments, and refining systems through use. My work spans full-stack development,
						applied machine learning, and product-focused engineering.
					</p>
				</div>

				<div class="flex items-center gap-8">
					<a
						href="#work"
						class="group flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-white uppercase transition-colors hover:text-gray-400"
					>
						Explore Projects
						<span class="transition-transform group-hover:translate-x-1">→</span>
					</a>
					<div class="flex gap-6">
						<a
							href="https://github.com"
							class="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase transition-colors hover:text-white"
							>Github</a
						>
						<a
							href="https://linkedin.com"
							class="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase transition-colors hover:text-white"
							>LinkedIn</a
						>
					</div>
				</div>
			</div>

			<div class="relative shrink-0 md:w-80">
				<div
					class="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/5 bg-neutral-900 shadow-2xl"
				>
					<img
						src="/images/profile.jpg"
						alt="Profile"
						class="h-full w-full object-cover grayscale-50 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					></div>
				</div>
				<!-- Decorative elements -->
				<div class="absolute -top-4 -right-4 h-24 w-24 rounded-full border border-white/5"></div>
				<div
					class="vertical-text absolute -bottom-6 -left-6 font-mono text-[8px] text-white/10 uppercase"
				>
					Est. 2026 / Visual Portfolio
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.vertical-text {
		writing-mode: vertical-rl;
		transform: rotate(180deg);
	}
</style>
