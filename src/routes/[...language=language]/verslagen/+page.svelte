<script lang="ts">
    import Tag from "$lib/components/Tag.svelte";
    import type { PageData } from "./$types";
    export let data: PageData;

    let currentReports = [...data.reports];

    let selectedWorkGroup;

    $: currentReports = data.reports.filter((report) => report.workgroup === selectedWorkGroup);

    let workgroups = [];
    for (let currReport of currentReports) {
        if (!workgroups.includes(currReport.workgroup)) {
            workgroups.push(currReport.workgroup);
        }
    }
</script>

<template>
    <div class="flex flex-col px-6 space-y-4 py-12 items-start">
        <div class="flex flex-col md:flex-row justify-between w-full">
            <div class="text-5xl font-serif font-bold">Verslagen</div>
            <div class="flex translate-y-[1rem] gap-4 pb-12">
                <!--todo hacky translate-->
                <p>{@html data.i18n.get("filter-op-werkgroep")}</p>
                <select bind:value={selectedWorkGroup}>
                    {#each workgroups as currWorkgroup}
                        <option value={currWorkgroup}>{currWorkgroup}</option>
                    {/each}
                </select>
            </div>
        </div>

        <p>{@html data.i18n.get("hier-vind-je-verslagen")}</p>
        <div class="space-y-4 w-full">
            {#if currentReports.length < 1}
                <p>
                    {@html data.i18n.get("werkgroep-geen-verslagen")}Deze werkgroep heeft nog geen
                    verslagen...
                </p>
            {/if}
            {#each currentReports as report}
                <div class="bg-white grid items-center rounded-md overflow-clip">
                    <div class="p-6 col-span-2 space-y-1">
                        <p class="text-2xl font-semibold">{report.name}</p>
                        <p class="opacity-75">{report.workgroup}</p>
                        <div class="flex gap-4 pt-2">
                            <Tag link={report.url} value="Download" icon="filetype-pdf" />
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</template>
