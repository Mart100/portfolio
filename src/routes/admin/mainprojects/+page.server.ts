import { fail } from '@sveltejs/kit';
import { saveAndSync } from '$lib/server/admin';

export const actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const type = formData.get('type') as string;
		const data = formData.get('data') as string;

		if (!type || !data) {
			return fail(400, { message: 'Missing type or data' });
		}

		try {
			const parsed = JSON.parse(data);
			await saveAndSync(type, parsed);
			return { success: true, type };
		} catch (error) {
			console.error('Save error:', error);
			return fail(500, { message: 'Error saving and syncing data' });
		}
	}
};
