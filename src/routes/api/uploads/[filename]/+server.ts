import fs from "fs";
export const config = {
    runtime: "edge",
    regions: ["all"],
};

export async function GET({ params, request }) {
    const name = params.filename;

    try {
        console.log("bingus", fs.readdirSync("./uploads/api/uploads"));
        const data = await fs.promises.readFile(`./uploads/api/uploads/${name}`);

        //who up caching !!
        const headers = new Headers();
        headers.set("Cache-Control", "public, max-age=86400");

        const stats = fs.statSync(`./uploads/api/uploads/${name}`);
        const etag = `W/"${stats.size}-${stats.mtime.getTime()}"`;
        headers.set("ETag", etag);

        const ifNoneMatch = request.headers.get("If-None-Match");
        if (ifNoneMatch === etag) {
            return new Response(null, { status: 304, headers });
        }

        return new Response(data, { headers });
    } catch {
        return new Response("File not found", { status: 404 });
    }
}
