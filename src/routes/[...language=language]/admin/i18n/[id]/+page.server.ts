import { prisma } from "$lib/Prisma";
import { _TRANSLATION_STRINGS, type TranslationString } from "../+page.server";

import type { PageServerLoad } from "./$types";
export const prerender = false;
export const ssr = false;
export const csr = true;

export const load = (async ({ locals, params }) => {
    const text = await prisma.i18n.findFirstOrThrow({
        where: {
            id: parseInt(params.id),
        },
    });
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

    missingKeys.push(text.key as TranslationString); // dit moet want de huidige key is ook valid

    return {
        text,
        missingKeys,
    };
}) satisfies PageServerLoad;
