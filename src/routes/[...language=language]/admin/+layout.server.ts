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

    const groupCount = await prisma.personGroup.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const personCount = await prisma.person.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const newsCount = await prisma.news.count();

    const userCount = await prisma.user.count();

    const questionCount = await prisma.question.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const projectCount = await prisma.project.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const opinionCount = await prisma.opinion.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const i18nCount = await prisma.i18n.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const pageCount = await prisma.page.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const electionCount = await prisma.election.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const reportCount = await prisma.report.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    return {
        electionCount,
        pageCount,
        i18nCount,
        newsCount,
        opinionCount,
        projectCount,
        userCount,
        reportCount,
        groupCount,
        personCount,
        questionCount,
    };
}) satisfies LayoutServerLoad;
