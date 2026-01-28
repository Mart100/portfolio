import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ cookies }) => {
	cookies.delete('admin_session', { path: '/' });
	throw redirect(303, '/admin/login');
};
