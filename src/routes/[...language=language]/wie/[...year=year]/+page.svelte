<script lang="ts">
    import "chance";
    import { goto } from "$app/navigation";
    import PositionCard from "$lib/components/PositionCard.svelte";
    import type { PageData } from "./$types";

    let selected = "2022";

    const sections: { id: string; name: string }[] = [];

    $: {
        for (const group of data.groups) {
            sections.push({ id: group.id.toString(), name: group.name });
        }
    }

    export let data: PageData;
</script>

{#if data.configuration.group_photo}
    <img
        src={data.configuration.group_photo}
        alt="Groepsfoto studentenraad"
        class="h-[50vh] object-cover w-full max-h-[500px]"
        style="object-position: 50% 30%"
    />
{/if}

<div class="hidden absolute top-[600px] left-10 md:flex flex-col max-w-fit space-y-2">
    <p class="text-sm text-black text-opacity-60">Raden & Comissies</p>
    <div class="flex flex-col space-y-2 pl-4">
        {#each sections as section}
            <a href="#{section.id}" class="text-black text-opacity-70 hover:text-opacity-100"
                >{section.name}</a
            >
        {/each}
    </div>
</div>

<div class="container flex text-lg -mt-32 translate-y-10 justify-start md:justify-end gap-4">
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

{#if data.i18n.get("who-about")}
    <div class="container md pt-10 md:pt-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        {@html data.i18n.get("who-about")}
    </div>
{/if}

<div class="space-y-12 py-12">
    <!-- {#each data.groups.filter((e) => e.positions.length > 0) as group} NOTE: this filters out all of the groups without members. Is this the desired behaviour?-->
    {#each data.groups as group}
        <div class="odd:bg-neutral-100" id={group.id.toString()}>
            <div class="container grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1 md:col-span-2">
                    <p class="font-bold text-3xl">{group.name}</p>
                    {#if group.description}
                        <p class="opacity-90">{@html group.description}</p>
                    {/if}
                </div>
                <div class="space-y-6">
                    {#each group.positions as position, j}
                        {#if j % 2 === 0}
                            <PositionCard {position} />
                        {/if}
                    {/each}
                </div>
                <div class="space-y-6">
                    {#each group.positions as position, j}
                        {#if j % 2 === 1}
                            <PositionCard {position} />
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    {/each}
</div>
