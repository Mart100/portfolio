import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.resolve('src/lib/data');

export const load = async () => {
	try {
		const projects = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'projects.json'), 'utf-8'));
		const archive = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'archive.json'), 'utf-8'));
		const travel = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'travel.json'), 'utf-8'));

		return { projects, archive, travel };
	} catch (error) {
		console.error('Error loading data files:', error);
		return { projects: [], archive: [], travel: { visited: [], trips: [], places: [] } };
	}
};
