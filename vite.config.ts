import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import ViteRestart from "vite-plugin-restart";

const config: UserConfig = {
    plugins: [
        sveltekit(),
        basicSsl(),
        ViteRestart({
            restart: ["static/**/*"],
        }),
    ],
    server: {
        proxy: {},
    },
};

export default config;
