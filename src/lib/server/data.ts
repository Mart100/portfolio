import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.resolve('src/lib/data');

// In-memory cache for data
const cache: Record<string, unknown> = {};

/**
 * Loads data from a JSON file, using cache if available.
 * @param type The name of the data file (e.g., 'projects', 'travel', 'archive')
 */
export async function loadData<T>(type: string): Promise<T | null> {
	if (cache[type]) {
		return cache[type] as T;
	}

	try {
		const filePath = path.join(DATA_DIR, `${type}.json`);
		const content = await fs.readFile(filePath, 'utf-8');
		const data = JSON.parse(content) as T;
		cache[type] = data;
		return data;
	} catch (error) {
		console.error(`Error loading data for ${type}:`, error);
		return null;
	}
}

/**
 * Invalidates the cache for a specific data type.
 * Should be called when data is updated via the admin panel.
 */
export function invalidateCache(type?: string) {
	if (type) {
		console.log(`Invalidating cache for: ${type}`);
		delete cache[type];
	} else {
		console.log('Invalidating entire cache');
		for (const key in cache) {
			delete cache[key];
		}
	}
}
