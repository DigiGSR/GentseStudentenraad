<script lang="ts">
    import Tag from "$lib/components/Tag.svelte";
    import type { PageData } from "./$types";
    export let data: PageData;
</script>

<template>
    <div class="flex flex-col px-6 space-y-4 py-12 items-start">
        <div class="text-5xl font-serif font-bold">Verslagen</div>
        <p>Hier vind je de verslagen terug van de verschillende werkgroepen binnenin de GSR</p>
        <div class="space-y-4 w-full">
            {#each data.reports as report}
                <div class="bg-white grid grid-cols-3 items-center rounded-md overflow-clip">
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
