import { loadData } from '$lib/server/data';
import type { Project, ArchiveItem, TravelData } from '$lib/types';

export const load = async () => {
	const [projects, archive, travel] = await Promise.all([
		loadData<Project[]>('projects'),
		loadData<ArchiveItem[]>('archive'),
		loadData<TravelData>('travel')
	]);

	return {
		projects: projects || [],
		archive: archive || [],
		travel: travel || { visited: [], trips: [], places: [] }
	};
};
