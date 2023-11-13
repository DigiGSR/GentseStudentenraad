<script lang="ts">
    import type { PageData } from "./$types";
    import Checkbox from "$lib/components/admin/Checkbox.svelte";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import { goto } from "$app/navigation";
    import TextField from "$lib/components/admin/TextField.svelte";

    export let data: PageData;

    async function put() {
        const res = await fetch(`/api/configuration/${data.configuration.id}`, {
            method: "PUT",
            body: JSON.stringify(data.configuration),
            headers: {
                "content-type": "application/json",
            },
        });

        if (res.status === 200) {
            goto("/admin");
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }
</script>

<div class="space-y-6">
    <Checkbox
        bind:value={data.configuration.active}
        label="Website is publiek"
        description={null}
    />
    <Checkbox
        bind:value={data.configuration.news_section}
        label="Nieuwssectie"
        description={null}
    />
    <Checkbox
        bind:value={data.configuration.feedback_section}
        label="Vakfeedback"
        description={null}
    />
    <Checkbox
        bind:value={data.configuration.project_section}
        label="Projectensectie"
        description={null}
    />
    <Checkbox bind:value={data.configuration.who_section} label="Wie-sectie" description={null} />
    <Checkbox bind:value={data.configuration.faq_section} label="FAQ-sectie" description={null} />
    <Checkbox
        bind:value={data.configuration.elections_section}
        label="Verkiezingensectie"
        description={null}
    />
    <Checkbox
        bind:value={data.configuration.opinions_section}
        label="Standpuntensectie"
        description={null}
    />
    <Checkbox
        bind:value={data.configuration.calendar_section}
        label="Kalendersectie"
        description={null}
    />
    <Checkbox bind:value={data.configuration.i18n} label="Vertalingen" description={null} />
    <Checkbox bind:value={data.configuration.info_bar} label="Info bar" description={null} />

    <div>
        <div class="flex flex-row items-start">
            <p class="text-[18px] opacity-50 font-semibold uppercase">Kalenders</p>
            <button
                on:click={() => {
                    data.configuration.calendars.push("");
                    data.configuration.calendars = data.configuration.calendars; //yes this is actual svelte syntax that is needed
                }}
                class="text-[18px] ml-1 bi bi-plus-circle opacity-50 hover:opacity-80 hover:cursor-pointer transition duration-150"
            />
        </div>

        {#if data.configuration.calendar_section}
            {#each data.configuration.calendars as calendar, index (calendar)}
                <div class="flex flex-row items-start">
                    <button
                        on:click={() => {
                            data.configuration.calendars.splice(index, 1);
                            data.configuration.calendars = data.configuration.calendars; //yes this is actual svelte syntax that is needed
                        }}
                        class="text-[12px] mr-1 bi bi-dash-circle opacity-50 hover:opacity-80 hover:cursor-pointer transition duration-150"
                    />
                    <TextField
                        placeholder={calendar}
                        bind:value={data.configuration.calendars[index]}
                        description={`kalender ${index + 1}`}
                    />
                </div>
            {/each}
        {/if}
    </div>
    <ActionButton action={put} />
</div>
