import fs from "fs";
export async function GET({ params }) {
    const name = params.filename;
    console.log("bingus", fs.readdirSync("./uploads/api"));
    const data = await fs.promises.readFile(`./uploads/api/${name}`);
    return new Response(data);
}
