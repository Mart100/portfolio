<script lang="ts">
	import './layout.css';

	let { children } = $props();

	const SITE_URL = 'https://martvenck.com';
	const TITLE = "Mart Venck — Full-Stack Developer & Creative Technologist";
	const DESCRIPTION =
		'Mart Venck is a 22-year-old full-stack developer from the Netherlands building quality software, exploring AI, and travelling the world. Rust, SvelteKit, TypeScript.';
	const OG_IMAGE = `${SITE_URL}/og-image.png`;
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" />

	<!-- Primary SEO -->
	<title>{TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
	<link rel="canonical" href={SITE_URL} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={SITE_URL} />
	<meta property="og:title" content={TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Mart Venck — Full-Stack Developer" />
	<meta property="og:site_name" content="Mart Venck" />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content={OG_IMAGE} />
	<meta name="twitter:image:alt" content="Mart Venck — Full-Stack Developer" />
</svelte:head>

{@render children()}
