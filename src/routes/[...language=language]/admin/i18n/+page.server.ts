import { prisma } from "$lib/Prisma";
import type { PageServerLoad } from "./$types";

export const prerender = false;
export const ssr = false;
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
    "werkgroep-geen-verslagen",
    "who-about",
] as const;

export type TranslationString = (typeof _TRANSLATION_STRINGS)[number];

export const load = (async ({ locals }) => {
    const texts = await prisma.i18n.findMany({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const missingKeys: TranslationString[] = [..._TRANSLATION_STRINGS];

    for (const { key } of texts) {
        const keyIndex = missingKeys.indexOf(key as TranslationString);
        if (keyIndex > -1) {
            missingKeys.splice(keyIndex, 1);
        }
    }

    return {
        texts,
        missingKeys,
    };
}) satisfies PageServerLoad;
