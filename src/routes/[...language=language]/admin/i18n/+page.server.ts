import { prisma } from "$lib/Prisma";
import type { PageServerLoad } from "./$types";
import { readdir, stat, readFile } from "fs/promises";
import { join } from "path";

export const prerender = false;
export const ssr = false;
export const csr = true;

export const load = (async ({ locals }) => {
    const texts = await prisma.i18n.findMany({
        where: {
            organization: locals.configuration.organization,
        },
    });

    const i18nRegex = /data.i18n.get\("(.*)"\)/;
    const regexes = await searchFiles("./src", i18nRegex);
    //this has got to be the most schizophrenic solution in all of computer science
    //ik gebruik een regex om te zoeken naar elke invocation van i18n.get, omdat dat
    //effectief de enige manier was. Zoek voor een manier om dit te cachen, I beg u

    const missingKeys = regexes.filter((reg) => {
        for (const { key } of texts) {
            if (reg == key) {
                return false;
            }
        }
        return true;
    });

    return {
        texts,
        missingKeys,
    };
}) satisfies PageServerLoad;

async function searchFiles(directoryPath, regexPattern) {
    const occurences = [];
    try {
        const files = await readdir(directoryPath);

        for (const file of files) {
            const filePath = join(directoryPath, file);
            const fileStats = await stat(filePath);

            if (fileStats.isDirectory()) {
                const subdirOccurences = await searchFiles(filePath, regexPattern); // Capture results from recursive call
                occurences.push(...subdirOccurences); // Concatenate results with current occurences
            } else if (
                fileStats.isFile() &&
                (file.endsWith(".svelte") || file.endsWith(".server.ts"))
            ) {
                const fileData = await readFile(filePath, "utf8");

                const matches = regexPattern.exec(fileData);

                if (matches) {
                    occurences.push(matches[1]);
                }
            }
        }
        return occurences;
    } catch (err) {
        console.error("Error:", err);
        return occurences; // Ensure that even if an error occurs, you return what you've collected so far
    }
}
