import fs from 'node:fs/promises';
import path from 'node:path';
import { fail } from '@sveltejs/kit';

const DATA_DIR = path.resolve('src/lib/data');

export const actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const type = formData.get('type') as string;
		const data = formData.get('data') as string;

		if (!type || !data) {
			return fail(400, { message: 'Missing type or data' });
		}

		try {
			const filePath = path.join(DATA_DIR, `${type}.json`);
			const parsed = JSON.parse(data);
			await fs.writeFile(filePath, JSON.stringify(parsed, null, '\t'), 'utf-8');
			return { success: true, type };
		} catch (error) {
			return fail(500, { message: 'Error saving file' });
		}
	}
};
