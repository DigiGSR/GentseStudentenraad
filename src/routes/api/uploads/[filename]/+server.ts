import fs from "fs";
export async function GET({ params }) {
    const name = params.filename;
    console.log("bingus", fs.readdirSync("./uploads/api/uploads"));
    const data = await fs.promises.readFile(`./uploads/api/uploads/${name}`);
    return new Response(data);
}
