<script lang="ts">
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import { fly } from 'svelte/transition';
	import type { PageProps } from './$types';
	import ProjectCard from '../_components/ProjectCard.svelte';
	import AdminHeader from '../_components/AdminHeader.svelte';

	let { data, form }: PageProps = $props();

	// Load initial state from layout data - forked state for local editing
	let projects = $state(
		untrack(() => (data.projects ? JSON.parse(JSON.stringify(data.projects)) : []))
	);
	let saving = $state(false);
	let message = $state('');
	let commitMessage = $state('');

	let hasChanges = $derived(JSON.stringify(projects) !== JSON.stringify(data.projects));

	function addProject() {
		projects = [
			{ title: 'New Project', description: '', tags: [], image: '', link: '' },
			...projects
		];
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
				await update({ reset: false });
				saving = false;

				if (result.type === 'success') {
					projects = JSON.parse(JSON.stringify(data.projects));
					commitMessage = '';
				}
			};
		}}
	>
		<AdminHeader
			title="Main Projects"
			description="Selected Projects"
			{saving}
			{message}
			{hasChanges}
			bind:commitMessage
			actions={[{ label: 'Add Project', icon: 'plus', onclick: addProject }]}
		/>

		<input type="hidden" name="type" value="projects" />
		<input type="hidden" name="data" value={JSON.stringify(projects)} />

		<div class="mx-auto max-w-4xl p-6 md:p-12">
			<div class="grid gap-6">
				{#each projects as _, i}
					<ProjectCard
						bind:project={projects[i]}
						index={i}
						total={projects.length}
						ondelete={() => {
							if (confirm('Are you sure you want to delete this project?')) {
								projects.splice(i, 1);
							}
						}}
					/>
				{/each}
			</div>
		</div>
	</form>
</div>
