<script lang="ts">
    import NewsItemVertical from "$lib/components/NewsItemVertical.svelte";
    import SeparatedBanner from "$lib/components/SeparatedBanner.svelte";
    import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import * as FullCalendar from "fullcalendar";
    import iCalendarPlugin from "@fullcalendar/icalendar";
    import googleCalendarPlugin from "@fullcalendar/google-calendar";
    import { env } from "$env/dynamic/public";
    import { selectedLanguage } from "$lib/Language";
    //import { browser } from "$app/environment";

    export let data: PageData;

    console.log(data.calendars);

    let brandColor = data.configuration.brand_color_secondary;
    //let hostUrl = "";

    // Initialize the interactive calendar
    onMount(async () => {
        // if (browser) {
        //     hostUrl = window.location.host;
        // }

        if (data.configuration.calendar_section) {
            const calendarEl = document.getElementById("calendar");
            const calendar = new FullCalendar.Calendar(calendarEl, {
                googleCalendarApiKey: env.PUBLIC_GOOGLE_CALENDAR_API_KEY,
                initialView: "dayGridMonth",
                eventDisplay: "block",
                plugins: [iCalendarPlugin, googleCalendarPlugin],
                eventSources: data.configuration.calendars.map((cal) => {
                    return { googleCalendarId: cal };
                }),
                //todo ics support
                /*eventSources: data.calendars.map((cal) => {
                    return {
                        url: `${data.origin}/api/calendar/${cal.id}`,
                        format: "ics",
                    };
                }),*/

                eventTimeFormat: {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: false,
                },
                firstDay: 1,
                eventColor: data.configuration.brand_color_secondary,
            });
            calendar.render();
        }
    });
</script>

<main>
    <img
        src="https://unsplash.com/photos/G96J64iNrHo/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjYzNzczMzUy&force=true&w=1920"
        class="object-cover w-full h-[60vh] max-h-[500px]"
        alt="Scenery of Ghent"
        style="object-position: 50% 75%"
    />

    <div class="space-y-12 py-12">
        <div class="container md space-y-1">
            {@html data.i18n[$selectedLanguage].get("home-about")}
        </div>

        <div class="grid md:grid-cols-4 container w-full gap-4">
            {#each data.news.slice(0, 4) as news_item}
                <NewsItemVertical {news_item} />
            {/each}
        </div>

        <p class="container">{@html data.i18n[$selectedLanguage].get("home-stuver")}</p>

        {#if data.configuration.extra_banner_home}
            <SeparatedBanner
                title={data.i18n[$selectedLanguage].get("home-stuver-frame-title")}
                body={data.i18n[$selectedLanguage].get("home-stuver-frame-body")}
                imageUrl="https://www.ugent.be/img/dcom/logos/ugentflag.jpg"
                imageAlt="UGent Flag"
                css="bg-neutral-900 text-white"
                imagePosition="left"
            />

            <div class="container space-y-2">
                <div class="gap-10 grid md:grid-cols-2">
                    <div>
                        <p class="font-bold text-xl opacity-90">
                            {@html data.i18n[$selectedLanguage].get("home-paragraph-1-body")}
                        </p>
                        <p class="opacity-75">
                            {@html data.i18n[$selectedLanguage].get("home-paragraph-1-body")}
                        </p>
                    </div>
                    <div>
                        <p class="font-bold text-xl opacity-90">
                            {@html data.i18n[$selectedLanguage].get("home-paragraph-2-title")}
                        </p>
                        <p class="opacity-75">
                            {@html data.i18n[$selectedLanguage].get("home-paragraph-2-body")}
                        </p>
                    </div>
                </div>
            </div>
        {/if}
        <SeparatedBanner
            title={data.i18n[$selectedLanguage].get("home-projects-title")}
            body={data.i18n[$selectedLanguage].get("home-projects-body")}
            imageUrl="https://unsplash.com/photos/ewGMqs2tmJI/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MjJ8fHVuaXZlcnNpdHl8ZW58MHx8fHwxNjYzNzYzMzI3&force=true&w=1920"
            imageAlt="Classroom"
            css="text-white"
            color={data.configuration.brand_color_primary}
            imagePosition="right"
        />

        <p class="container">{@html data.i18n[$selectedLanguage].get("home-events")}</p>

        {#if data.configuration.calendars.length > 0}
            <div class="container">
                <div
                    style="--fc-button-bg-color: {brandColor}; --fc-today-button-bg-color: {brandColor};"
                    id="calendar"
                    class="max-h-full"
                />
                <div class="flex flex-row justify-center w-full mt-8">
                    <button
                        class="flex items-center px-4 py-2 rounded-l font-medium transition-colors duration-200 ease-in-out text-white shadow"
                        style="background-color: {brandColor};"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </button>
                    <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        {#each data.configuration.calendars as calendar, i}
                            <li>
                                <a
                                    class="hover:cursor-pointer hover:opacity-65"
                                    href={`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(calendar)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Voeg Kalender {i + 1} Toe
                                </a>
                            </li>
                        {/each}
                        <!-- {#if browser}
                            <li>
                                <a
                                    href={`webcal://${hostUrl}/api/calendar/combined.ics`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Apple/Outlook Calendar
                                </a>
                            </li>
                        {/if} -->
                    </ul>
                </div>
            </div>
        {/if}

        <p class="container">{@html data.i18n[$selectedLanguage].get("home-contact")}</p>
    </div>
</main>
