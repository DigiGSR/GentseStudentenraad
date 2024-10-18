import type { LayoutServerLoad } from "./$types";

export const prerender = false;
export const ssr = true;
export const csr = true;

export const load = (async () => {
    /*if (process.env.PUBLIC_ENV !== "dev") {
        //cas only check
        if (!locals.user) {
            throw error(403, "Unauthorized");
        }
    }*/
    return {};
}) satisfies LayoutServerLoad;
