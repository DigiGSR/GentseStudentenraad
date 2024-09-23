<script lang="ts">
    import type { PageData } from "./$types";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import TextField from "$lib/components/admin/TextField.svelte";
    import Quill from "$lib/components/admin/Quill.svelte";
    import { goto } from "$app/navigation";

    async function put() {
        const res = await fetch(`/api/page/${data.page.id}`, {
            method: "PUT",
            body: JSON.stringify(data.page),
            headers: {
                "content-type": "application/json",
            },
        });

        if (res.status === 200) {
            await goto("/admin/page/");
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }

    async function remove() {
        const res = await fetch(`/api/page/${data.page.id}`, {
            method: "DELETE",
        });

        if (res.status === 200) {
            await goto("/admin/page");
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

    <ActionButton action={put} {remove} />
</div>
