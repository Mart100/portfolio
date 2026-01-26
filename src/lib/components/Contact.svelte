<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { EMAIL, LINKEDIN } from '$lib/constants';

	onMount(() => {
		if (browser) {
			// Load Google Calendar Scheduling styles
			const link = document.createElement('link');
			link.href = 'https://calendar.google.com/calendar/scheduling-button-script.css';
			link.rel = 'stylesheet';
			document.head.appendChild(link);

			// Load Google Calendar Scheduling script
			const script = document.createElement('script');
			script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js';
			script.async = true;
			script.onload = () => {
				const target = document.getElementById('calendar-button-root');
				if (target && (window as any).calendar) {
					(window as any).calendar.schedulingButton.load({
						url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3WaYz8QmuuuVgebjzHTTrZdj1WUNcy2RSYLJmWRLC4PmzTXcggPBVfwSb4PYupzH2E54LTPQgu?gv=true',
						color: '#10b981',
						label: 'Schedule Call',
						target
					});
				}
			};
			document.head.appendChild(script);
		}
	});
</script>

<section id="contact" class="relative overflow-hidden px-6 py-32">
	<div class="mx-auto max-w-7xl">
		<div
			class="relative overflow-hidden rounded-[40px] border border-white/5 bg-white/[0.02] p-12 backdrop-blur-xl md:p-24"
		>
			<!-- Background Glow -->
			<div
				class="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]"
			></div>

			<div class="grid grid-cols-1 gap-20 lg:grid-cols-2 lg:items-center">
				<div class="space-y-12">
					<div class="space-y-6">
						<div class="flex items-center gap-3">
							<div class="h-px w-8 bg-emerald-500/50"></div>
							<span class="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase"
								>Connect</span
							>
						</div>
						<h2 class="text-5xl font-medium tracking-tight text-white md:text-7xl">
							Get in <span class="text-gray-500 italic">Touch.</span>
						</h2>
						<p class="max-w-md text-lg leading-relaxed text-gray-400">
							Have a project in mind or just want to chat? I'm always open to new connections and
							interesting conversations.
						</p>
					</div>

					<div class="flex flex-col gap-8">
						<a href={'mailto:' + EMAIL} class="group flex items-center gap-6 transition-all">
							<div
								class="flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/5 bg-white/[0.03] transition-all group-hover:border-emerald-500/50 group-hover:bg-emerald-500 group-hover:text-black"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="h-7 w-7"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
									/>
								</svg>
							</div>
							<div>
								<div class="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
									Direct Email
								</div>
								<div
									class="text-xl font-medium text-white transition-colors group-hover:text-emerald-400"
								>
									{EMAIL}
								</div>
							</div>
						</a>

						<a
							href={LINKEDIN}
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center gap-6 transition-all"
						>
							<div
								class="flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/5 bg-white/[0.03] transition-all group-hover:border-emerald-500/50 group-hover:bg-emerald-500 group-hover:text-black"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 24 24"
									class="h-7 w-7"
								>
									<path
										d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
									/>
								</svg>
							</div>
							<div>
								<div class="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
									LinkedIn
								</div>
								<div
									class="text-xl font-medium text-white transition-colors group-hover:text-emerald-400"
								>
									martvenck
								</div>
							</div>
						</a>
					</div>
				</div>

				<div class="relative">
					<div
						class="relative overflow-hidden rounded-[32px] border border-white/10 bg-black/40 p-10 shadow-2xl ring-1 ring-white/5 backdrop-blur-2xl md:p-14"
					>
						<!-- Glow in card -->
						<div
							class="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl"
						></div>

						<div class="relative z-10 mb-8 flex items-center justify-between">
							<div
								class="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									class="h-7 w-7"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
									/>
								</svg>
							</div>
							<div
								class="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 ring-1 ring-emerald-500/20"
							>
								<div class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
								<span class="text-[10px] font-bold tracking-widest text-emerald-400 uppercase"
									>Limited Slots</span
								>
							</div>
						</div>

						<h3 class="relative z-10 mb-4 text-3xl font-medium text-white">Let's hop on a call.</h3>
						<p class="relative z-10 mb-10 leading-relaxed text-gray-500">
							Schedule a 30-minute discovery call via Google Meet. Perfect for project briefings or
							technical deep-dives.
						</p>

						<div id="calendar-button-root" class="relative z-10 w-full">
							<!-- Google Calendar Button will be injected here -->
						</div>
					</div>

					<!-- Decorative background elements -->
					<div
						class="absolute -top-6 -right-6 -z-10 h-32 w-32 rotate-12 rounded-[28px] border border-emerald-500/10 bg-emerald-500/5 blur-[1px]"
					></div>
					<div
						class="absolute -bottom-10 -left-10 -z-10 h-40 w-40 -rotate-6 rounded-[32px] border border-emerald-500/10 bg-emerald-500/5 blur-[1px]"
					></div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* Be extremely broad: target any element injected as a sibling of the root */
	:global(#calendar-button-root ~ *) {
		width: 100% !important;
		min-width: 100% !important;
		height: 60px !important;
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		background-color: white !important;
		color: black !important;
		border: none !important;
		font-family: inherit !important;
		font-size: 11px !important;
		font-weight: 700 !important;
		letter-spacing: 0.2em !important;
		text-transform: uppercase !important;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
		border-radius: 1rem !important;
		cursor: pointer !important;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
		margin-top: 1.5rem !important;
		text-decoration: none !important;
	}

	:global(#calendar-button-root ~ *:hover) {
		background-color: #10b981 !important; /* Emerald 500 */
		transform: translateY(-2px) !important;
		box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.2) !important;
	}

	/* Target any nested elements like spans or images within the injected sibling */
	:global(#calendar-button-root ~ * span),
	:global(#calendar-button-root ~ * div) {
		color: black !important;
		font-weight: 700 !important;
	}

	:global(#calendar-button-root ~ * img) {
		filter: brightness(0) !important;
		margin-right: 12px !important;
		width: 20px !important;
		height: 20px !important;
	}
</style>
