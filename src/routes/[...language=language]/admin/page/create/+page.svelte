<script lang="ts">
    import type { PageData } from "./$types";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import TextField from "$lib/components/admin/TextField.svelte";
    import { goto } from "$app/navigation";
    import Quill from "$lib/components/admin/Quill.svelte";

    async function post() {
        const res = await fetch(`/api/page/`, {
            method: "POST",
            body: JSON.stringify(data.page),
            headers: {
                "content-type": "application/json",
            },
        });

        if (res.status === 200) {
            await goto(`/admin/page/`);
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }

    export let data: PageData;
</script>

<svelte:head>
    <style>
        :root {
            @apply bg-neutral-100;
        }
    </style>
</svelte:head>

<div class="space-y-6">
    <TextField bind:value={data.page.slug} description="Slug" />
    <TextField bind:value={data.page.nav_name_dutch} description="Titel (NL)" />
    <TextField bind:value={data.page.nav_name_english} description="Titel (EN)" />
    <Quill bind:value={data.page.content_dutch} description="Inhoud (NL)" />
    <Quill bind:value={data.page.content_english} description="Inhoud (EN)" />

    <ActionButton action={post} />
</div>
