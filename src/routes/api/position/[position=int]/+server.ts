import { error, json } from "@sveltejs/kit";
import { prisma } from "$lib/Prisma";
import type { Configuration } from "@prisma/client";
import type { RequestHandler } from "./$types";

export const PUT = (async ({ request, params }) => {
    const res: any = await request.json();
    const copy = JSON.parse(JSON.stringify(res)); //I hate javascript, but this is a deep copy
    delete copy.substitutes;

    //todo
    //so we first retrieve the preson from prisma
    //then re remove all their substituteforpositions
    //then we insert all the current ones we have access to

    try {
        await prisma.personPosition.update({
            data: copy,
            where: {
                id: Number.parseInt(params.position),
            },
        });

        await prisma.substituteForPosition.deleteMany({
            where: {
                position_id: Number.parseInt(params.position),
            },
        });

        for (const substitute of res.substitutes) {
            await prisma.substituteForPosition.create({
                data: {
                    person_id: substitute.person.id,
                    position_id: Number.parseInt(params.position),
                },
            });
        }

        return json({ message: "OK" });
    } catch (err) {
        console.log("errorrrr", err);
        throw error(500);
    }
}) satisfies RequestHandler;

export const DELETE = (async ({ params }) => {
    try {
        await prisma.personPosition.delete({
            where: {
                id: Number.parseInt(params.position),
            },
        });
        return json({ message: "OK" });
    } catch (err) {
        console.error(err);
        throw error(500);
    }
}) satisfies RequestHandler;
