<script lang="ts">
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import { fly } from 'svelte/transition';
	import type { PageProps } from './$types';
	import ElectronicsCard from '../_components/ElectronicsCard.svelte';
	import AdminHeader from '../_components/AdminHeader.svelte';
	import ImagePickerModal from '../_components/ImagePickerModal.svelte';

	let { data, form }: PageProps = $props();

	let electronics = $state(
		untrack(() => (data.electronics ? $state.snapshot(data.electronics) : []))
	);
	let saving = $state(false);
	let message = $state('');
	let commitMessage = $state('');

	let editingIndex = $state<number | null>(null);
	let isPickerOpen = $state(false);
	let pickerTarget = $state<'add' | number>('add');
	let circuitDraft = $state('');
	let circuitError = $state('');

	let hasChanges = $derived(JSON.stringify(electronics) !== JSON.stringify(data.electronics));

	function addProject() {
		electronics = [
			{
				id: `electronics-${Date.now()}`,
				title: 'New Build',
				description: '',
				images: [],
				tags: [],
				created: new Date().toISOString().split('T')[0],
				link: ''
			},
			...electronics
		];
		editingIndex = 0;
		circuitDraft = '';
		circuitError = '';
	}

	function openEdit(i: number) {
		editingIndex = i;
		const circuit = electronics[i].circuit;
		circuitDraft = circuit ? JSON.stringify(circuit, null, 2) : '';
		circuitError = '';
	}

	function closeEdit() {
		editingIndex = null;
		circuitDraft = '';
		circuitError = '';
	}

	function onCircuitInput(value: string) {
		circuitDraft = value;
		if (editingIndex === null) return;
		if (!value.trim()) {
			electronics[editingIndex].circuit = undefined;
			circuitError = '';
			return;
		}
		try {
			electronics[editingIndex].circuit = JSON.parse(value);
			circuitError = '';
		} catch {
			circuitError = 'Invalid JSON — circuit will not be saved until this parses.';
		}
	}

	function removeImage(i: number) {
		if (editingIndex === null) return;
		electronics[editingIndex].images = electronics[editingIndex].images.filter((_, idx) => idx !== i);
	}

	function moveImage(i: number, dir: -1 | 1) {
		if (editingIndex === null) return;
		const next = i + dir;
		const imgs = electronics[editingIndex].images;
		if (next < 0 || next >= imgs.length) return;
		const copy = [...imgs];
		[copy[i], copy[next]] = [copy[next], copy[i]];
		electronics[editingIndex].images = copy;
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
					electronics = $state.snapshot(data.electronics);
					commitMessage = '';
				}
			};
		}}
	>
		<AdminHeader
			title="Electronics"
			description="Hardware Builds"
			{saving}
			{message}
			{hasChanges}
			bind:commitMessage
			actions={[{ label: 'Add Build', icon: 'plus', onclick: addProject }]}
		/>

		<input type="hidden" name="type" value="electronics" />
		<input type="hidden" name="data" value={JSON.stringify(electronics)} />

		<div class="mx-auto max-w-4xl p-6 md:p-12">
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each electronics as _, i (electronics[i].id)}
					<ElectronicsCard bind:item={electronics[i]} onclick={() => openEdit(i)} />
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
						>Editing Build</span
					>
					<h3 class="text-3xl font-black text-white">Project Details</h3>
				</div>

				<div class="space-y-8">
					<div class="space-y-2">
						<label
							for="electronics-title"
							class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
							>Title</label
						>
						<input
							id="electronics-title"
							bind:value={electronics[editingIndex].title}
							class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:ring-1 focus:ring-emerald-500"
							placeholder="Build title..."
						/>
					</div>

					<div class="space-y-2">
						<label
							for="electronics-description"
							class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
							>Description (HTML allowed)</label
						>
						<textarea
							id="electronics-description"
							bind:value={electronics[editingIndex].description}
							rows="5"
							class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-sm leading-relaxed text-neutral-300 outline-none focus:ring-1 focus:ring-emerald-500"
							placeholder="Describe the build..."
						></textarea>
					</div>

					<div class="grid grid-cols-2 gap-6">
						<div class="space-y-2">
							<label
								for="electronics-created"
								class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
								>Date</label
							>
							<input
								id="electronics-created"
								type="date"
								bind:value={electronics[editingIndex].created}
								class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:ring-1 focus:ring-emerald-500"
							/>
						</div>
						<div class="space-y-2">
							<label
								for="electronics-link"
								class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
								>Link (optional)</label
							>
							<input
								id="electronics-link"
								bind:value={electronics[editingIndex].link}
								class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:ring-1 focus:ring-emerald-500"
								placeholder="https://..."
							/>
						</div>
					</div>

					<div class="space-y-2">
						<label
							for="electronics-tags"
							class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
							>Tags (comma separated)</label
						>
						<input
							id="electronics-tags"
							value={electronics[editingIndex].tags?.join(', ')}
							oninput={(e) =>
								(electronics[editingIndex!].tags = (e.target as HTMLInputElement).value
									.split(',')
									.map((s) => s.trim())
									.filter(Boolean))}
							class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:ring-1 focus:ring-emerald-500"
							placeholder="PCB, ESP32, Analog..."
						/>
					</div>

					<div class="space-y-2">
						<label
							for="electronics-circuit"
							class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
							>ThePrototyper circuit JSON (optional)</label
						>
						<textarea
							id="electronics-circuit"
							value={circuitDraft}
							oninput={(e) => onCircuitInput((e.target as HTMLTextAreaElement).value)}
							rows="8"
							spellcheck="false"
							class="w-full rounded-2xl border border-white/5 bg-white/5 p-4 font-mono text-[11px] leading-relaxed text-neutral-300 outline-none focus:ring-1 focus:ring-emerald-500 {circuitError
								? 'ring-1 ring-red-500/60'
								: ''}"
							placeholder={'{ /* paste circuit.json */ }'}
						></textarea>
						{#if circuitError}
							<p class="text-[11px] text-red-400">{circuitError}</p>
						{:else if electronics[editingIndex].circuit}
							<p class="text-[11px] text-emerald-500/70">Circuit embed enabled for this build.</p>
						{:else}
							<p class="text-[11px] text-neutral-500">
								Paste a circuit.json export to embed an interactive Prototyper board.
							</p>
						{/if}
					</div>

					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<span class="text-[10px] font-black tracking-widest text-neutral-500 uppercase"
								>Images</span
							>
							<button
								type="button"
								onclick={() => {
									pickerTarget = 'add';
									isPickerOpen = true;
								}}
								class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[9px] font-black tracking-widest text-emerald-400 uppercase transition-all hover:bg-emerald-500 hover:text-black"
							>
								Add image
							</button>
						</div>

						{#if electronics[editingIndex].images.length === 0}
							<p class="text-xs text-neutral-500">No images yet. First image is the cover.</p>
						{:else}
							<div class="space-y-2">
								{#each electronics[editingIndex].images as src, i (src + i)}
									<div
										class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-2"
									>
										<img src={src} alt="" class="h-14 w-14 rounded-xl object-cover" />
										<input
											bind:value={electronics[editingIndex].images[i]}
											class="min-w-0 flex-1 bg-transparent text-[11px] text-neutral-400 outline-none"
										/>
										<button
											type="button"
											onclick={() => {
												pickerTarget = i;
												isPickerOpen = true;
											}}
											class="rounded-lg px-2 py-1 text-[8px] font-black tracking-widest text-neutral-400 uppercase hover:text-emerald-400"
										>
											Browse
										</button>
										<button
											type="button"
											onclick={() => moveImage(i, -1)}
											class="text-neutral-500 hover:text-white"
											aria-label="Move up"
										>
											↑
										</button>
										<button
											type="button"
											onclick={() => moveImage(i, 1)}
											class="text-neutral-500 hover:text-white"
											aria-label="Move down"
										>
											↓
										</button>
										<button
											type="button"
											onclick={() => removeImage(i)}
											class="text-neutral-500 hover:text-red-400"
											aria-label="Remove image"
										>
											✕
										</button>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<div class="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
					<button
						type="button"
						onclick={() => {
							if (confirm('Are you sure you want to delete this build?')) {
								electronics.splice(editingIndex!, 1);
								closeEdit();
							}
						}}
						class="flex items-center gap-2 rounded-2xl bg-red-500/10 px-6 py-4 text-xs font-black tracking-widest text-red-500 uppercase transition-all hover:bg-red-500 hover:text-white"
					>
						Delete Build
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

{#if editingIndex !== null}
	<ImagePickerModal
		bind:isOpen={isPickerOpen}
		basePath="portfolio/electronics"
		onSelect={(url) => {
			if (editingIndex === null) return;
			if (pickerTarget === 'add') {
				electronics[editingIndex].images = [...electronics[editingIndex].images, url];
			} else {
				electronics[editingIndex].images[pickerTarget] = url;
			}
		}}
	/>
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
</style>
