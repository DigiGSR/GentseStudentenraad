import { fail } from "@sveltejs/kit";
import { writeFileSync } from "fs";

export const actions = {
    default: async ({ request }) => {
        console.log("YIPPIE!\n");
        const formData = Object.fromEntries(await request.formData());

        if (
            !(formData.fileToUpload as File).name ||
            (formData.fileToUpload as File).name === "undefined"
        ) {
            return fail(400, {
                error: true,
                message: "You must provide a file to upload",
            });
        }

        const { fileToUpload } = formData as { fileToUpload: File };
        //todo, remove old picture
        writeFileSync(
            `static/person/${fileToUpload.name}`,
            Buffer.from(await fileToUpload.arrayBuffer()),
        );

        return {
            success: true,
        };
    },
};
