import type { LayoutServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const prerender = false;
export const ssr = true;
export const csr = true;

export const load = (async ({ locals }) => {
    if (process.env.PUBLIC_ENV !== "dev") {
        if (!locals.user && !locals.admin) {
            throw error(403, "Unauthorized");
        }
    }
    return {};
}) satisfies LayoutServerLoad;
