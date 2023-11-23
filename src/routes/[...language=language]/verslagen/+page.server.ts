import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/Prisma";
import { Report } from "@prisma/client";

export const prerender = false;
export const ssr = true;
export const csr = true;

export const load = (async ({ locals }) => {
    const reports: Report = await prisma.report.findMany({
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
