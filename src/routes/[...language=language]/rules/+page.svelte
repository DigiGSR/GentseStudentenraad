<script lang="ts">
    import Tag from "$lib/components/Tag.svelte";
    import type { PageData } from "./$types";
    export let data: PageData;
    import { selectedLanguage } from "$lib/Language";
</script>

<template>
    <div class="flex flex-col px-6 space-y-4 py-12 items-start">
        <div class="flex flex-col md:flex-row justify-between w-full">
            <div class="text-5xl font-serif font-bold">Reglementen</div>
        </div>

        <p>{@html data.i18n[$selectedLanguage].get("hier-vind-je-reglementen")}</p>
        <div class="space-y-4 w-full">
            {#each data.rules as rule}
                <div class="bg-white grid items-center rounded-md overflow-clip">
                    <div class="p-6 col-span-2 space-y-1">
                        <p class="text-2xl font-semibold">{rule.title}</p>
                        <p class="opacity-75">{rule.description}</p>
                        <div class="flex gap-4 pt-2">
                            <Tag link={rule.link} value="Download" icon="filetype-pdf" />
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</template>
