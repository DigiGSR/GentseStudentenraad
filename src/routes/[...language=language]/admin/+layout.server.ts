import { prisma } from "$lib/Prisma";
import type { LayoutServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const prerender = false;
export const ssr = true;
export const csr = true;

export const load = (async ({ locals }) => {
    if (process.env.PUBLIC_ENV !== "dev") {
        if (!locals.user) {
            throw error(401, "Unauthorized");
        } else if (!locals.admin) {
            throw error(403, "Forbidden");
        }
    }

    const groupCount = prisma.personGroup.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const personCount = prisma.person.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const userCount = prisma.user.count();

    const questionCount = prisma.question.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const projectCount = prisma.project.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const opinionCount = prisma.opinion.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const i18nCount = prisma.i18n.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const pageCount = prisma.page.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const electionCount = prisma.election.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const reportCount = prisma.report.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    return {
        electionCount,
        pageCount,
        i18nCount,
        opinionCount,
        projectCount,
        userCount,
        reportCount,
        groupCount,
        personCount,
        questionCount,
    };
}) satisfies LayoutServerLoad;
