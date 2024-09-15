import * as mariadb from "mariadb";
import { PrismaClient } from "@prisma/client";
import { Organization as OrgEnum } from "@prisma/client";
import * as https from "https";
import * as fs from "fs";
import * as download from "download";

console.log(download);

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
    { name: "ppsr", offset: 1000, files: "https://ppsr.ugent.be/static/persistent", enum: "PPSR" },
    { name: "fris", offset: 2000, files: "https://fris.ugent.be/static/persistent", enum: "FRIS" },
    {
        name: "sturec",
        offset: 3000,
        files: "https://sturec.ugent.be/static/persistent",
        enum: "STUREC",
    },
    {
        name: "stura",
        offset: 4000,
        files: "https://stura.ugent.be/static/persistent",
        enum: "STURA",
    },
    { name: "bsr", offset: 5000, files: "https://bsr.ugent.be/static/persistent", enum: "BSR" },
    {
        name: "stuart",
        offset: 6000,
        files: "https://stuart.ugent.be/static/persistent",
        enum: "STUART",
    },
    {
        name: "stuff",
        offset: 7000,
        files: "https://stuff.ugent.be/static/persistent",
        enum: "STUFF",
    },
    {
        name: "stubio",
        offset: 8000,
        files: "https://stubio.ugent.be/static/persistent",
        enum: "STUBIO",
    },
    {
        name: "stuveco",
        offset: 9000,
        files: "https://stuveco.ugent.be/static/persistent",
        enum: "STUVECO",
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

    rows.map((x) => {
        console.log(x);
    });

    for (const row of rows) {
        if (row.path) {
            console.log(`${org.files}/images/${row.path}`);
            download(`${org.files}/images/${row.path}`, "./migrate/image");
        }
    }
}

// Fill tables
(async () => {
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
})();

console.log("Done");
