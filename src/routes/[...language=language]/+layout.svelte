<script lang="ts">
    import "../../app.scss";
    import { page } from "$app/stores";
    import type { LayoutData } from "./$types";
    import { env } from "$env/dynamic/public";
    import Dropdown from "$lib/components/Dropdown.svelte";
    import OrganizationsDropdown from "$lib/components/OrganizationsDropdown.svelte";
    let showLinks = false;
    export let data: LayoutData;

    import { selectedLanguage } from "$lib/Language";

    export async function toggleLanguage() {
        //const oldSelectedLanguage = $selectedLanguage;
        selectedLanguage.update((language) => (language === "nl" ? "en" : "nl"));
        /*await new Promise((resolve) => setTimeout(resolve, 200)); //todo maybe unnecessary
        window.location.href = $page.url
            .toString()
            .replace(`/${oldSelectedLanguage}`, `/${$selectedLanguage}`);*/
    }

    console.log(data.admin);

    let navBarHeight: number;

    let parentWidth = Array(50).fill(0);
    let navelemheight = 0;

    let navbarRoutes = [...data.configuration.navbar];

    if (data.user || env.PUBLIC_ENV == "dev") {
        //verslagen is CAS only, todo verslagen route zelf ook checken voor login
        navbarRoutes.push({
            name: { nl: "Verslagen", en: "Reports" },
            route: "/nl/verslagen",
            hierarchyRoute: false,
        });
    }

    let showMenu = false;

    function toggleNavbar() {
        showMenu = !showMenu;
    }
</script>

