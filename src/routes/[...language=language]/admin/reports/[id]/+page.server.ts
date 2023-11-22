import { prisma } from "$lib/Prisma";
import type { PageServerLoad } from "./$types";
export const prerender = false;
export const ssr = false;
export const csr = true;

export const load = (async ({ params, locals }) => {
    const report = await prisma.report.findFirstOrThrow({
        where: {
            id: parseInt(params.id),
        },
    });

    return {
        report,
    };
}) satisfies PageServerLoad;
