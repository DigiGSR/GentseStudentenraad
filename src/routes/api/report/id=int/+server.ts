import { error, json } from "@sveltejs/kit";
import { prisma } from "$lib/Prisma";
import type { Configuration } from "@prisma/client";
import type { RequestHandler } from "./$types";

export const PUT = (async ({ request, params }) => {
    const res: Configuration = await request.json();

    try {
        await prisma.report.update({
            data: res,
            where: {
                id: Number.parseInt(params.id),
            },
        });
        return json({ message: "OK" });
    } catch {
        throw error(500);
    }
}) satisfies RequestHandler;

export const DELETE = (async ({ params }) => {
    try {
        await prisma.report.delete({
            where: {
                id: Number.parseInt(params.id),
            },
        });
        return json({ message: "OK" });
    } catch (err) {
        console.error(err);
        throw error(500);
    }
}) satisfies RequestHandler;
