import { prisma } from "$lib/Prisma";
import type { PageServerLoad } from "./$types";

export const prerender = false;
export const ssr = false;
export const csr = true;

export const load = (async ({ params }) => {
    const rule = await prisma.rules.findUniqueOrThrow({
        where: {
            id: parseInt(params.id),
        },
    });

    return {
        rule,
    };
}) satisfies PageServerLoad;
