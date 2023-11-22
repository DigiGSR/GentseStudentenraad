<script lang="ts">
    import type { PageData } from "./$types";
    import TextField from "$lib/components/admin/TextField.svelte";
    import ImageUploader from "$lib/components/admin/ImageUploader.svelte";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import { goto } from "$app/navigation";
    import { Prisma } from "@prisma/client";

    export let data: PageData;
    export let description =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";
    export let newReport: Prisma.ReportUncheckedCreateInput = {
        name: "",
        workgroup: "",
        url: "",
        organization: data.configuration.organization,
    };
    async function postReport() {
        const res = await fetch(`/api/report/`, {
            method: "POST",
            body: JSON.stringify(newReport),
            headers: {
                "content-type": "application/json",
            },
        });

        const user = await res.json();

        if (res.status === 200) {
            await goto(`/admin/reports/${user.id}`);
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }
</script>

<svelte:head>
    <style>
        :root {
            @apply bg-neutral-100;
        }
    </style>
</svelte:head>

<div class="space-y-6">
    <TextField description="Naam" bind:value={newReport.name} />

    <TextField description="Werkgroep" bind:value={newReport.workgroup} />

    <TextField description="Url" bind:value={newReport.url} />
    <!--todo, make this an image upload-->

    <ActionButton action={postReport} />
</div>

<style lang="postcss">
    select {
        appearance: none;

        @apply w-full bg-white py-2 px-4 border-neutral-200 border-[1px];
    }
</style>
