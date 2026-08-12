import { loadData } from '$lib/server/data';
import type { Project, TravelData, ArchiveItem, ElectronicsProject } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [projects, travel, archive, electronics] = await Promise.all([
		loadData<Project[]>('projects'),
		loadData<TravelData>('travel'),
		loadData<ArchiveItem[]>('archive'),
		loadData<ElectronicsProject[]>('electronics')
	]);

	return {
		projects: projects || [],
		travel: travel || { visited: [], trips: [], places: [] },
		archive: archive || [],
		electronics: electronics || []
	};
};
