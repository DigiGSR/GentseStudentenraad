<script lang="ts">
    import type { PageData } from "./$types";
    import TextField from "$lib/components/admin/TextField.svelte";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import { goto } from "$app/navigation";
    import Uploader from "$lib/components/admin/Uploader.svelte";

    export let data: PageData;

    async function postRule() {
        const res = await fetch(`/api/rules/${data.rule.id}`, {
            method: "PUT",
            body: JSON.stringify(data.rule),
            headers: {
                "content-type": "application/json",
            },
        });

        if (res.status === 200) {
            goto("/admin/rules");
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }

    async function remove() {
        const res = await fetch(`/api/rules/${data.rule.id}`, {
            method: "delete",
        });

        if (res.status === 200) {
            goto("/admin/rules");
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
    <TextField bind:value={data.rule.title} description="Titel" />
    <TextField bind:value={data.rule.description} description="Beschrijving" />
    <Uploader bind:submitUploader type="file" bind:source={data.rule.link} description="Link" />
    <ActionButton
        action={async () => {
            await submitUploader();
            postRule();
        }}
        {remove}
    />
</div>
