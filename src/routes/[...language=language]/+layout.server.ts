import { Language } from "$lib/Language";
import { prisma } from "$lib/Prisma";
import { Organization } from "@prisma/client";
import type { LayoutServerLoad } from "./$types";

export const prerender = false;
export const ssr = true;
export const csr = true;

export const _TRANSLATION_STRINGS = [
    "footer-social-media",
    "footer-contact",
    "footer-varia",
    "footer-complaints",
    "home-about",
    "home-stuver",
    "home-stuver-frame-title",
    "home-stuver-frame-body",
    "home-projects-title",
    "home-projects-body",
    "home-events",
    "home-contact",
    "home-paragraph-1-title",
    "home-paragraph-1-body",
    "home-paragraph-2-title",
    "home-paragraph-2-body",
    "faq-title",
    "faq-about",
    "faq-selector",
    "faq-not-found",
    "feedback-about",
    "feedback-major-selector",
    "feedback-subject-selector",
    "feedback-placeholder",
    "vakfeedback-verzenden",
    "projecten-titel",
    "projecten-tekstje",
    "standpunten-info",
    "filter-op-werkgroep",
    "elections-title",
    "hier-vind-je-verslagen",
    "hier-vind-je-reglementen",
    "werkgroep-geen-verslagen",
    "who-about",
] as const;

export type TranslationString = (typeof _TRANSLATION_STRINGS)[number];

export const load = (async ({ params, locals }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = params.language;

    // Create navigation bar routes. It's a bit messy but it's our only option.
    const routes = [];

    const configs = await prisma.configuration.findMany();
    const pages = await prisma.page.findMany({
        where: { organization: locals.configuration.organization },
    });

    //todo remove all this, no longer necessary
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

    _TRANSLATION_STRINGS.forEach((e) => {
        translations.set(e, `missing i18n: "${e}"`); //set key value as default value
    });

    i18n.forEach((e) => {
        const raw = locals.language == Language.DUTCH ? e.dutch : e.english;
        if (raw) {
            //const value = sanitizeHtml(raw);
            // het is probably fine om dit uit te zetten lol maybe niet (het is WYSIWYG output dus moet niet eeeecht sanitized worden)
            translations.set(e.key, raw);
        }
    });

    if (JSON.stringify(locals.configuration.navbar) == JSON.stringify({})) {
        locals.configuration.navbar = [];
    }

    // Done! Pass to the view.
    return {
        language: locals.language,
        configs: configs.filter((e) => e.id != locals.configuration.id),
        configuration: locals.configuration,
        i18n: translations,
        user: locals.user,
        admin: locals.admin,
    };
}) satisfies LayoutServerLoad;
