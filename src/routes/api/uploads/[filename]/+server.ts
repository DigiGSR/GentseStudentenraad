import fs from "fs";
export async function GET({ params }) {
    const name = params.filename;
    console.log("bingus", fs.readdirSync("./api/uploads"));
    const data = await fs.promises.readFile(`./api/uploads/${name}`);
    return new Response(data);
}
