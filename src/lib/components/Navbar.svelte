<script lang="ts">
	import { resolve } from '$app/paths';
	import { scrollY } from 'svelte/reactivity/window';
	import { fade, fly } from 'svelte/transition';

	let scrolled = $derived((scrollY.current ?? 0) > 20);
	let mobileMenuOpen = $state(false);

	function handleAnchorClick(event: MouseEvent) {
		const link = event.currentTarget as HTMLAnchorElement;
		const anchorId = link.getAttribute('href');
		if (anchorId?.startsWith('#')) {
			event.preventDefault();
			const element = document.querySelector(anchorId);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
				mobileMenuOpen = false;
			}
		}
	}
</script>

<nav
	class="fixed top-0 left-0 z-50 w-full transition-all duration-500 {scrolled
		? 'py-3 md:py-4'
		: 'py-6 md:py-8'}"
>
	<div class="mx-auto flex max-w-5xl items-center justify-between px-4 md:px-6">
		<div
			class="flex w-full items-center justify-between rounded-full border border-white/5 bg-black/40 px-5 py-2.5 shadow-2xl backdrop-blur-xl transition-all md:px-6 md:py-3 {scrolled
				? 'border-white/10'
				: ''}"
		>
			<a href={resolve('/')} class="group flex items-center gap-2">
				<div class="h-2 w-2 rounded-full bg-emerald-500"></div>
				<span class="text-xs font-bold tracking-[0.2em] text-white uppercase">MART_VE</span>
			</a>

			<div class="flex items-center gap-8">
				<div
					class="hidden items-center gap-8 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase md:flex"
				>
					<a href="#work" onclick={handleAnchorClick} class="transition-colors hover:text-white"
						>Work</a
					>
					<a
						href="#electronics"
						onclick={handleAnchorClick}
						class="transition-colors hover:text-white">Hardware</a
					>
					<a href="#travel" onclick={handleAnchorClick} class="transition-colors hover:text-white"
						>Travel</a
					>
					<a href="#about" onclick={handleAnchorClick} class="transition-colors hover:text-white"
						>About</a
					>
					<a href="#archive" onclick={handleAnchorClick} class="transition-colors hover:text-white"
						>Archive</a
					>
				</div>

				<div class="flex items-center gap-4">
					<a
						href="#contact"
						onclick={handleAnchorClick}
						class="hidden rounded-full bg-emerald-500 px-5 py-2 text-[10px] font-bold tracking-[0.1em] text-black uppercase transition-all hover:scale-105 hover:bg-emerald-400 active:scale-95 sm:block"
					>
						Contact
					</a>

					<!-- Mobile Menu Toggle -->
					<button
						class="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 md:hidden"
						onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
						aria-label="Toggle menu"
					>
						{#if mobileMenuOpen}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								class="h-4 w-4"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								class="h-4 w-4"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"
								/>
							</svg>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Mobile Menu Overlay -->
	{#if mobileMenuOpen}
		<div
			transition:fade={{ duration: 200 }}
			class="fixed inset-0 top-[88px] z-40 bg-black/60 backdrop-blur-md md:hidden"
			onclick={() => (mobileMenuOpen = false)}
			onkeydown={(e) => e.key === 'Escape' && (mobileMenuOpen = false)}
			role="button"
			tabindex="0"
			aria-label="Close menu"
		>
			<div
				transition:fly={{ y: -20, duration: 300 }}
				class="mx-6 mt-4 rounded-3xl border border-white/10 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur-2xl"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
				role="presentation"
			>
				<nav class="flex flex-col gap-6">
					<a
						href="#work"
						onclick={handleAnchorClick}
						class="flex items-center gap-4 text-sm font-bold tracking-[0.2em] text-gray-400 uppercase transition-colors hover:text-emerald-400"
					>
						<span class="h-1 w-1 rounded-full bg-emerald-500/50"></span>
						Work
					</a>
					<a
						href="#electronics"
						onclick={handleAnchorClick}
						class="flex items-center gap-4 text-sm font-bold tracking-[0.2em] text-gray-400 uppercase transition-colors hover:text-emerald-400"
					>
						<span class="h-1 w-1 rounded-full bg-emerald-500/50"></span>
						Hardware
					</a>
					<a
						href="#travel"
						onclick={handleAnchorClick}
						class="flex items-center gap-4 text-sm font-bold tracking-[0.2em] text-gray-400 uppercase transition-colors hover:text-emerald-400"
					>
						<span class="h-1 w-1 rounded-full bg-emerald-500/50"></span>
						Travel
					</a>
					<a
						href="#about"
						onclick={handleAnchorClick}
						class="flex items-center gap-4 text-sm font-bold tracking-[0.2em] text-gray-400 uppercase transition-colors hover:text-emerald-400"
					>
						<span class="h-1 w-1 rounded-full bg-emerald-500/50"></span>
						About
					</a>
					<a
						href="#archive"
						onclick={handleAnchorClick}
						class="flex items-center gap-4 text-sm font-bold tracking-[0.2em] text-gray-400 uppercase transition-colors hover:text-emerald-400"
					>
						<span class="h-1 w-1 rounded-full bg-emerald-500/50"></span>
						Archive
					</a>
					<div class="mt-4 border-t border-white/5 pt-8">
						<a
							href="#contact"
							onclick={handleAnchorClick}
							class="flex items-center justify-center rounded-2xl bg-emerald-500 py-4 text-xs font-bold tracking-[0.2em] text-black uppercase transition-all active:scale-95"
						>
							Get in Touch
						</a>
					</div>
				</nav>
			</div>
		</div>
	{/if}
</nav>
