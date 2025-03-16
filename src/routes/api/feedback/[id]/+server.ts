import { error, json } from "@sveltejs/kit";
import { prisma } from "$lib/Prisma";
import type { RequestHandler } from "./$types";

export const DELETE = (async ({ params }) => {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        throw error(400, "Invalid feedback ID");
    }

    try {
        await prisma.feedback.delete({
            where: {
                id: id,
            },
        });

        return json({ success: true });
    } catch (err) {
        console.error("Error deleting feedback:", err);
        throw error(500, "Failed to delete feedback");
    }
}) satisfies RequestHandler;
