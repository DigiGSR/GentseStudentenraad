<script lang="ts">
    import NewsItemVertical from "$lib/components/NewsItemVertical.svelte";
    import SeparatedBanner from "$lib/components/SeparatedBanner.svelte";
    import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import * as FullCalendar from "fullcalendar";
    import iCalendarPlugin from "@fullcalendar/icalendar";
    import googleCalendarPlugin from "@fullcalendar/google-calendar";
    import { env } from "$env/dynamic/public";

    export let data: PageData;

    let brandColor = data.configuration.brand_color_secondary;
    // Initialize the interactive calendar
    onMount(async () => {
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
            {@html data.i18n.get("home-about")}
        </div>

        <div class="grid md:grid-cols-4 container w-full gap-4">
            {#each data.news.slice(0, 4) as news_item}
                <NewsItemVertical {news_item} />
            {/each}
        </div>

        <p class="container">{@html data.i18n.get("home-stuver")}</p>

        <SeparatedBanner
            title={data.i18n.get("home-stuver-frame-title")}
            body={data.i18n.get("home-stuver-frame-body")}
            imageUrl="https://www.ugent.be/img/dcom/logos/ugentflag.jpg"
            imageAlt="UGent Flag"
            css="bg-neutral-900 text-white"
            imagePosition="left"
        />

        <div class="container space-y-2">
            <div class="gap-10 grid md:grid-cols-2">
                <div>
                    <p class="font-bold text-xl opacity-90">
                        {@html data.i18n.get("home-paragraph-1-body")}
                    </p>
                    <p class="opacity-75">{@html data.i18n.get("home-paragraph-1-body")}</p>
                </div>
                <div>
                    <p class="font-bold text-xl opacity-90">
                        {@html data.i18n.get("home-paragraph-2-title")}
                    </p>
                    <p class="opacity-75">{@html data.i18n.get("home-paragraph-2-body")}</p>
                </div>
            </div>
        </div>

        <SeparatedBanner
            title={data.i18n.get("home-projects-title")}
            body={data.i18n.get("home-projects-body")}
            imageUrl="https://unsplash.com/photos/ewGMqs2tmJI/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MjJ8fHVuaXZlcnNpdHl8ZW58MHx8fHwxNjYzNzYzMzI3&force=true&w=1920"
            imageAlt="Classroom"
            css="text-white"
            color={data.configuration.brand_color_primary}
            imagePosition="right"
        />

        <p class="container">{@html data.i18n.get("home-events")}</p>

        {#if data.calendars.length > 0}
            <div class="container">
                <div
                    style="--fc-button-bg-color: {brandColor}; --fc-today-button-bg-color: {brandColor};"
                    id="calendar"
                    class="max-h-full"
                />
            </div>
        {/if}

        <p class="container">{@html data.i18n.get("home-contact")}</p>
    </div>
</main>
