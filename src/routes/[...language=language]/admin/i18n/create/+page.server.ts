import { prisma } from "$lib/Prisma";
import type { PageServerLoad } from "./$types";
export const prerender = false;
export const ssr = false;
export const csr = true;
import { _TRANSLATION_STRINGS } from "../../../+layout.server";
import type { TranslationString } from "../../../+layout.server";

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
