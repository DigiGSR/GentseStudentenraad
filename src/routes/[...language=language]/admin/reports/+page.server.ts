import { prisma } from "$lib/Prisma";
import type { PageServerLoad } from "./$types";

export const prerender = false;
export const ssr = false;
export const csr = true;

export const load = (async ({ locals }) => {
    const reports = await prisma.report.findMany({
        orderBy: [
            {
                name: "asc",
            },
        ],
        where: {
            organization: locals.configuration.organization,
        },
    });

    return {
        reports,
    };
}) satisfies PageServerLoad;
