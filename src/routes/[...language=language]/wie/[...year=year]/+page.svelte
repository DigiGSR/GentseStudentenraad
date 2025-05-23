<script lang="ts">
    import { goto } from "$app/navigation";
    import PositionCard from "$lib/components/PositionCard.svelte";
    import type { PageData } from "./$types";
    import { selectedLanguage } from "$lib/Language";
    import { onMount } from "svelte";

    const sections: { id: string; name: string }[] = [];

    let selected = "2024";

    $: {
        data.groups.sort((a, b) =>
            a.name === "Dagelijks Bestuur" ? -1 : b.name === "Dagelijks Bestuur" ? 1 : 0,
        );
        for (const group of data.groups) {
            sections.push({ id: group.id.toString(), name: group.name });
        }
    }

    let isFixed = false;

    function handleScroll() {
        isFixed = window.scrollY > 600;
    }

    onMount(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });

    export let data: PageData;
    //make it so that the group with name "Dagelijks Bestuur" is always on top
</script>

{#if data.configuration.group_photo}
    <img
        src={data.configuration.group_photo}
        alt="Groepsfoto studentenraad"
        class="h-[50vh] object-cover w-full max-h-[500px]"
        style="object-position: 50% 30%"
    />
{/if}

<div
    class={`hidden ${isFixed ? "fixed top-0" : "absolute top-[600px]"} no-scrollbar left-3 bottom-0 right-0 xl:flex xl:pr-4 xl:pt-4 flex-col xl:max-w-[10rem] 2xl:max-w-[18rem] space-y-2 overflow-scroll`}
>
    <!-- Theoretically this should be sticky. but that didnt work. I think its some height fuckery. Oh well! -->

    <div class="flex flex-col space-y-2 text-xs max-w-fit">
        {#each sections as section}
            <a
                href="#{section.id}"
                class="text-black truncate text-opacity-70 hover:text-opacity-100">{section.name}</a
            >
        {/each}
    </div>
</div>

<div class="container flex text-lg xl:pl-12 -mt-32 translate-y-10 justify-start gap-4">
    <p>Bekijk historische data:</p>
    <!--TODO translation-->
    <select
        name="year"
        id="year"
        bind:value={selected}
        on:change={() => goto(`/nl/wie/${selected}`)}
    >
        {#each data.years as year}
            <option value={year}>{year}</option>
        {/each}
    </select>
</div>

{#if data.i18n[$selectedLanguage].get("who-about")}
    <div class="container xl:pl-12 pt-12 grid grid-cols-1 gap-x-8 gap-y-2">
        {@html data.i18n[$selectedLanguage].get("who-about")}
    </div>
{/if}

<div class="space-y-12 xl:pl-12 py-12">
    <!-- {#each data.groups.filter((e) => e.positions.length > 0) as group} NOTE: this filters out all of the groups without members. Is this the desired behaviour?-->
    {#each data.groups as group}
        <div class="odd:bg-neutral-100 container" id={group.id.toString()}>
            <div class="mb-6">
                <p class="font-bold text-3xl">{group.name}</p>
                {#if group.description}
                    <p class="opacity-90">{@html group.description}</p>
                {/if}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each group.positions as position}
                    <PositionCard {position} />
                {/each}
            </div>
        </div>
    {/each}
</div>

<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
