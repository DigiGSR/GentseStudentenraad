import { Language } from "$lib/Language";
import { prisma } from "$lib/Prisma";
import { Organization, Markup } from "@prisma/client";
import type { LayoutServerLoad } from "./$types";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import uniqid from "uniqid";

export const prerender = false;
export const ssr = true;
export const csr = true;

export const load = (async ({ params, locals }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = params.language;

    // Create navigation bar routes. It's a bit messy but it's our only option.
    const routes = [];

    const newRoutes = [
        {
            hierarchyRoute: true,
            name: "Over GSR",
            childRoutes: [
                { id: uniqid.time(), name: "Wie", route: "/nl/wie" },
                { id: uniqid.time(), name: "Geschiedenis", route: "/nl/geschiedenis" },
                { id: uniqid.time(), name: "Organigram", route: "/nl/organigram" },
                { id: uniqid.time(), name: "Projecten", route: "/nl/projecten" },
                { id: uniqid.time(), name: "Sponseringen", route: "/nl/sponseringen" },
                { id: uniqid.time(), name: "Partners", route: "/nl/partners" },
            ],
        },
        {
            hierarchyRoute: false,
            name: "Nieuws",
            route: "nl/nieuws",
        },
        {
            hierarchyRoute: false,
            name: "Example",
            route: "nl/nieuws",
        },
        {
            hierarchyRoute: true,
            name: "FAQ",
            childRoutes: [
                { id: uniqid.time(), name: "Uitvouwende delen", route: "todo" },
                { id: uniqid.time(), name: "Studiehulp", route: "todo" },
                { id: uniqid.time(), name: "Mentaal", route: "todo" },
                { id: uniqid.time(), name: "Ugent problemen", route: "todo" },
                { id: uniqid.time(), name: "Internationalizering", route: "todo" },
            ],
        },
        {
            hierarchyRoute: true,
            name: "Werking",
            childRoutes: [
                { id: uniqid.time(), name: "Standpunten", route: "todo" },
                { id: uniqid.time(), name: "Vakfeedback", route: "todo" },
                { id: uniqid.time(), name: "Bestuursverkiezingen", route: "todo" },
            ],
        },
        {
            hierarchyRoute: true,
            name: "Vertegenwoordigingen",
            childRoutes: [
                { id: uniqid.time(), name: "Stuver worden", route: "todo" },
                { id: uniqid.time(), name: "Stuver zijn", route: "todo" },
                { id: uniqid.time(), name: "Stuver verkiezingen", route: "todo" },
            ],
        },
    ];

    const prismaRoutes = await prisma.parentRoute.findMany({
        include: {
            childRoutes: true, // Return all fields
        },
    });
    //todo pass prismaroutes as routes

    const configs = await prisma.configuration.findMany();
    const pages = await prisma.page.findMany({
        where: { organization: locals.configuration.organization },
    });

    if (locals.configuration.who_section) {
        routes.push(locals.language == Language.DUTCH ? ["Wie", "/nl/wie"] : ["Who", "/en/wie"]);
    }

    if (locals.configuration.news_section) {
        routes.push(
            locals.language == Language.DUTCH ? ["Nieuws", "/nl/nieuws"] : ["News", "/en/nieuws"],
        );
    }

    if (locals.configuration.faq_section) {
        routes.push(locals.language == Language.DUTCH ? ["FAQ", "/nl/faq"] : ["FAQ", "/en/faq"]);
    }

    if (locals.configuration.opinions_section) {
        routes.push(
            locals.language == Language.DUTCH
                ? ["Standpunten", "/nl/standpunten"]
                : ["Opinions", "/en/standpunten"],
        );
    }

    if (locals.configuration.elections_section) {
        routes.push(
            locals.language == Language.DUTCH
                ? ["Verkiezingen", "/nl/verkiezingen"]
                : ["Elections", "/en/verkiezingen"],
        );
    }

    if (locals.configuration.feedback_section) {
        routes.push(
            locals.language == Language.DUTCH
                ? ["Vakfeedback", "/nl/feedback"]
                : ["Course Feedback", "/en/feedback"],
        );
    }

    const projectCount = await prisma.project.count({
        where: {
            organization: locals.configuration.organization,
        },
    });

    if (locals.configuration.project_section && projectCount > 0) {
        routes.push(
            locals.language == Language.DUTCH
                ? ["Projecten", "/nl/projecten"]
                : ["Projects", "/en/projecten"],
        );
    }

    const i18n = await prisma.i18n.findMany({
        select: {
            key: true,
            dutch: locals.language == Language.DUTCH,
            english: locals.language == Language.ENGLISH,
            markup: true,
        },
        where: {
            OR: [
                { organization: locals.configuration.organization },
                { organization: Organization.COMMON },
            ],
        },
    });

    if (locals.language == Language.DUTCH) {
        for (const page of pages) {
            routes.push([page.nav_name_dutch, page.slug]);
        }
    } else {
        for (const page of pages) {
            routes.push([page.nav_name_english, page.slug]);
        }
    }

    const translations = new Map();
    i18n.forEach((e) => {
        const raw = locals.language == Language.DUTCH ? e.dutch : e.english;
        if (raw) {
            if (e.markup == Markup.MARKDOWN) {
                const value = marked.parse(raw);
                translations.set(e.key, value);
            } else {
                const value = sanitizeHtml(raw);
                translations.set(e.key, value);
            }
        }
    });

    // Done! Pass to the view.
    return {
        language: locals.language,
        routes: newRoutes,
        configs: configs.filter((e) => e.id != locals.configuration.id),
        configuration: locals.configuration,
        i18n: translations,
        user: locals.user,
        admin: locals.admin,
    };
}) satisfies LayoutServerLoad;
