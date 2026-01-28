import { json } from '@sveltejs/kit';
import { ASSETS_TOKEN } from '$env/static/private';

export const GET = async ({ url }) => {
	const path = url.searchParams.get('path');
	if (!path) {
		return json({ error: 'Missing path parameter' }, { status: 400 });
	}

	try {
		const response = await fetch(`https://assets-admin.martvenck.com/api/images/${path}`, {
			headers: {
				Authorization: `Bearer ${ASSETS_TOKEN}`
			}
		});

		if (!response.ok) {
			throw new Error(`Upstream API responded with ${response.status}`);
		}

		const data = await response.json();
		return json(data);
	} catch (error) {
		console.error('Error fetching images:', error);
		return json({ error: 'Failed to fetch images from upstream' }, { status: 500 });
	}
};
