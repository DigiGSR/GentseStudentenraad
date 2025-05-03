import { Language } from "$lib/Language";
import { prisma } from "$lib/Prisma";
import { Organization } from "@prisma/client";
import type { LayoutServerLoad } from "./$types";

export const prerender = false;
export const ssr = true;
export const csr = true;

export const _TRANSLATION_STRINGS = [
    // ...existing code...
] as const;

export type TranslationString = (typeof _TRANSLATION_STRINGS)[number];

export const load = (async ({ params, locals }) => {
    const startTime = performance.now();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = params.language;

    // Create navigation bar routes. It's a bit messy but it's our only option.
    const routes = [];

    const configStartTime = performance.now();
    const configs = await prisma.configuration.findMany();
    const configsTime = performance.now() - configStartTime;

    const pagesStartTime = performance.now();
    const pages = await prisma.page.findMany({
        where: { organization: locals.configuration.organization },
    });
    const pagesTime = performance.now() - pagesStartTime;

    const routesStartTime = performance.now();
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

    const projectCountStartTime = performance.now();
    const projectCount = await prisma.project.count({
        where: {
            organization: locals.configuration.organization,
        },
    });
    const projectCountTime = performance.now() - projectCountStartTime;

    if (locals.configuration.project_section && projectCount > 0) {
        routes.push(
            locals.language == Language.DUTCH
                ? ["Projecten", "/nl/projecten"]
                : ["Projects", "/en/projecten"],
        );
    }

    if (locals.language == Language.DUTCH) {
        for (const page of pages) {
            routes.push([page.nav_name_dutch, page.slug]);
        }
    } else {
        for (const page of pages) {
            routes.push([page.nav_name_english, page.slug]);
        }
    }
    const routesTime = performance.now() - routesStartTime;

    const i18nStartTime = performance.now();
    const i18n = await prisma.i18n.findMany({
        select: {
            key: true,
            dutch: true,
            english: true,
            markup: true,
        },
        where: {
            OR: [
                { organization: locals.configuration.organization },
                { organization: Organization.COMMON },
            ],
        },
    });

    const translations: Record<"nl" | "en", Map<TranslationString, string>> = {
        nl: new Map(),
        en: new Map(),
    };

    _TRANSLATION_STRINGS.forEach((e) => {
        translations.nl.set(e, `missing i18n: "${e}"`); //set key value as default value
        translations.en.set(e, `missing i18n: "${e}"`); //set key value as default value
    });

    i18n.forEach(({ key, dutch, english }) => {
        translations.nl.set(key, dutch);
        translations.en.set(key, english);
    });
    const i18nTime = performance.now() - i18nStartTime;

    if (JSON.stringify(locals.configuration.navbar) == JSON.stringify({})) {
        locals.configuration.navbar = [];
    }

    const totalTime = performance.now() - startTime;

    // Done! Pass to the view.
    return {
        language: locals.language,
        configs: configs.filter((e) => e.id != locals.configuration.id),
        configuration: locals.configuration,
        i18n: translations,
        user: locals.user,
        admin: locals.admin,
        timings: {
            configs: configsTime,
            pages: pagesTime,
            routes: routesTime,
            projectCount: projectCountTime,
            i18n: i18nTime,
            total: totalTime,
        },
    };
}) satisfies LayoutServerLoad;