<div class="flex flex-col w-full min-h-[100vh]">
    <nav
        style:background-color={data.configuration.brand_color_primary}
        class="text-white lg:text-sm text-xs shadow-md p-3"
    >
        <div
            bind:clientHeight={navBarHeight}
            class="flex items-center gap-1 justify-between md:justify-normal flex-row"
        >
            <a href="/{$selectedLanguage}/nl" class="flex flex-row md:hidden">
                <img src={data.configuration.logo_url} class="h-8" alt="Logo" />
            </a>

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div on:click={toggleNavbar} class="flex md:hidden text-white">
                <button
                    type="button"
                    class="text-white hover:text-gray-400 focus:outline-none focus:text-gray-400"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>
            </div>
        </div>

        <div
            class="flex-col h-max mt-8 space-y-4 md:flex md:space-y-0 md:flex-row md:items-center md:space-x-10 md:mt-0 {showMenu
                ? 'flex'
                : 'hidden'}"
        >
            <a href="/{$selectedLanguage}" class="flex-row hidden md:flex">
                <img src={data.configuration.logo_url} class="h-8" alt="Logo" />
            </a>
            {#each navbarRoutes as route, i}
                {#if route.hierarchyRoute === true}
                    <Dropdown
                        text={route.name[$selectedLanguage]}
                        bind:parentWidth={parentWidth[i]}
                        bind:navElemHeight={navelemheight}
                        bgColor={data.configuration.brand_color_primary}
                    >
                        {#each route.childRoutes as childRoute}
                            <a
                                class="hover:opacity-70 opacity-100 transition duration-150 py-1 min-w-full"
                                href={`/${$selectedLanguage}/${childRoute.route}`}
                                >{childRoute.name[$selectedLanguage]}</a
                            >
                        {/each}
                    </Dropdown>
                {:else}
                    <a
                        class="pb-1 hover:opacity-70 opacity-100 transition duration-150"
                        href={`/${$selectedLanguage}/${route.route}`}
                        >{route.name[$selectedLanguage]}</a
                    >
                {/if}
            {/each}

            {#if data.configuration.organization == "GSR"}
                <OrganizationsDropdown bgColor={data.configuration.brand_color_primary}>
                    <a
                        href="http://cultour.be/"
                        class="flex flex-col justify-center items-center hover:cursor-pointer hover:opacity-70 opacity-100 transition duration-150"
                    >
                        <div
                            class="w-16 bg-center bg-contain bg-no-repeat h-16"
                            style="background-image: url(/img/cultour.png)"
                        />
                        <p class="mt-1">Cultour</p>
                    </a>
                    <a
                        href="https://durfdoen.be/"
                        class="flex flex-col justify-center items-center hover:cursor-pointer hover:opacity-70 opacity-100 transition duration-150"
                    >
                        <div
                            class="w-16 bg-center bg-contain bg-no-repeat h-16"
                            style="background-image: url(/img/durfdoen.png)"
                        />
                        <p class="mt-1">Durfdoen</p>
                    </a>
                    <a
                        href="https://deelplatform.ugent.be/"
                        class="flex flex-col justify-center items-center hover:cursor-pointer hover:opacity-70 opacity-100 transition duration-150"
                    >
                        <div
                            class="w-16 bg-center bg-contain bg-no-repeat h-16"
                            style="background-image: url(/img/deelplatform.png)"
                        />
                        <p class="mt-1">Deelplatform</p>
                    </a>
                </OrganizationsDropdown>
            {/if}

            <div class="grow lg:flex hidden" />

            <!--bi class is bootstrap icons-->
            <div class="hidden 2xl:flex flex-row gap-x-4">
                {#if data.configuration.facebook_url}
                    <a href={data.configuration.facebook_url}>
                        <i
                            class="bi bi-facebook hover:opacity-70 opacity-100 transition duration-150"
                        />
                    </a>
                {/if}

                {#if data.configuration.twitter_url}
                    <a href={data.configuration.twitter_url}>
                        <i
                            class="bi bi-twitter-x hover:opacity-70 opacity-100 transition duration-150"
                        />
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
                        <i
                            class="bi bi-tiktok hover:opacity-70 opacity-100 transition duration-150"
                        />
                    </a>
                {/if}

                {#if data.configuration.discord_url}
                    <a href={data.configuration.discord_url}>
                        <i
                            class="bi bi-discord hover:opacity-70 opacity-100 transition duration-150"
                        />
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
                        <i
                            class="bi bi-github hover:opacity-70 opacity-100 transition duration-150"
                        />
                    </a>
                {/if}
            </div>

            <div />

            <a
                class="flex md:self-start self-center items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full justify-center max-w-fit"
                href={data.user
                    ? data.admin
                        ? "/admin"
                        : "/"
                    : "https://login.ugent.be/login?service=" + $page.url.origin}
            >
                {#if data.user}
                    <i class="bi bi-gear" />
                {:else}
                    <i class="bi bi-person" />
                {/if}
                <p class="text-xs font-semibold">
                    {data.user ? data.user.username : "Inloggen"}
                </p>
            </a>

            {#if $selectedLanguage === "nl"}
                <button
                    class="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full"
                    on:click={toggleLanguage}
                >
                    <i
                        class="bi bi-translate hover:opacity-70 opacity-100 transition duration-150"
                    />
                    <p class="text-xs font-semibold">NL</p>
                </button>
            {:else}
                <button
                    class="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full"
                    on:click={toggleLanguage}
                >
                    <i class="bi bi-translate" />
                    <p class="text-xs font-semibold">EN</p>
                </button>
            {/if}
        </div>
    </nav>

    {#if data.configuration.info_bar}
        {#if data.configuration.info_bar_link === ""}
            <div
                style:background-color={data.configuration.brand_color_secondary}
                class="flex text-white flex-row w-full justify-center lg:text-base text-sm py-1"
            >
                {data.configuration.info_bar_text}
            </div>
        {:else}
            <div
                style:background-color={data.configuration.brand_color_secondary}
                class="flex text-white flex-row w-full justify-center lg:text-base text-sm py-1"
            >
                <a class="hover:underline" href={data.configuration.info_bar_link}
                    >{data.configuration.info_bar_text}</a
                >
            </div>
        {/if}
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

    <footer class="bg-neutral-900 py-20 text-white">
        <div class="container grid md:grid-cols-2 gap-12">
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
                            <i class="bi bi-twitter-x" />
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

                <div>
                    <a
                        class="hover:cursor-pointer hover:underline"
                        href="mailto:{data.configuration.email_adres}"
                        >{data.configuration.email_adres}</a
                    >
                </div>
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
