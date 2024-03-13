import mariadb from "mariadb";
import { PrismaClient } from "@prisma/client";
import { Organization as OrgEnum } from "@prisma/client";
import https from "https";
import fs from "fs";
import download from "download";

type Organization = {
    name: string;
    offset: number;
    files: string;
    enum: OrgEnum;
};

const organizations: Array<Organization> = [
    {
        name: "gsr",
        offset: 0,
        files: "https://gentsestudentenraad.be/static/persistent",
        enum: "GSR",
    },
];

async function files(org: Organization, maria: mariadb.Connection) {
    const rows = (await maria.query(`
        SELECT * from file
    `)) as any[];

    await Promise.all(
        rows.map((row) => download(`${org.files}/files/${row.path}`, "./migrate/files")),
    );
}

async function images(org: Organization, maria: mariadb.Connection) {
    const rows = (await maria.query(`
        SELECT * from image
    `)) as any[];

    await Promise.all(
        rows.map((row) => download(`${org.files}/images/${row.path}`, "./migrate/image")),
    );

    /*const failed_images : any = [];
    await Promise.all(rows.map(row => {
        try
        {
            const huh = download(`${org.files}/images/${row.path}`, './image');
            console.log(`[SUCCESS] ${org.files}/images/${row.path}`)
        }
        catch
        {
            console.log(`[FAILED] ${org.files}/images/${row.path}`)
            failed_images.push(row);
        }
    }));*/
}

// Fill tables
await Promise.all(
    organizations.map(async (org) => {
        const maria = await mariadb.createConnection({
            host: "localhost",
            user: "root", //used to be org.name, which is consistent with authentication of mariadb container on the server, had to change it so it works with my backup style
            password: "pass", //used to be org.name, which is consistent with authentication of mariadb container on the server, had to change it so it works with my backup style
            database: `${org.name}-prod`,
            port: 3306,
        });

        //await files(org, maria);
        await images(org, maria);
    }),
);

console.log("Done");
process.exit(0);
