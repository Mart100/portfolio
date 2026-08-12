<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';

	let { tabs } = $props<{
		tabs: { id: string; label: string; icon: string }[];
	}>();

	const isActive = (id: string) => {
		const path = $page.url.pathname;
		return path === `/admin/${id}` || (id === 'mainprojects' && path === '/admin');
	};
</script>

<aside
	class="flex w-full shrink-0 flex-col border-b border-white/10 bg-black md:w-72 md:border-r md:border-b-0"
>
	<div class="p-8">
		<div class="mb-1 flex items-center gap-3">
			<div class="h-px w-6 bg-emerald-500"></div>
			<span class="text-[9px] font-black tracking-[0.4em] text-emerald-500 uppercase"
				>System v4.0</span
			>
		</div>
		<h1 class="text-2xl font-black tracking-tighter text-white">
			PORTFOLIO<br /><span class="text-emerald-500">ADMIN</span>
		</h1>
	</div>

	<!-- eslint-disable svelte/no-navigation-without-resolve -- dynamic tab links; resolve()+typed-routes can't type the computed "/admin/{id}" path -->
	<nav class="flex-1 space-y-2 overflow-y-auto px-4 py-4">
		{#each tabs as tab (tab.id)}
			<a
				href="/admin/{tab.id}"
				class="group flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 {isActive(
					tab.id
				)
					? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.05)] ring-1 ring-emerald-500/30'
					: 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300'}"
			>
				<svg
					class="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={tab.icon}></path>
				</svg>
				<span class="text-sm font-bold tracking-tight">{tab.label}</span>
				{#if isActive(tab.id)}
					<div
						class="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]"
					></div>
				{/if}
			</a>
		{/each}
	</nav>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->

	<div class="border-t border-white/5 p-6">
		<a
			href={resolve('/')}
			class="group flex items-center gap-3 rounded-xl px-4 py-3 text-neutral-500 transition-colors hover:bg-white/5 hover:text-white"
		>
			<svg
				class="h-4 w-4 transition-transform group-hover:-translate-x-1"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				></path>
			</svg>
			<span class="text-xs font-bold tracking-widest uppercase">Live Site</span>
		</a>
		<a
			href={resolve('/admin/logout')}
			class="group flex items-center gap-3 rounded-xl px-4 py-3 text-neutral-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
		>
			<svg
				class="h-4 w-4 transition-transform group-hover:scale-110"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
				></path>
			</svg>
			<span class="text-xs font-bold tracking-widest uppercase">Logout</span>
		</a>
	</div>
</aside>
