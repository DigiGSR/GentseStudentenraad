<script lang="ts">
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";

    import Quill from "$lib/components/admin/Quill.svelte";

    export let data: PageData;

    async function put() {
        const res = await fetch(`/api/i18n/${data.text.id}`, {
            method: "PUT",
            body: JSON.stringify(data.text),
            headers: {
                "content-type": "application/json",
            },
        });

        if (res.status === 200) {
            goto("/admin/i18n");
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }
</script>

<div class="container space-y-4">
    <div>
        <p class="text-[12px] opacity-50 font-semibold uppercase">Type</p>
    </div>
    <div>
        <p class="text-[12px] opacity-50 font-semibold uppercase">Identificatie</p>
        <select bind:value={data.text.key} class="px-3 py-2">
            {#each data.missingKeys as currKey}
                <option>{currKey}</option>
            {/each}
        </select>
    </div>
    <Quill bind:value={data.text.dutch} description="Nederlands" />
    <Quill bind:value={data.text.english} description="Engels" />
    <ActionButton action={put} />
</div>

<style lang="sass">

</style>
