import type { RequestHandler } from '@sveltejs/kit';

const SITE_URL = 'https://martvenck.com';

const pages = [
	{ path: '/', priority: '1.0', changefreq: 'monthly' },
	{ path: '/#work', priority: '0.8', changefreq: 'monthly' },
	{ path: '/#about', priority: '0.7', changefreq: 'monthly' },
	{ path: '/#archive', priority: '0.7', changefreq: 'weekly' },
	{ path: '/#electronics', priority: '0.6', changefreq: 'monthly' },
	{ path: '/#travels', priority: '0.6', changefreq: 'monthly' },
	{ path: '/#contact', priority: '0.5', changefreq: 'yearly' }
];

export const GET: RequestHandler = () => {
	const lastMod = new Date().toISOString().split('T')[0];

	const urls = pages
		.map(
			({ path, priority, changefreq }) => `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
