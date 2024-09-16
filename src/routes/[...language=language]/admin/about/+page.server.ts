import type { PageServerLoad } from "./$types";

export const prerender = false;
export const ssr = true;
export const csr = true;

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

import { writeFileSync, existsSync, mkdirSync } from "fs";
import crypto from "crypto";
import type { Actions } from "@sveltejs/kit";

export const actions = {
    //todo, types and somehow throw all this code into one function, since its spread over verslagen en person now
    default: async ({ request }) => {
        const formData = Object.fromEntries(await request.formData());
        console.log("le formdata: ", formData);

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

        /*await prisma.configuration.update({
            data: res,
            where: {
                organization: res.organization,
            },
        });*/

        if (!existsSync(`${process.env.UPLOAD_DIR}/${routeDirectory}`)) {
            mkdirSync(`${process.env.UPLOAD_DIR}/${routeDirectory}`);
        }
        writeFileSync(
            `${process.env.UPLOAD_DIR}/${filePath}`,
            Buffer.from(await fileToUpload.arrayBuffer()),
        );

        return {
            success: true,
        };
    },
} satisfies Actions;

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
