import { prisma } from "$lib/Prisma";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, locals }) => {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        throw error(400, "Invalid feedback ID");
    }

    const feedback = await prisma.feedback.findUnique({
        where: {
            id: id,
        },
        include: {
            subject: true,
            course: true,
        },
    });

    if (!feedback || feedback.organization !== locals.configuration.organization) {
        throw error(404, "Feedback not found");
    }

    return {
        feedback,
    };
}) satisfies PageServerLoad;
