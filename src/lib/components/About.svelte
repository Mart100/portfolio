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
						<span class="text-gray-500 italic">complex systems</span>
					</h2>
				</div>

				<div class="space-y-8 text-lg leading-relaxed text-gray-400">
					<p>
						I started my journey when I was 15, building <span class="text-white">Toorney</span>—a
						platform for automated Discord tournaments. It grew faster than I expected and was
						eventually acquired, which was a wild "hello world" to the industry.
					</p>
					<p>
						Since then, I've obsessed over a wide range of technologies—from crafting apps with
						flutter and dart to building games with <span class="text-white">Rust</span> and Bevy,
						and a lot of web development in between. Lately, I've been focusing on building actual
						products that solve real problems, such as
						<span class="text-white">Readchinese.org</span>
					</p>
					<!-- Minimal Status Row -->
					<div class="mt-12 flex items-center justify-between border-t border-white/5 pt-6">
						<div class="flex items-center gap-3">
							<div class="relative flex h-1.5 w-1.5">
								<div
									class="absolute h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40"
								></div>
								<div class="relative h-full w-full rounded-full bg-emerald-500"></div>
							</div>
							<span class="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase">
								Available for projects
							</span>
						</div>
						<span class="text-[9px] font-bold tracking-[0.2em] text-gray-600 uppercase">
							NL / 51.4416° N
						</span>
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
						{#each ['Rust', 'Svelte 5', 'TypeScript', 'LLMs', 'Bun'] as tag (tag)}
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
					<div
						class="flex items-center gap-4 rounded-3xl border border-white/5 bg-white/[0.02] p-4"
					>
						<span class="text-xl">🚀</span>
						<div>
							<span class="block text-[9px] font-bold tracking-widest text-gray-500 uppercase"
								>Projects</span
							>
							<span class="text-sm font-medium text-white">50+</span>
						</div>
					</div>
					<div
						class="flex items-center gap-4 rounded-3xl border border-white/5 bg-white/[0.02] p-4"
					>
						<span class="text-xl">⚡</span>
						<div>
							<span class="block text-[9px] font-bold tracking-widest text-gray-500 uppercase"
								>Coding</span
							>
							<span class="text-sm font-medium text-white">8+ Yrs</span>
						</div>
					</div>
				</div>

				<!-- Hobbies -->
				<div
					class="rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04]"
				>
					<h3 class="mb-6 text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
						Interests & Hobbies
					</h3>
					<div class="flex flex-wrap gap-x-6 gap-y-3">
						{#each [['🥾', 'Hiking'], ['🎒', 'Solo-traveling'], ['🍳', 'Cooking'], ['🔌', 'Electronics'], ['💻', 'Coding']] as [icon, label]}
							<div class="group/hobby flex items-center gap-2">
								<span class="text-sm transition-transform group-hover/hobby:scale-110">{icon}</span>
								<span
									class="text-xs font-medium text-gray-400 transition-colors group-hover/hobby:text-white"
								>
									{label}
								</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- Simple Personal Quote -->
				<div class="relative overflow-hidden rounded-3xl bg-emerald-500 p-8 text-black">
					<div class="absolute -top-4 -right-4 font-serif text-8xl opacity-10">"</div>
					<p class="relative z-10 text-lg leading-snug font-bold tracking-tight">
						"Mastery is achieved<br />
						when effort disappears<br />
						and things take care of themselves."<br />
						<span class="mt-3 block text-[10px] font-bold tracking-[0.2em] uppercase opacity-70">
							— Zhuangzi
						</span>
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
