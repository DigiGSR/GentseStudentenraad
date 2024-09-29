<script lang="ts">
    import type { PageData } from "./$types";
    import TextField from "$lib/components/admin/TextField.svelte";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import { goto } from "$app/navigation";
    import { Report } from "@prisma/client";
    import Uploader from "$lib/components/admin/Uploader.svelte";

    export let data: PageData;

    async function putReport() {
        const res = await fetch(`/api/report/${data.report.id}`, {
            method: "PUT",
            body: JSON.stringify(data.report),
            headers: {
                "content-type": "application/json",
            },
        });

        if (res.status === 200) {
            goto("/admin/reports");
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }

    async function remove(report: Report) {
        const res = await fetch(`/api/report/${report.id}`, {
            method: "delete",
        });

        if (res.status === 200) {
            goto("/admin/reports");
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
        bind:value={data.report.name}
    />

    <Uploader bind:submitUploader type="file" description="Verslag" bind:source={data.report.url} />

    <TextField
        placeholder={"Algemene vergadering"}
        description="Werkgroep"
        bind:value={data.report.workgroup}
    />

    <!--todo, make this an image upload-->

    <ActionButton
        action={async () => {
            await submitUploader();
            putReport();
        }}
        remove={() => remove(data.report)}
    />
</div>
