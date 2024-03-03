import fs from "fs";

export async function GET({ params }) {
    const name = params.id ?? "";
    const data = fs.promises.readFile(`${process.env.UPLOAD_DIR}/person/${name}`);
    return new Response(await data, {
        headers: { "Cache-Control": "max-age=604800, stale-while-revalidate=86400" },
    });
    //todo handle file not found and access control
}
