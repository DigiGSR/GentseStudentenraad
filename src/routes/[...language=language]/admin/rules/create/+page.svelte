<script lang="ts">
    import type { PageData } from "./$types";
    import TextField from "$lib/components/admin/TextField.svelte";
    import Uploader from "$lib/components/admin/Uploader.svelte";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import { goto } from "$app/navigation";
    import { Prisma } from "@prisma/client";

    export let data: PageData;
    export let newRule: Prisma.RulesUncheckedCreateInput = {
        title: "",
        description: "",
        link: "",
        organization: data.configuration.organization,
    };
    async function postRule() {
        const res = await fetch(`/api/rules/`, {
            method: "POST",
            body: JSON.stringify(newRule),
            headers: {
                "content-type": "application/json",
            },
        });

        if (res.status === 200) {
            await goto(`/admin/rules`);
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
    <TextField bind:value={newRule.title} description="Titel" />
    <TextField bind:value={newRule.description} description="Beschrijving" />
    <Uploader bind:submitUploader type="file" bind:source={newRule.link} description="Link" />
    <ActionButton
        action={async () => {
            await submitUploader();
            postRule();
        }}
    />
</div>

<style lang="postcss">
    select {
        appearance: none;

        @apply w-full bg-white py-2 px-4 border-neutral-200 border-[1px];
    }
</style>
