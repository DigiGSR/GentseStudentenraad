<script lang="ts">
    import ColorPicker from "svelte-awesome-color-picker";
    import type { PageData } from "./$types";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import { goto } from "$app/navigation";
    import TextField from "$lib/components/admin/TextField.svelte";

    export let data: PageData;

    async function put() {
        const res = await fetch(`/api/configuration/${data.configuration.id}`, {
            method: "PUT",
            body: JSON.stringify(data.configuration),
            headers: {
                "content-type": "application/json",
            },
        });

        if (res.status === 200) {
            goto("/admin");
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
    <div class="w-fit flex gap-2 items-center">
        <ColorPicker bind:hex={data.configuration.brand_color_primary} label="" />
        <p>Primaire kleur: {data.configuration.brand_color_primary}</p>
    </div>

    <div class="w-fit flex gap-2 items-center">
        <ColorPicker bind:hex={data.configuration.brand_color_secondary} label="" />
        <p>Secundaire kleur: {data.configuration.brand_color_secondary}</p>
    </div>

    <div>
        <TextField
            placeholder="We wensen jullie veel success met de examens!"
            bind:value={data.configuration.info_bar_text}
            description="Info bar tekst"
        />
    </div>

    <div>
        <TextField
            placeholder="https://example.com"
            bind:value={data.configuration.info_bar_link}
            description="Info bar Link"
        />
    </div>

    <ActionButton action={put} />
</div>
