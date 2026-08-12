<script lang="ts">
	import { untrack } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { enhance } from '$app/forms';
	import { fly } from 'svelte/transition';
	import type { PageProps } from './$types';
	import TripCard from '../_components/TripCard.svelte';
	import AdminHeader from '../_components/AdminHeader.svelte';
	import AdminMap from '../_components/AdminMap.svelte';
	import { onMount } from 'svelte';

	let { data, form }: PageProps = $props();

	// Load initial state from layout data
	// Fork state from layout data for local editing
	let travel = $state(
		untrack(() =>
			data.travel ? $state.snapshot(data.travel) : { visited: [], trips: [], places: [] }
		)
	);
	let saving = $state(false);
	let message = $state('');
	let commitMessage = $state('');

	let hasChanges = $derived(JSON.stringify(travel) !== JSON.stringify(data.travel));

	// Country selection logic
	let allCountries = $state<string[]>([]);
	let countrySearch = $state('');
	let showSuggestions = $state(false);

	onMount(async () => {
		try {
			const res = await fetch('/countries.geojson');
			const geoData = await res.json();
			allCountries = geoData.features
				.map((f: { properties: { NAME: string } }) => f.properties.NAME)
				.sort();
		} catch (e) {
			console.error('Failed to load countries:', e);
		}
	});

	let suggestions = $derived(
		countrySearch
			? allCountries
					.filter(
						(c) =>
							c.toLowerCase().includes(countrySearch.toLowerCase()) && !travel.visited.includes(c)
					)
					.slice(0, 8)
			: []
	);

	function addCountry(name: string) {
		if (!travel.visited.includes(name)) {
			travel.visited = [...travel.visited, name];
		}
		countrySearch = '';
		showSuggestions = false;
	}

	function removeCountry(name: string) {
		travel.visited = travel.visited.filter((c: string) => c !== name);
	}

	// Track expanded items
	let expandedTrips = new SvelteSet<number>();

	function toggleTrip(index: number) {
		if (expandedTrips.has(index)) {
			expandedTrips.delete(index);
		} else {
			expandedTrips.add(index);
		}
	}

	function addTrip() {
		const today = new Date().toISOString().split('T')[0];
		const newTrip = {
			id: `trip-${Date.now()}`,
			name: 'New Trip',
			description: '',
			startDate: today,
			endDate: today,
			path: []
		};
		travel.trips = [newTrip, ...travel.trips];
		expandedTrips.add(0);
	}

	$effect(() => {
		if (form?.success) {
			message = `Successfully saved ${form.type}!`;
			commitMessage = '';
			setTimeout(() => (message = ''), 4000);
		} else if (form?.message) {
			message = `Error: ${form.message}`;
		}
	});
</script>

<div in:fly={{ y: 20, duration: 400 }} class="pb-24">
	<form
		method="POST"
		action="?/save"
		use:enhance={() => {
			saving = true;
			return async ({ update, result }) => {
				// Prevent form reset from wiping our reactive state via bind:value
				await update({ reset: false });
				saving = false;

				if (result.type === 'success') {
					// Sync local state with server data to ensure consistency
					// and pick up any server-side transformations
					travel = $state.snapshot(data.travel);
					commitMessage = '';
				}
			};
		}}
	>
		<AdminHeader
			title="Travel Log"
			description="Travels"
			{saving}
			{message}
			{hasChanges}
			bind:commitMessage
			actions={[{ label: 'Add Trip', icon: 'M12 4v16m8-8H4', onclick: addTrip }]}
		/>

		<input type="hidden" name="type" value="travel" />
		<input type="hidden" name="data" value={JSON.stringify(travel)} />

		<div class="mx-auto max-w-4xl space-y-12 p-6 md:p-12">
			<section class="rounded-3xl border border-white/5 bg-black/50 p-8 shadow-xl backdrop-blur">
				<div class="mb-6 flex items-center gap-4">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/></svg
						>
					</div>
					<h3 class="text-xl font-black tracking-tighter uppercase">Global Footprint</h3>
				</div>
				<div class="block">
					<span class="pl-1 text-[10px] font-black tracking-widest text-neutral-500 uppercase"
						>Countries Explored</span
					>
					<div
						class="mt-2 flex flex-wrap gap-2 rounded-2xl border border-white/5 bg-neutral-900 p-4 shadow-inner"
					>
						{#each travel.visited as country (country)}
							<div
								class="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black tracking-widest text-emerald-500 uppercase ring-1 ring-emerald-500/30"
								in:fly={{ x: -10, duration: 200 }}
							>
								{country}
								<button
									type="button"
									onclick={() => removeCountry(country)}
									aria-label="Remove {country}"
									class="text-emerald-500/50 transition-colors hover:text-red-500"
								>
									<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="3"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
						{/each}

						<div class="relative min-w-[150px] flex-1">
							<input
								type="text"
								bind:value={countrySearch}
								onfocus={() => (showSuggestions = true)}
								onblur={() => setTimeout(() => (showSuggestions = false), 200)}
								onkeydown={(e) => {
									if (e.key === 'Enter' && suggestions.length > 0) {
										e.preventDefault();
										addCountry(suggestions[0]);
									}
								}}
								placeholder={travel.visited.length === 0 ? 'Search countries...' : 'Add another...'}
								class="w-full bg-transparent px-2 py-1 text-xs text-white outline-none placeholder:text-neutral-700"
							/>

							{#if showSuggestions && suggestions.length > 0}
								<div
									class="absolute top-full left-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-neutral-950 p-1 shadow-2xl backdrop-blur-xl"
								>
									{#each suggestions as suggestion (suggestion)}
										<button
											type="button"
											onclick={() => addCountry(suggestion)}
											class="w-full rounded-lg px-3 py-2 text-left text-[10px] font-bold tracking-wider text-neutral-400 uppercase transition-all hover:bg-emerald-500/10 hover:text-emerald-400"
										>
											{suggestion}
										</button>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>
			</section>

			<div>
				<div class="mb-6 flex items-center justify-between px-2">
					<h3 class="text-lg font-black tracking-tighter text-white uppercase">Detailed Trips</h3>
				</div>

				<div class="space-y-4">
					{#each travel.trips as trip, ti (trip)}
						<TripCard
							bind:trip={travel.trips[ti]}
							index={ti}
							isExpanded={expandedTrips.has(ti)}
							onToggle={() => toggleTrip(ti)}
							onRemove={() => travel.trips.splice(ti, 1)}
						/>
					{/each}
				</div>
			</div>

			<section class="rounded-3xl border border-white/5 bg-black/30 p-8">
				<div class="mb-8 flex items-center justify-between">
					<h3 class="text-lg leading-none font-black tracking-tighter text-white uppercase">
						Global Atlas Markers
					</h3>
				</div>

				<div class="mb-8">
					<AdminMap bind:places={travel.places} />
				</div>
			</section>
		</div>
	</form>
</div>
