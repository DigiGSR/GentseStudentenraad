import { prisma } from "$lib/Prisma";
import type { PageServerLoad } from "./$types";

export const prerender = false;
export const ssr = false;
export const csr = true;

export const load = (async ({ locals }) => {
    const rules = await prisma.rules.findMany({
        where: {
            organization: locals.configuration.organization,
        },
    });

    return {
        rules,
    };
}) satisfies PageServerLoad;
