import { error, json } from "@sveltejs/kit";
import { prisma } from "$lib/Prisma";
import type { RequestHandler } from "./$types";

export const PUT = (async ({ request }) => {
    //we deviate from the normal architecture of just inserting our normal data since the admin route is a mix of 2 tables
    //and we dont want to make every api clal on it include thousands of user data, since thats just a lot of data
    //instead we work in mutations, which look like this {id: number, isAdmin: boolean}

    const res: any = await request.json(); //todo type

    try {
        for (const mutation of res) {
            if (mutation.isAdmin === "False") {
                await prisma.admin.deleteMany({
                    //this is only delete many because otherwise I cant use the AND selector. Why? ask the prisma devs...
                    where: {
                        AND: [{ user_id: mutation.id }, { organization: mutation.organization }],
                    },
                });

                //insert linked admin data
            } else if (mutation.isAdmin === "True") {
                await prisma.admin.create({
                    data: {
                        user_id: mutation.id,
                        organization: mutation.organization,
                    },
                });
            }
        }
        return json({ count: res.length });
    } catch (err) {
        console.log(err);
        throw error(500);
    }
}) satisfies RequestHandler;
