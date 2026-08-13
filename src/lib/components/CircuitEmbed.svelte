<script lang="ts">
	const TARGET = 'https://archive.martvenck.com';
	const SRC = `${TARGET}/ThePrototyper/?embed=1&theme=light`;

	let { board, title = 'Circuit' }: { board: unknown; title?: string } = $props();

	let iframe = $state<HTMLIFrameElement>();

	function plainBoard() {
		return JSON.parse(JSON.stringify(board));
	}

	function send() {
		iframe?.contentWindow?.postMessage(
			{ type: 'theprototyper:load', board: plainBoard(), theme: 'light' },
			TARGET
		);
	}

	function onMessage(event: MessageEvent) {
		if (event.origin !== TARGET) return;
		if (event.data?.type === 'theprototyper:ready') send();
	}
</script>

<svelte:window onmessage={onMessage} />

<iframe
	bind:this={iframe}
	src={SRC}
	{title}
	class="h-full min-h-[280px] w-full border-0 bg-[#e8eaed]"
></iframe>
