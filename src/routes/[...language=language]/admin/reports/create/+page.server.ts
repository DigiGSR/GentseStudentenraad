import { prisma } from "$lib/Prisma";
import type { PageServerLoad } from "./$types";
export const prerender = false;
export const ssr = false;
export const csr = true;

export const load = (async ({ locals }) => {
    const groups = await prisma.report.findMany({
        where: {
            //todo dont think this is necessary
            organization: locals.configuration.organization,
        },
    });

    return {
        groups,
    };
}) satisfies PageServerLoad;
