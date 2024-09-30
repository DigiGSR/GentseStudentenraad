<script lang="ts">
    import type { PageData } from "./$types";
    import TextField from "$lib/components/admin/TextField.svelte";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import { goto } from "$app/navigation";
    import { Prisma } from "@prisma/client";
    import Uploader from "$lib/components/admin/Uploader.svelte";

    export let data: PageData;
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
    let submitUploader: () => Promise<void>;
</script>

<svelte:head>
    <style>
        :root {
            @apply bg-neutral-100;
        }
    </style>
</svelte:head>

<div class="space-y-6">
    <TextField
        placeholder={"Verslag algemene vergadering 4 22-23"}
        description="Naam"
        bind:value={newReport.name}
    />

    <TextField
        placeholder={"Algemene vergadering"}
        description="Werkgroep"
        bind:value={newReport.workgroup}
    />

    <Uploader bind:submitUploader type="file" bind:source={newReport.url} />

    <!--todo, make this an image upload-->

    <ActionButton
        action={async () => {
            await submitUploader();
            postReport();
        }}
    />
</div>

<style lang="postcss">
    select {
        appearance: none;

        @apply w-full bg-white py-2 px-4 border-neutral-200 border-[1px];
    }
</style>
