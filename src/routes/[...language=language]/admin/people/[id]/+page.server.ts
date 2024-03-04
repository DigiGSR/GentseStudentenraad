import { prisma } from "$lib/Prisma";
import type { PageServerLoad } from "./$types";

export const prerender = false;
export const ssr = false;
export const csr = true;

export const load = (async ({ params, locals }) => {
    const person = await prisma.person.findFirstOrThrow({
        include: {
            positions: {
                include: {
                    person_group: true,
                    substitutes: {
                        include: {
                            person: {},
                        },
                    },
                },
            },
        },
        where: {
            id: parseInt(params.id),
        },
    });

    const allPeople = await prisma.person.findMany({
        orderBy: [
            {
                name: "asc",
            },
        ],
    });

    const groups = await prisma.personGroup.findMany({
        where: {
            organization: locals.configuration.organization,
        },
    });

    return {
        allPeople,
        person,
        groups,
    };
}) satisfies PageServerLoad;

import { writeFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
import crypto from "crypto";

export const actions = {
    //todo, types and somehow throw all this code into one function, since its spread over verslagen en person now
    default: async ({ request, params, url, locals }): any => {
        const formData = Object.fromEntries(await request.formData());

        const routeDirectory = "person";

        if (
            !(formData.fileToUpload as File).name ||
            (formData.fileToUpload as File).name === "undefined"
        ) {
            return {
                success: false,
                filePath: undefined,
            };
        }

        const { fileToUpload } = formData as { fileToUpload: File };

        const fileExtension = getFileExtension(fileToUpload.name);

        const randomFilename = generateRandomFilename(16);

        const filePath = `${routeDirectory}/${randomFilename}.${fileExtension}`;

        const person = await prisma.person.findFirst({
            where: {
                id: parseInt(params.id),
            },
        });

        await prisma.person.update({
            where: {
                id: parseInt(params.id),
            },
            data: {
                image: `/api/uploads/${filePath}`,
            },
        });

        if (!existsSync(`${process.env.UPLOAD_DIR}/${routeDirectory}`)) {
            mkdirSync(`${process.env.UPLOAD_DIR}/${routeDirectory}`);
        }
        writeFileSync(
            `${process.env.UPLOAD_DIR}/${filePath}`,
            Buffer.from(await fileToUpload.arrayBuffer()),
        );

        const oldImagePath =
            process.env.UPLOAD_DIR.replace(/\/api\//, "/").replace(/\/[^/]*$/, "") + person.image;
        //trust me im an engineer

        if (existsSync(oldImagePath)) {
            unlinkSync(oldImagePath);
        }
        //todo not working currently, something wrong here

        console.log(oldImagePath);
        //todo delete old file

        return {
            success: true,
        };
    },
};

function getFileExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

function generateRandomFilename(length: number): string {
    return crypto
        .randomBytes(length)
        .toString("base64")
        .replace(/\//g, "a")
        .replace(/\+/g, "c")
        .substr(0, length);
}
