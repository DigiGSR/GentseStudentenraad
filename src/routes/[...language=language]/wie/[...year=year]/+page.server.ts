import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/Prisma";

export const prerender = false;
export const ssr = true;
export const csr = true;

export const load = (async ({ params, locals }) => {
    const groups = await prisma.personGroup.findMany({
        orderBy: [{ sort_index: "asc" }],
        include: {
            positions: {
                where: {
                    organization: locals.configuration.organization,
                    year: parseInt(params.year ? params.year : "2022"),
                },
                orderBy: {
                    sort_index: "asc",
                },
                include: {
                    substitutes: {
                        include: {
                            substitute: true,
                        },
                    },
                    person: {},
                },
            },
        },
        where: {
            organization: locals.configuration.organization,
        },
    });

    const allYears = await prisma.personPosition.findMany({
        where: {
            organization: locals.configuration.organization,
        },
        select: {
            year: true,
        },
    });
    const years = [...new Set(allYears.map((e) => e.year))].sort().reverse();

    return {
        years,
        groups,
    };
}) satisfies PageServerLoad;
