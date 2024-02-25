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

import { writeFileSync } from "fs";
import crypto from "crypto";

interface FileUploadResponse {
    success: boolean;
    filePath?: string;
}

export const actions = {
    default: async ({ request, params, url, locals }): Promise<FileUploadResponse> => {
        console.log("YIPPIE!\n");
        console.log(request);
        const formData = Object.fromEntries(await request.formData());

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

        const filePath = `person/${randomFilename}.${fileExtension}`;

        const person = await prisma.person.update({
            where: {
                id: parseInt(params.id),
            },
            data: {
                image: `/${filePath}`,
            },
        });

        writeFileSync(`static/${filePath}`, Buffer.from(await fileToUpload.arrayBuffer()));
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
