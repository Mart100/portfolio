import { loadData } from '$lib/server/data';
import type { Project, ArchiveItem, TravelData, ElectronicsProject } from '$lib/types';

export const load = async () => {
	const [projects, archive, travel, electronics] = await Promise.all([
		loadData<Project[]>('projects'),
		loadData<ArchiveItem[]>('archive'),
		loadData<TravelData>('travel'),
		loadData<ElectronicsProject[]>('electronics')
	]);

	return {
		projects: projects || [],
		archive: archive || [],
		travel: travel || { visited: [], trips: [], places: [] },
		electronics: electronics || []
	};
};
