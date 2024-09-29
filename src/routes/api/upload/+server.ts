import { writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

function makeSureDirectoriesExist(filePath: string) {
    const dirs = filePath.split(path.sep);
    dirs.pop();
    let currentDir = process.env.UPLOAD_DIR;
    for (const dir of dirs) {
        currentDir = `${currentDir}/${dir}`;
        console.log("currentDir", currentDir);
        try {
            if (!existsSync(currentDir)) {
                mkdirSync(currentDir, { recursive: true });
            }
        } catch (err) {
            console.error("Error creating directory:", err);
            throw err;
        }
    }
}

function deleteOldFile(oldFilename: string) {
    //first make sure its not from old website
    if (!oldFilename.startsWith("https://gentsestudentenraad.be/static/persistent/")) {
        //todo handle deletion
        //unlinkSync(`${process.env.UPLOAD_DIR}/${oldFilename}`);
    }
}

// function generateRandomFilename(length: number) {
//     const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//     let filename = "";

//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * charset.length);
//         filename += charset.charAt(randomIndex);
//     }

//     return filename;
// }

// function getFileExtension(filename: string): string {
//     return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
// }

export const POST = async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());

    //we get the filename from the user because thats how I integrated it okay
    const filePath = formData.uploadFilename; //I love blindly trusting user input
    const oldFilename = formData.oldFilename; //I love blindly trusting user input

    if (typeof filePath !== "string") {
        throw new Error("Not a string...");
    }

    if (typeof oldFilename !== "string") {
        throw new Error("Not a string...");
    }

    //console.log("filePath and oldfilename", filePath, oldFilename);
    if (
        !(formData.fileToUpload as File).name ||
        (formData.fileToUpload as File).name === "undefined"
    ) {
        return new Response(
            {
                success: false,
                filePath: undefined,
            }.toString(),
        );
    }

    const { fileToUpload } = formData as { fileToUpload: File };
    //console.log("fileToUpload", fileToUpload);

    makeSureDirectoriesExist(filePath);

    if (oldFilename) {
        deleteOldFile(oldFilename);
    }
    //console.log(`${process.env.UPLOAD_DIR}/${filePath}`);

    writeFileSync(
        `${process.env.UPLOAD_DIR}/${filePath}`,
        Buffer.from(await fileToUpload.arrayBuffer()),
    );

    return new Response(
        {
            success: true,
            filePath: filePath,
        }.toString(),
    );
};
