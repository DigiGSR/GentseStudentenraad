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
    console.log(`[Performance] Load started at ${new Date().toISOString()}`);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = params.language;
    console.log(`[Performance] Language param: ${params.language}`);

    // Create navigation bar routes. It's a bit messy but it's our only option.
    const routes = [];
    console.log(`[Performance] Creating navigation routes`);

    const configStartTime = performance.now();
    console.log(`[Performance] Starting config fetch`);
    const configs = await prisma.configuration.findMany();
    const configsTime = performance.now() - configStartTime;
    console.log(`[Performance] Config fetch completed in ${configsTime.toFixed(2)}ms`);
    console.log(`[Performance] Found ${configs.length} configurations`);

    const pagesStartTime = performance.now();
    console.log(
        `[Performance] Starting pages fetch for organization: ${locals.configuration.organization}`,
    );
    const pages = await prisma.page.findMany({
        where: { organization: locals.configuration.organization },
        include: {
            content: {
                select: {
                    id: true,
                    slug: true,
                },
            },
        },
        select: {
            id: true,
            nav_name_dutch: true,
            nav_name_english: true,
            slug: true,
            organization: true,
        },
    });

    console.log(pages);
    const pagesTime = performance.now() - pagesStartTime;
    console.log(`[Performance] Pages fetch completed in ${pagesTime.toFixed(2)}ms`);
    console.log(`[Performance] Found ${pages.length} pages`);

    const routesStartTime = performance.now();
    console.log(`[Performance] Starting routes generation`);
    //todo remove all this, no longer necessary
    if (locals.configuration.who_section) {
        routes.push(locals.language == Language.DUTCH ? ["Wie", "/nl/wie"] : ["Who", "/en/wie"]);
        console.log(`[Performance] Added who section to routes`);
    }

    if (locals.configuration.news_section) {
        routes.push(
            locals.language == Language.DUTCH ? ["Nieuws", "/nl/nieuws"] : ["News", "/en/nieuws"],
        );
        console.log(`[Performance] Added news section to routes`);
    }

    if (locals.configuration.faq_section) {
        routes.push(locals.language == Language.DUTCH ? ["FAQ", "/nl/faq"] : ["FAQ", "/en/faq"]);
        console.log(`[Performance] Added FAQ section to routes`);
    }

    if (locals.configuration.opinions_section) {
        routes.push(
            locals.language == Language.DUTCH
                ? ["Standpunten", "/nl/standpunten"]
                : ["Opinions", "/en/standpunten"],
        );
        console.log(`[Performance] Added opinions section to routes`);
    }

    if (locals.configuration.elections_section) {
        routes.push(
            locals.language == Language.DUTCH
                ? ["Verkiezingen", "/nl/verkiezingen"]
                : ["Elections", "/en/verkiezingen"],
        );
        console.log(`[Performance] Added elections section to routes`);
    }

    if (locals.configuration.feedback_section) {
        routes.push(
            locals.language == Language.DUTCH
                ? ["Vakfeedback", "/nl/feedback"]
                : ["Course Feedback", "/en/feedback"],
        );
        console.log(`[Performance] Added feedback section to routes`);
    }

    const projectCountStartTime = performance.now();
    console.log(
        `[Performance] Starting project count query for organization: ${locals.configuration.organization}`,
    );
    const projectCount = await prisma.project.count({
        where: {
            organization: locals.configuration.organization,
        },
    });
    const projectCountTime = performance.now() - projectCountStartTime;
    console.log(`[Performance] Project count query completed in ${projectCountTime.toFixed(2)}ms`);
    console.log(`[Performance] Found ${projectCount} projects`);

    if (locals.configuration.project_section && projectCount > 0) {
        routes.push(
            locals.language == Language.DUTCH
                ? ["Projecten", "/nl/projecten"]
                : ["Projects", "/en/projecten"],
        );
        console.log(`[Performance] Added projects section to routes`);
    }

    console.log(`[Performance] Adding custom pages to routes`);
    if (locals.language == Language.DUTCH) {
        for (const page of pages) {
            routes.push([page.nav_name_dutch, page.slug]);
            console.log(
                `[Performance] Added Dutch page route: ${page.nav_name_dutch} -> ${page.slug}`,
            );
        }
    } else {
        for (const page of pages) {
            routes.push([page.nav_name_english, page.slug]);
            console.log(
                `[Performance] Added English page route: ${page.nav_name_english} -> ${page.slug}`,
            );
        }
    }
    const routesTime = performance.now() - routesStartTime;
    console.log(`[Performance] Routes generation completed in ${routesTime.toFixed(2)}ms`);
    console.log(`[Performance] Generated ${routes.length} total routes`);

    const i18nStartTime = performance.now();
    console.log(
        `[Performance] Starting i18n fetch for organization: ${locals.configuration.organization}`,
    );
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
    console.log(`[Performance] Found ${i18n.length} i18n entries`);

    console.log(`[Performance] Setting up translation maps`);
    const translations: Record<"nl" | "en", Map<TranslationString, string>> = {
        nl: new Map(),
        en: new Map(),
    };

    console.log(
        `[Performance] Setting default translations for ${_TRANSLATION_STRINGS.length} strings`,
    );
    _TRANSLATION_STRINGS.forEach((e) => {
        translations.nl.set(e, `missing i18n: "${e}"`); //set key value as default value
        translations.en.set(e, `missing i18n: "${e}"`); //set key value as default value
    });

    console.log(`[Performance] Overriding with actual translations`);
    i18n.forEach(({ key, dutch, english }) => {
        translations.nl.set(key, dutch);
        translations.en.set(key, english);
    });
    const i18nTime = performance.now() - i18nStartTime;
    console.log(`[Performance] i18n processing completed in ${i18nTime.toFixed(2)}ms`);

    console.log(`[Performance] Checking navbar configuration`);
    if (JSON.stringify(locals.configuration.navbar) == JSON.stringify({})) {
        console.log(`[Performance] Empty navbar detected, initializing as empty array`);
        locals.configuration.navbar = [];
    }

    const totalTime = performance.now() - startTime;
    console.log(`[Performance] Total load function execution time: ${totalTime.toFixed(2)}ms`);

    const memoryUsage = process.memoryUsage();
    console.log(
        `[Performance] Memory usage: RSS=${(memoryUsage.rss / 1024 / 1024).toFixed(2)}MB, Heap=${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB/${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`,
    );

    // Done! Pass to the view.
    console.log(`[Performance] Returning data to view`);
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
