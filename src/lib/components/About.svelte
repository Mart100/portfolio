<script lang="ts">
</script>

<section id="about" class="relative overflow-hidden border-t border-white/5 px-6 py-32">
	<!-- Background accent -->
	<div
		class="absolute top-0 right-0 -z-10 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-500/[0.03] blur-[100px]"
	></div>

	<div class="mx-auto max-w-5xl">
		<div class="grid grid-cols-1 gap-20 lg:grid-cols-2">
			<!-- Left Column: The Narrative -->
			<div class="space-y-16">
				<div class="space-y-6">
					<div class="flex items-center gap-3">
						<div class="h-px w-8 bg-emerald-500/50"></div>
						<span class="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase">
							The Backstory
						</span>
					</div>
					<h2 class="text-4xl font-medium text-white md:text-5xl">
						From Discord bots to<br />
						<span class="text-gray-500 italic">acquired startups.</span>
					</h2>
				</div>

				<div class="space-y-8 text-lg leading-relaxed text-gray-400">
					<p>
						I started my journey when I was 15, building <span class="text-white">Toorney</span>—a
						platform for automated Discord tournaments. It grew faster than I expected and was
						eventually acquired, which was a wild "hello world" to the industry.
					</p>
					<p>
						Since then, I've obsessed over how things work under the hood. I've built custom 3D
						engines from scratch and compilers that turn high-level logic into Turing machine
						instructions. For me, <span class="text-white">complexity is a puzzle</span>, and code
						is the solution.
					</p>
					<div class="flex items-center gap-4 pt-4">
						<div class="flex -space-x-3">
							{#each Array(3) as _, i (i)}
								<div
									class="h-10 w-10 overflow-hidden rounded-full border-2 border-black bg-neutral-800"
								>
									<div class="flex h-full w-full items-center justify-center text-[10px]">☕</div>
								</div>
							{/each}
						</div>
						<p class="text-[11px] font-medium tracking-wide text-gray-500 uppercase">
							Fueled by caffeine & curiosity
						</p>
					</div>
				</div>
			</div>

			<!-- Right Column: Modular Bits -->
			<div class="space-y-8">
				<!-- Current Obsessions -->
				<div
					class="rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-colors hover:bg-white/[0.04]"
				>
					<h3 class="mb-6 text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
						Current Stack & Obsessions
					</h3>
					<div class="flex flex-wrap gap-3">
						{#each ['Rust', 'Svelte 5', 'TypeScript', 'WebAudio', 'GLSL', 'Logic Pro', 'Analog Synths'] as tag (tag)}
							<span
								class="rounded-full border border-white/5 bg-white/[0.03] px-4 py-2 text-xs font-medium text-gray-300 transition-colors hover:border-emerald-500/50 hover:text-white"
							>
								{tag}
							</span>
						{/each}
					</div>
				</div>

				<!-- Quick Facts Grid -->
				<div class="grid grid-cols-2 gap-4">
					<div class="rounded-3xl border border-white/5 bg-white/[0.02] p-6 text-center">
						<span class="mb-2 block text-2xl">🌍</span>
						<span class="block text-[10px] font-bold tracking-widest text-gray-500 uppercase"
							>Countries</span
						>
						<span class="text-xl font-medium text-white">24+</span>
					</div>
					<div class="rounded-3xl border border-white/5 bg-white/[0.02] p-6 text-center">
						<span class="mb-2 block text-2xl">🎹</span>
						<span class="block text-[10px] font-bold tracking-widest text-gray-500 uppercase"
							>Hours Music</span
						>
						<span class="text-xl font-medium text-white">1000+</span>
					</div>
					<div class="col-span-2 rounded-3xl border border-white/5 bg-white/[0.02] p-6">
						<div class="flex items-center justify-between">
							<div>
								<span class="block text-[10px] font-bold tracking-widest text-gray-500 uppercase"
									>Currently Reading</span
								>
								<span class="text-sm font-medium text-white italic">Crafting Interpreters</span>
							</div>
							<span class="text-2xl">📖</span>
						</div>
					</div>
				</div>

				<!-- Simple Personal Quote -->
				<div class="relative overflow-hidden rounded-3xl bg-emerald-500 p-8 text-black">
					<div class="absolute -top-4 -right-4 font-serif text-8xl opacity-10">"</div>
					<p class="relative z-10 text-lg leading-tight font-bold tracking-tight">
						"I believe the best software is built by people who care as much about the silence
						between the code as the code itself."
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
