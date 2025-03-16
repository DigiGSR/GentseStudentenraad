import { prisma } from "$lib/Prisma";
import type { PageServerLoad } from "./$types";

export const prerender = false;
export const ssr = false;
export const csr = true;

export const load = (async ({ locals }) => {
    const feedback = await prisma.feedback.findMany({
        where: {
            organization: locals.configuration.organization,
        },
        include: {
            subject: true,
            course: true,
        },
        orderBy: {
            submitted_at: "desc",
        },
    });

    return {
        feedback,
    };
}) satisfies PageServerLoad;
