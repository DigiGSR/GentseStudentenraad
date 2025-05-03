import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/Prisma";
import { Language } from "$lib/Language";
import { error } from "@sveltejs/kit";
import { Prisma } from "@prisma/client";

export const prerender = false;
export const ssr = true;
export const csr = true;

export const load = (async ({ params, locals }) => {
    const startTime = performance.now();

    if (params.extra === "getfile") {
        return {
            timings: {
                total: performance.now() - startTime,
            },
        };
    }

    const queryStartTime = performance.now();
    const post = await prisma.page.findFirstOrThrow({
        where: {
            slug: params.extra,
            organization: locals.configuration.organization,
        },
    });
    const queryTime = performance.now() - queryStartTime;

    const configStartTime = performance.now();
    const config = post.config as Prisma.JsonObject;
    const configTime = performance.now() - configStartTime;

    const contentStartTime = performance.now();
    const source = locals.language == Language.DUTCH ? post.content_dutch : post.content_english;
    const contentTime = performance.now() - contentStartTime;

    if (!source) {
        throw error(404, { message: "Not found" });
    }

    const html = source;
    const totalTime = performance.now() - startTime;

    return {
        contents: html,
        banner: config["banner"] ?? "",
        banner_alt: config["banner_alt"] ?? "",
        timings: {
            query: queryTime,
            config: configTime,
            content: contentTime,
            total: totalTime,
        },
    };
}) satisfies PageServerLoad;
