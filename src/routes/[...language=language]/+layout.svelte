<script lang="ts">
    import "../../app.scss";
    import { page } from "$app/stores";
    import type { LayoutData } from "./$types";
    let showLinks = false;
    export let data: LayoutData;

    let isdropDownHidden = false;
    let navBarHeight;
</script>

<div class="flex flex-col w-full min-h-[100vh]">
    <nav
        class="relative"
        bind:clientHeight={navBarHeight}
        style:background-color={data.configuration.brand_color_primary}
    >
        <div class="flex text-white lg:text-sm text-xs shadow-md p-3 items-center gap-5">
            <!--            <button on:click={() => (showLinks = !showLinks)}>-->
            <!--                <i class="bi-list text-xl cursor-pointer p-1" />-->
            <!--            </button>-->

            <a href="/nl">
                <img
                    src={data.configuration.logo_url}
                    class="h-8 invisible lg:visible"
                    alt="Logo"
                />
            </a>

            {#each data.routes as route}
                {#if route.hierarchyRoute === true}
                    <div class="flex-col hover:cursor-pointer group min-w-fit">
                        <div
                            style:background-color={data.configuration.brand_color_primary}
                            style={`top: ${navBarHeight}px;`}
                            class="group-hover:visible invisible absolute gap-y-2 py-2 flex flex-col justify-between px-8 border-t-white border-t-2"
                        >
                            {#each route.childRoutes as childRoute}
                                <a
                                    class="hover:opacity-70 opacity-100 transition duration-150"
                                    href={childRoute.route}>{childRoute.name}</a
                                >
                            {/each}
                        </div>
                        <a
                            class="pb-6 hover:opacity-70 w-fit opacity-100 transition duration-150"
                            href={route.route}
                            >{route.name} <i class="bi bi-chevron-down translate-y-0.25" /></a
                        >
                    </div>
                {:else}
                    <a
                        class="hover:opacity-70 opacity-100 transition duration-150"
                        href={route.route}>{route.name}</a
                    >
                {/if}
            {/each}

            {#if data.configuration.organization == "GSR"}
                <div
                    on:mouseenter={() => {
                        isdropDownHidden = true;
                    }}
                    on:mouseleave={() => {
                        isdropDownHidden = false;
                    }}
                    class="relative group {isdropDownHidden ? 'py-10 px-6 -mx-6 -my-10' : ''} "
                >
                    <div
                        class="flex flex-row gap-x-1 hover:cursor-pointer hover:opacity-70 opacity-100 transition duration-150"
                    >
                        {#if isdropDownHidden}
                            <i class="bi bi-diagram-3-fill text-lg translate-y-0.25" />
                        {:else}
                            <i class="bi bi-diagram-3 text-lg translate-y-0.25" />
                        {/if}
                    </div>

                    <!-- Dropdown options -->
                    <div
                        style:background-color={data.configuration.brand_color_primary}
                        style={`top: ${navBarHeight}px;`}
                        class="absolute top-0 {isdropDownHidden
                            ? 'visible'
                            : 'invisible'} flex flex-col w-64 -ml-[7.25rem] pb-2 py-1 space-y-2 shadow-lg"
                    >
                        <div class="flex justify-between px-8 border-t-white border-t-2 flex-row">
                            <a
                                href="https://epione.sittool.net/"
                                class="flex flex-col justify-center items-center hover:cursor-pointer hover:opacity-70 opacity-100 transition duration-150"
                            >
                                <div
                                    class="w-16 bg-center bg-contain bg-no-repeat h-16"
                                    style="background-image: url(/img/epione.png)"
                                />
                                <p class="mt-1">Epione</p>
                            </a>
                            <a
                                href="http://cultour.be/"
                                class="flex flex-col justify-center items-center hover:cursor-pointer hover:opacity-70 opacity-100 transition duration-150"
                            >
                                <div
                                    class="w-16 bg-center bg-contain bg-no-repeat h-16"
                                    style="background-image: url(/img/cultour.jpg)"
                                />
                                <p class="mt-1">Cultour</p>
                            </a>
                        </div>
                    </div>
                </div>
            {/if}

            <div class="grow lg:flex hidden" />

            <!--bi class is bootstrap icons-->

            {#if data.configuration.facebook_url}
                <a href={data.configuration.facebook_url}>
                    <i
                        class="bi bi-facebook hover:opacity-70 opacity-100 transition duration-150"
                    />
                </a>
            {/if}

            {#if data.configuration.twitter_url}
                <a href={data.configuration.twitter_url}>
                    <i class="bi bi-twitter hover:opacity-70 opacity-100 transition duration-150" />
                </a>
            {/if}

            {#if data.configuration.instagram_url}
                <a href={data.configuration.instagram_url}>
                    <i
                        class="bi bi-instagram hover:opacity-70 opacity-100 transition duration-150"
                    />
                </a>
            {/if}

            {#if data.configuration.tiktok_url}
                <a href={data.configuration.tiktok_url}>
                    <i class="bi bi-tiktok hover:opacity-70 opacity-100 transition duration-150" />
                </a>
            {/if}

            {#if data.configuration.discord_url}
                <a href={data.configuration.discord_url}>
                    <i class="bi bi-discord hover:opacity-70 opacity-100 transition duration-150" />
                </a>
            {/if}

            {#if data.configuration.linkedin_url}
                <a href={data.configuration.linkedin_url}>
                    <i
                        class="bi bi-linkedin hover:opacity-70 opacity-100 transition duration-150"
                    />
                </a>
            {/if}

            {#if data.configuration.github_url}
                <a href={data.configuration.github_url}>
                    <i class="bi bi-github hover:opacity-70 opacity-100 transition duration-150" />
                </a>
            {/if}

            <div />

            {#if data.user}
                <div class="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full">
                    {#if data.admin}
                        <a href="/admin">
                            <i class="bi bi-gear" />
                        </a>
                    {/if}
                    <p class="text-xs font-semibold">{data.user.username}</p>
                </div>
            {:else}
                <a
                    class="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full"
                    href="https://login.ugent.be/login?service={$page.url.origin}"
                >
                    <i class="bi bi-person" />
                    <p class="text-xs lg:block hidden font-semibold">Inloggen</p>
                </a>
            {/if}

            {#if data.configuration.i18n}
                {#if $page.url.toString().includes("/en")}
                    <a
                        class="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full"
                        href={$page.url.toString().replace("/en", "/nl")}
                    >
                        <i
                            class="bi bi-translate hover:opacity-70 opacity-100 transition duration-150"
                        />
                        <p class="text-xs font-semibold">NL</p>
                    </a>
                {:else}
                    <a
                        class="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full"
                        href={$page.url.toString().includes("/nl")
                            ? $page.url.toString().replace("/nl", "/en")
                            : ($page.url.pathname = `en${$page.url.pathname}`)}
                    >
                        <i class="bi bi-translate" />
                        <p class="text-xs font-semibold">EN</p>
                    </a>
                {/if}
            {/if}
        </div>
    </nav>

    {#if data.configuration.info_bar !== ""}
        <div
            style:background-color={data.configuration.brand_color_secondary}
            class="flex text-white flex-row w-full justify-center lg:text-base text-sm py-1"
        >
            {data.configuration.info_bar}
        </div>
    {/if}
    {#if showLinks}
        <div
            class="panel-contents"
            on:mouseleave={() => (showLinks = false)}
            style:background-color={data.configuration.brand_color_primary}
        >
            {#each data.configs as config}
                <a
                    href={config.hostnames[0]}
                    class="panel-link grid grid-cols-3 place-items-center gap-6"
                >
                    <img class="invert h-16 p-2" src={config.logo_url} alt="Logo" />
                    <div class="-space-y-1 col-span-2">
                        <p class="m-0 text-xl font-semibold">{config.name}</p>
                        <p class="m-0 opacity-75 text-sm">
                            {config.short_description.slice(0, 100)}{config.short_description
                                .length > 100
                                ? ".."
                                : ""}
                        </p>
                    </div>
                </a>
            {/each}
        </div>
    {/if}

    <div class="grow flex flex-col">
        <slot />
    </div>

    <footer class="bg-neutral-900 py-20 m-3 text-white">
        <div class="container grid grid-cols-3 gap-12">
            <div class="flex flex-col gap-2">
                <p class="font-semibold">{@html data.i18n.get("footer-social-media")}</p>
                <div class="w-full h-[2px] bg-white/20" />

                {#if data.configuration.facebook_url}
                    <a href={data.configuration.facebook_url}>
                        <div
                            class="flex gap-2 items-center hover:opacity-70 opacity-100 transition duration-150"
                        >
                            <i class="bi bi-facebook" />
                            <p class="">Facebook</p>
                        </div>
                    </a>
                {/if}

                {#if data.configuration.twitter_url}
                    <a href={data.configuration.twitter_url}>
                        <div
                            class="flex gap-2 items-center hover:opacity-70 opacity-100 transition duration-150"
                        >
                            <i class="bi bi-twitter" />
                            <p class="">Twitter</p>
                        </div>
                    </a>
                {/if}

                {#if data.configuration.instagram_url}
                    <a href={data.configuration.instagram_url}>
                        <div
                            class="flex gap-2 items-center hover:opacity-70 opacity-100 transition duration-150"
                        >
                            <i class="bi bi-instagram" />
                            <p class="">Instagram</p>
                        </div>
                    </a>
                {/if}

                {#if data.configuration.tiktok_url}
                    <a href={data.configuration.tiktok_url}>
                        <div
                            class="flex gap-2 items-center hover:opacity-70 opacity-100 transition duration-150"
                        >
                            <i class="bi bi-tiktok" />
                            <p class="">TikTok</p>
                        </div>
                    </a>
                {/if}

                {#if data.configuration.discord_url}
                    <a href={data.configuration.discord_url}>
                        <div
                            class="flex gap-2 items-center hover:opacity-70 opacity-100 transition duration-150"
                        >
                            <i class="bi bi-discord" />
                            <p class="">Discord</p>
                        </div>
                    </a>
                {/if}

                {#if data.configuration.linkedin_url}
                    <a href={data.configuration.linkedin_url}>
                        <div
                            class="flex gap-2 items-center hover:opacity-70 opacity-100 transition duration-150"
                        >
                            <i class="bi bi-linkedin" />
                            <p class="">LinkedIn</p>
                        </div>
                    </a>
                {/if}

                {#if data.configuration.github_url}
                    <a href={data.configuration.github_url}>
                        <div
                            class="flex gap-2 items-center hover:opacity-70 opacity-100 transition duration-150"
                        >
                            <i class="bi bi-github" />
                            <p class="">GitHub</p>
                        </div>
                    </a>
                {/if}
            </div>

            <div class="space-y-2">
                <p class="font-semibold">{@html data.i18n.get("footer-contact")}</p>
                <div class="w-full h-[2px] bg-white/20" />

                {#if data.configuration.adres}
                    <p class="">{data.configuration.adres}</p>
                {/if}

                {#if data.configuration.phone}
                    <p class="">{data.configuration.phone}</p>
                {/if}

                <p>{data.configuration.email_adres}</p>
            </div>

            <div class="space-y-2">
                <p class="font-semibold">{@html data.i18n.get("footer-varia")}</p>
                <div class="w-full h-[2px] bg-white/20" />
                <p class="">{@html data.i18n.get("footer-rss")}</p>
                <p class="">Ontdek jouw FSR</p>
                <p class="">{@html data.i18n.get("footer-complaints")}</p>
            </div>
        </div>
    </footer>
</div>

<style lang="postcss">
    .panel-contents {
        @apply grid grid-cols-3 p-8 gap-8 absolute top-14 shadow-lg border-t-[1px] border-neutral-100/25;
    }

    .panel-link {
        @apply rounded-md p-4 bg-neutral-100 w-full;
    }
</style>
