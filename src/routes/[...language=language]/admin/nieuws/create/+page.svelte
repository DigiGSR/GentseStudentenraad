<script lang="ts">
    import type { PageData } from "./$types";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import TextField from "$lib/components/admin/TextField.svelte";
    import LongTextField from "$lib/components/admin/LongTextField.svelte";
    import Checkbox from "$lib/components/admin/Checkbox.svelte";
    import DatePicker from "$lib/components/admin/DatePicker.svelte";
    import Uploader from "$lib/components/admin/Uploader.svelte";
    import { goto } from "$app/navigation";
    import { News } from "@prisma/client";

    async function post() {
        const res = await fetch(`/api/news/`, {
            method: "POST",
            body: JSON.stringify(data.news_item),
            headers: {
                "content-type": "application/json",
            },
        });

        const news: News = await res.json();

        if (res.status === 200) {
            await goto(`/admin/nieuws/${news.id}`);
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
    <TextField bind:value={data.news_item.title} description="Titel" />

    <TextField bind:value={data.news_item.synopsis} description="Synopsis" />

    <Uploader type="image" description="Coverfoto" source={data.news_item.banner_image} />

    <LongTextField bind:value={data.news_item.content} description="Inhoud" />

    <TextField bind:value={data.news_item.author} description="Auteur" />

    <DatePicker description="Publicatiedatum" bind:value={data.news_item.published_at} />

    <Checkbox label="Publiek" bind:value={data.news_item.published} description="Opties" />

    <ActionButton action={post} />
</div>
