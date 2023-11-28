import { prisma } from "$lib/Prisma";
import type { PageServerLoad } from "./$types";
export const prerender = false;
export const ssr = false;
export const csr = true;

export const load = (async ({ params, locals }) => {
    const person = await prisma.person.findFirstOrThrow({
        include: {
            positions: {
                include: {
                    person_group: true,
                    substitutes: {
                        include: {
                            person: true,
                        },
                    },
                },
            },
        },
        where: {
            id: parseInt(params.id),
        },
    });

    const allPeople = await prisma.person.findMany();

    const groups = await prisma.personGroup.findMany({
        where: {
            organization: locals.configuration.organization,
        },
    });

    return {
        allPeople,
        person,
        groups,
    };
}) satisfies PageServerLoad;
