import { prisma } from "$lib/Prisma";
import type { PageServerLoad } from "./$types";

export const prerender = false;
export const ssr = true;
export const csr = true;

export const load = (async ({ locals, url }) => {
    const startTime = performance.now();

    const newsStartTime = performance.now();
    const news = await prisma.news.findMany({
        orderBy: [
            {
                published_at: "desc",
            },
        ],
        where: {
            organization: locals.configuration.organization,
            published: true,
        },
        take: 4,
    });
    const newsTime = performance.now() - newsStartTime;

    const calendarsStartTime = performance.now();
    const calendars = await prisma.calendar.findMany({
        where: {
            organization: locals.configuration.organization,
        },
    });
    const calendarsTime = performance.now() - calendarsStartTime;

    const totalTime = performance.now() - startTime;

    return {
        calendars,
        news,
        origin: url.origin,
        timings: {
            news: newsTime,
            calendars: calendarsTime,
            total: totalTime,
        },
    };
}) satisfies PageServerLoad;
