<script lang="ts">
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import { fly } from 'svelte/transition';
	import type { PageProps } from './$types';
	import ArchiveCard from '../_components/ArchiveCard.svelte';
	import AdminHeader from '../_components/AdminHeader.svelte';

	let { data, form }: PageProps = $props();

	// Load initial state from layout data - forked state for local editing
	let archive = $state(
		untrack(() => (data.archive ? JSON.parse(JSON.stringify(data.archive)) : []))
	);
	let saving = $state(false);
	let message = $state('');
	let commitMessage = $state('');

	let editingIndex = $state<number | null>(null);

	let hasChanges = $derived(JSON.stringify(archive) !== JSON.stringify(data.archive));

	function addArchive() {
		archive = [
			{
				title: 'New Archive Entry',
				image: '',
				link: '',
				description: '',
				created: new Date().toLocaleDateString('en-GB'),
				score: 0,
				tags: [],
				techStack: []
			},
			...archive
		];
		editingIndex = 0;
	}

	function closeEdit() {
		editingIndex = null;
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

<div in:fly={{ y: 20, duration: 400 }} class="pb-24 text-sm">
	<form
		method="POST"
		action="?/save"
		use:enhance={() => {
			saving = true;
			return async ({ update, result }) => {
				await update({ reset: false });
				saving = false;

				if (result.type === 'success') {
					archive = JSON.parse(JSON.stringify(data.archive));
					commitMessage = '';
				}
			};
		}}
	>
		<AdminHeader
			title="Project Archive"
			description="Project Archive"
			{saving}
			{message}
			{hasChanges}
			bind:commitMessage
			actions={[{ label: 'Add Entry', icon: 'plus', onclick: addArchive }]}
		/>

		<input type="hidden" name="type" value="archive" />
		<input type="hidden" name="data" value={JSON.stringify(archive)} />

		<div class="mx-auto max-w-4xl p-6 md:p-12">
			<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{#each archive as _, i}
					<ArchiveCard bind:item={archive[i]} onclick={() => (editingIndex = i)} />
				{/each}
			</div>
		</div>
	</form>
</div>

{#if editingIndex !== null}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm"
		onclick={closeEdit}
		transition:fly={{ duration: 200 }}
	>
		<div
			class="relative flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900 shadow-2xl"
			onclick={(e) => e.stopPropagation()}
			transition:fly={{ y: 40, duration: 400 }}
		>
			<button
				onclick={closeEdit}
				aria-label="Close edit"
				class="absolute top-6 right-6 z-10 rounded-full bg-black/40 p-2 text-neutral-400 backdrop-blur transition-all hover:bg-emerald-500 hover:text-black"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/></svg
				>
			</button>

			<div class="custom-scrollbar overflow-y-auto p-10">
				<div class="mb-10">
					<span class="text-[10px] font-black tracking-widest text-emerald-500 uppercase"
						>Editing Entry</span
					>
					<h3 class="text-3xl font-black text-white">Project Details</h3>
				</div>

				<div class="space-y-8">
					<div class="space-y-2">
						<label
							for="project-title"
							class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
							>Project Title</label
						>
						<input
							id="project-title"
							bind:value={archive[editingIndex].title}
							class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:ring-1 focus:ring-emerald-500"
							placeholder="Project title..."
						/>
					</div>

					<div class="space-y-2">
						<label
							for="project-description"
							class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
							>Description (HTML allowed)</label
						>
						<textarea
							id="project-description"
							bind:value={archive[editingIndex].description}
							rows="5"
							class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-sm leading-relaxed text-neutral-300 outline-none focus:ring-1 focus:ring-emerald-500"
							placeholder="Describe the project..."
						></textarea>
					</div>

					<div class="grid grid-cols-2 gap-6">
						<div class="space-y-2">
							<label
								for="project-created"
								class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
								>Creation Date</label
							>
							<input
								id="project-created"
								bind:value={archive[editingIndex].created}
								class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:ring-1 focus:ring-emerald-500"
								placeholder="e.g. 12/04/2018"
							/>
						</div>
						<div class="space-y-2">
							<label
								for="project-score"
								class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
								>Quality Score (0-100)</label
							>
							<input
								id="project-score"
								type="number"
								value={typeof archive[editingIndex].score === 'object'
									? archive[editingIndex].score.$numberLong
									: archive[editingIndex].score}
								oninput={(e) => {
									const val = parseInt((e.target as HTMLInputElement).value);
									if (typeof archive[editingIndex!].score === 'object') {
										archive[editingIndex!].score.$numberLong = val.toString();
									} else {
										archive[editingIndex!].score = val;
									}
								}}
								class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:ring-1 focus:ring-emerald-500"
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div class="space-y-2">
							<label
								for="project-image"
								class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
								>Image Filename</label
							>
							<input
								id="project-image"
								bind:value={archive[editingIndex].image}
								class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:ring-1 focus:ring-emerald-500"
								placeholder="filename.jpg"
							/>
						</div>
						<div class="space-y-2">
							<label
								for="project-backup"
								class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
								>Alternate Image (URL)</label
							>
							<input
								id="project-backup"
								bind:value={archive[editingIndex].backupImage}
								class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:ring-1 focus:ring-emerald-500"
								placeholder="https://..."
							/>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-6">
						<div class="space-y-2">
							<label
								for="project-link"
								class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
								>Live Link</label
							>
							<input
								id="project-link"
								bind:value={archive[editingIndex].link}
								class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:ring-1 focus:ring-emerald-500"
								placeholder="https://..."
							/>
						</div>
						<div class="space-y-2">
							<label
								for="project-code"
								class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
								>Code Link</label
							>
							<input
								id="project-code"
								bind:value={archive[editingIndex].code}
								class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:ring-1 focus:ring-emerald-500"
								placeholder="https://github..."
							/>
						</div>
					</div>

					<div class="space-y-2">
						<label
							for="project-stack"
							class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
							>Tech Stack (comma separated)</label
						>
						<input
							id="project-stack"
							value={archive[editingIndex].techStack?.join(', ')}
							oninput={(e) =>
								(archive[editingIndex!].techStack = (e.target as HTMLInputElement).value
									.split(',')
									.map((s) => s.trim())
									.filter(Boolean))}
							class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:ring-1 focus:ring-emerald-500"
							placeholder="C++, OpenGL, WinAPI..."
						/>
					</div>

					<div class="space-y-2">
						<label
							for="project-tags"
							class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
							>Tags (comma separated)</label
						>
						<input
							id="project-tags"
							value={archive[editingIndex].tags?.join(', ')}
							oninput={(e) =>
								(archive[editingIndex!].tags = (e.target as HTMLInputElement).value
									.split(',')
									.map((s) => s.trim())
									.filter(Boolean))}
							class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:ring-1 focus:ring-emerald-500"
							placeholder="Graphics, Desktop, Tools..."
						/>
					</div>
				</div>

				<div class="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
					<button
						type="button"
						onclick={() => {
							if (confirm('Are you sure you want to delete this archive entry?')) {
								archive.splice(editingIndex!, 1);
								closeEdit();
							}
						}}
						class="flex items-center gap-2 rounded-2xl bg-red-500/10 px-6 py-4 text-xs font-black tracking-widest text-red-500 uppercase transition-all hover:bg-red-500 hover:text-white"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
						Delete Entry
					</button>

					<button
						type="button"
						onclick={closeEdit}
						class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-8 py-4 text-xs font-black tracking-widest text-emerald-500 uppercase transition-all hover:bg-emerald-500 hover:text-black"
					>
						Done Editing
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 10px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(16, 185, 129, 0.2);
	}
</style>
