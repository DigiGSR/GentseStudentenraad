import type { LayoutServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const prerender = false;
export const ssr = true;
export const csr = true;

export const load = (async ({ locals }) => {
    if (process.env.PUBLIC_ENV !== "dev") {
        //cas only check
        if (!locals.user) {
            throw error(403, "Unauthorized");
        }
        if (!locals.configuration.report_section) {
            throw error(404, "Not Found");
        }
    }
    return {};
}) satisfies LayoutServerLoad;
