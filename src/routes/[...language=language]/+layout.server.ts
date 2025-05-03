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
    console.time("layout-server-total");
    console.log("Starting layout server load function");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = params.language;

    // Create navigation bar routes. It's a bit messy but it's our only option.
    const routes = [];

    console.time("fetch-configurations");
    const configs = await prisma.configuration.findMany();
    console.timeEnd("fetch-configurations");
    console.log(`Fetched ${configs.length} configurations`);

    console.time("fetch-pages");
    const pages = await prisma.page.findMany({
        where: { organization: locals.configuration.organization },
    });
    console.timeEnd("fetch-pages");
    console.log(
        `Fetched ${pages.length} pages for organization: ${locals.configuration.organization}`,
    );

    console.time("build-navigation-routes");
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

    console.time("check-project-count");
    const projectCount = await prisma.project.count({
        where: {
            organization: locals.configuration.organization,
        },
    });
    console.timeEnd("check-project-count");
    console.log(
        `Project count for organization ${locals.configuration.organization}: ${projectCount}`,
    );

    if (locals.configuration.project_section && projectCount > 0) {
        routes.push(
            locals.language == Language.DUTCH
                ? ["Projecten", "/nl/projecten"]
                : ["Projects", "/en/projecten"],
        );
    }
    console.timeEnd("build-navigation-routes");
    console.log(`Built ${routes.length} navigation routes`);

    console.time("fetch-i18n");
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
    console.timeEnd("fetch-i18n");
    console.log(`Fetched ${i18n.length} translation entries`);

    console.time("add-pages-to-routes");
    if (locals.language == Language.DUTCH) {
        for (const page of pages) {
            routes.push([page.nav_name_dutch, page.slug]);
        }
    } else {
        for (const page of pages) {
            routes.push([page.nav_name_english, page.slug]);
        }
    }
    console.timeEnd("add-pages-to-routes");
    console.log(`Final routes count: ${routes.length}`);

    console.time("initialize-translations");
    const translations: Record<"nl" | "en", Map<TranslationString, string>> = {
        nl: new Map(),
        en: new Map(),
    };

    _TRANSLATION_STRINGS.forEach((e) => {
        translations.nl.set(e, `missing i18n: "${e}"`); //set key value as default value
        translations.en.set(e, `missing i18n: "${e}"`); //set key value as default value
    });
    console.timeEnd("initialize-translations");
    console.log(
        `Initialized ${_TRANSLATION_STRINGS.length} translation strings with default values`,
    );

    console.time("set-translations");
    let validTranslationCount = 0;
    i18n.forEach(({ key, dutch, english }) => {
        if (_TRANSLATION_STRINGS.includes(key as TranslationString)) {
            translations.nl.set(key as TranslationString, dutch);
            translations.en.set(key as TranslationString, english);
            validTranslationCount++;
        }
    });
    console.timeEnd("set-translations");
    console.log(`Set ${validTranslationCount} valid translations from database`);

    console.time("finalize-configuration");
    if (JSON.stringify(locals.configuration.navbar) == JSON.stringify({})) {
        locals.configuration.navbar = [];
    }
    console.timeEnd("finalize-configuration");

    // Check for missing translations
    console.time("check-missing-translations");
    const missingTranslations = _TRANSLATION_STRINGS.filter(
        (key) =>
            translations.nl.get(key).startsWith("missing i18n") ||
            translations.en.get(key).startsWith("missing i18n"),
    );
    console.timeEnd("check-missing-translations");

    if (missingTranslations.length > 0) {
        console.warn("Missing translations found:", missingTranslations);
    }

    // Done! Pass to the view.
    console.log("Layout server load function completed");
    console.timeEnd("layout-server-total");

    return {
        language: locals.language,
        configs: configs.filter((e) => e.id != locals.configuration.id),
        configuration: locals.configuration,
        i18n: translations,
        user: locals.user,
        admin: locals.admin,
    };
}) satisfies LayoutServerLoad;
