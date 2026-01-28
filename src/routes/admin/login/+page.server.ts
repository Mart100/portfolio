import { fail, redirect } from '@sveltejs/kit';
import { ADMIN_PASSWORD } from '$env/static/private';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get('password');

		if (password === ADMIN_PASSWORD) {
			cookies.set('admin_session', ADMIN_PASSWORD, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});

			throw redirect(303, '/admin');
		}

		return fail(401, {
			incorrect: true
		});
	}
};
