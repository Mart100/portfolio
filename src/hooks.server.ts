import { redirect, type Handle } from '@sveltejs/kit';
import { ADMIN_PASSWORD } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
	// Protect all /admin routes except /admin/login
	if (event.url.pathname.startsWith('/admin') && event.url.pathname !== '/admin/login') {
		const session = event.cookies.get('admin_session');

		if (session !== ADMIN_PASSWORD) {
			throw redirect(303, '/admin/login');
		}
	}

	const response = await resolve(event);
	return response;
};
