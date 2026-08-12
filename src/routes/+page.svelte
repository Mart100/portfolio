<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import ProjectGrid from '$lib/components/ProjectGrid.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Travel from '$lib/components/travel/Travel.svelte';
	import Electronics from '$lib/components/Electronics.svelte';
	import Archive from '$lib/components/Archive.svelte';
	import About from '$lib/components/About.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import InteractiveBackground from '$lib/components/InteractiveBackground.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<style>
		body {
			background-color: black;
			margin: 0;
		}
	</style>
</svelte:head>

<div class="text-white selection:bg-white selection:text-black">
	<InteractiveBackground />
	<Navbar />

	<main>
		<Hero />
		<ProjectGrid projects={data.projects} />
		<Electronics projects={data.electronics} />
		<Travel travelData={data.travel} />
		<About />

		<Archive archiveData={data.archive} />
		<Contact />
	</main>

	<Footer />
</div>
