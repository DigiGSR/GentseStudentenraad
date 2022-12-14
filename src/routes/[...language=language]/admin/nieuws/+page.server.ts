import {prisma} from '$lib/Prisma';
import type { PageLoad } from './$types';

export const prerender = false;
export const ssr = false;
export const csr = true;

export const load: PageLoad = async ({ params, url, locals }) => {
	const _ = params.language; // SVELTEKIT BUG, DO NOT REMOVE

	const news = await prisma.news.findMany({
		orderBy: [
			{
				published: 'desc'
			}
		],
		where: {
			organization: locals.organization!
		}
	});

	return {
		news
	};
}
