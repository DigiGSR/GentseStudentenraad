<script lang="ts">
    //import Tag from "$lib/components/Tag.svelte";
    import type { PageData } from "./$types";
    export let data: PageData;
    import { selectedLanguage } from "$lib/Language";
</script>

<template>
    <div class="container space-y-4 py-12">
        <div class="text-5xl font-serif font-bold">
            {@html data.i18n[$selectedLanguage].get("projecten-titel")}
        </div>
        <p>
            {@html data.i18n[$selectedLanguage].get("projecten-tekstje")}
        </p>
        <div class="space-y-4">
            {#each data.projects as project}
                <div class="bg-white grid grid-cols-3 items-center rounded-md overflow-clip">
                    <img
                        class="aspect-square object-contain w-full p-6"
                        src={project.image}
                        alt="Project Logo"
                    />
                    <div class="p-6 col-span-2 space-y-1">
                        <p class="text-2xl font-semibold">{project.title}</p>
                        <p>{project.about}</p>
                        <!--<div class="flex gap-4 pt-2">-->
                        <!--<Tag link="/" value="Email" icon="mailbox" />-->
                        <!--<Tag link="/" value="Website" icon="globe" />-->
                        <!--</div>-->
                    </div>
                </div>
            {/each}
        </div>
    </div>
</template>
