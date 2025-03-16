import { error, json } from "@sveltejs/kit";
import { prisma } from "$lib/Prisma";
import type { Feedback } from "@prisma/client";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
    const res: Feedback = await request.json();

    try {
        const feedback = await prisma.feedback.create({
            data: res,
        });

        return json(feedback);
    } catch (err) {
        console.error(err);
        throw error(500, "Failed to create feedback");
    }
}) satisfies RequestHandler;
