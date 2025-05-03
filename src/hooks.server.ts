import { type Handle } from "@sveltejs/kit";
import { prisma } from "$lib/Prisma";
import { Language } from "$lib/Language";
import { XMLParser } from "fast-xml-parser";
import jwt from "jsonwebtoken";
import type { Prisma } from "@prisma/client";
import * as cookie from "cookie";

const secret = "insecure";

export const handle = (async ({ event, resolve }) => {
    const startPerf = performance.now();
    const start = new Date();

    // Timing object to store all measurements
    const timing = {
        total: 0,
        auth: {
            token: 0,
            cas: 0,
            total: 0,
        },
        config: 0,
        authorization: 0,
        resolve: 0,
    };

    // Authentication
    const authStart = performance.now();
    const token = event.cookies.get("jwt");
    const ticket = event.url.searchParams.get("ticket");
    let tokenExpired = false;

    //let storedUser = null;

    if (token) {
        const tokenStart = performance.now();
        try {
            const decoded = jwt.verify(token, secret) as { username: string };
            console.log("decoded", decoded);
            event.locals.user = await prisma.user.findUniqueOrThrow({
                where: {
                    username: decoded.username,
                },
            });
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                tokenExpired = true;
            } else {
                // TODO: notify user that login has failed.
                console.error(e);
            }
        }
        timing.auth.token = performance.now() - tokenStart;
    }

    if (ticket) {
        const casStart = performance.now();
        try {
            // Validate against CAS
            const res = await fetch(
                `https://login.ugent.be/serviceValidate?service=${event.url.origin}&ticket=${ticket}`,
            );

            // Parse XML as User
            const xml = await res.text();
            const result = new XMLParser().parse(xml)["cas:serviceResponse"][
                "cas:authenticationSuccess"
            ]["cas:attributes"];
            const user: Prisma.UserCreateInput = {
                email: result["cas:mail"],
                student: result["cas:objectClass"].includes("ugentStudent"),
                surname: result["cas:surname"],
                username: result["cas:uid"],
                given_name: result["cas:givenname"],
            };

            // Retrieve all the user's features from the database
            event.locals.user = await prisma.user.upsert({
                create: user,
                update: user,
                where: {
                    username: user.username,
                },
            });

            // storedUser = event.locals.user;

            // Set JWT to keep user online.
            const encoded = jwt.sign({ username: user.username }, secret, { expiresIn: "1h" });
            event.cookies.set("jwt", encoded, { path: "/" });
        } catch (e) {
            // TODO: notify user that login has failed.
            console.error(e);
        }
        timing.auth.cas = performance.now() - casStart;
    }
    timing.auth.total = performance.now() - authStart;

    // Configuration lookup
    const configStart = performance.now();
    // Retrieve the selected organization based on:
    // 1. A URL query such as `?host=gentsestudentenraad.be`, for development purposes.
    // 2. The hostname contained in the request headers.
    const requestedHost = event.url.searchParams.get("host") || event.url.hostname;

    console.log("host", requestedHost);

    let configuration = await prisma.configuration.findFirst({
        where: {
            hostnames: {
                has: requestedHost,
            },
        },
    });

    if (!configuration && process.env.PUBLIC_ENV === "dev") {
        //if dev environment and no arg, just default to gsr site
        configuration = await prisma.configuration.findFirst({
            where: {
                hostnames: {
                    has: "gsr.staging.gentsestudentenraad.be",
                },
            },
        });
    }
    timing.config = performance.now() - configStart;

    //START AUTOADMIN

    // Make the user an admin for the current organization
    // if (ticket && storedUser) {
    //     console.log("storedUser", storedUser);
    //     const existingAdmin = await prisma.admin.findFirst({
    //         where: {
    //             user_id: storedUser.id,
    //             organization: configuration.organization,
    //         },
    //     });

    //     if (!existingAdmin) {
    //         await prisma.admin.create({
    //             data: {
    //                 user_id: storedUser.id,
    //                 organization: configuration.organization,
    //             },
    //         });
    //     }
    // }

    //STOP AUTOADMIN

    //this is for dev environment so that if ?host is not supplied we default to gsr config

    const language = event.params.language === "en" ? Language.ENGLISH : Language.DUTCH;

    event.locals.configuration = configuration;
    event.locals.language = language;

    // Authorization
    const authzStart = performance.now();
    //console.log("storeduser", event.locals.user);
    // Authorisation
    if (process.env.PUBLIC_ENV !== "dev") {
        if (event.locals.user) {
            const count = await prisma.admin.count({
                where: {
                    OR: [{ organization: configuration.organization }, { organization: "COMMON" }],
                    user_id: event.locals.user.id,
                },
            });
            event.locals.admin = count > 0;
        }

        // TODO: Better authentication for API routes.
        //console.log("pathnameee", event.url.pathname);

        //     if (
        //         (event.url.pathname.startsWith("/api") &&
        //             (!event.url.pathname.startsWith("/api/calendar") ||
        //                 !event.url.pathname.startsWith("/api/images"))) ||
        //         event.url.pathname.includes("/admin")
        //     ) {
        //         if (!event.locals.user) {
        //             throw error(401, "Unauthorized");
        //         } else if (!event.locals.admin) {
        //             throw error(403, "Forbidden");
        //         }
        //     }
    }
    timing.authorization = performance.now() - authzStart;

    // Page resolution
    const resolveStart = performance.now();
    const response = await resolve(event, {
        transformPageChunk: ({ html }) => html.replace("%lang%", event.params.language ?? "en"),
    });
    timing.resolve = performance.now() - resolveStart;

    if (tokenExpired) {
        response.headers.set(
            "set-cookie",
            cookie.serialize("jwt", "", {
                expires: new Date("Thu, 01 Jan 1970 00:00:01 GMT"),
            }),
        );
    }

    // Calculate total time
    timing.total = performance.now() - startPerf;

    // Log all timing information
    console.log(
        `\
IP:\t\t${event.getClientAddress()}
TIMESTAMP:\t${start.toISOString()}
TARGET:\t\t${event.request.method} ${event.url}
RESPONSE:\t${response.status} (${Date.now() - start.valueOf()}ms)
TIMING:
  Total:        ${timing.total.toFixed(2)}ms
  Auth:         ${timing.auth.total.toFixed(2)}ms
    - Token:    ${timing.auth.token.toFixed(2)}ms
    - CAS:      ${timing.auth.cas.toFixed(2)}ms
  Config:       ${timing.config.toFixed(2)}ms
  Authorization:${timing.authorization.toFixed(2)}ms
  Resolve:      ${timing.resolve.toFixed(2)}ms
`,
    );

    return response;
}) satisfies Handle;
