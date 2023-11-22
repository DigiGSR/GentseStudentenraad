<script lang="ts">
    import type { PageData } from "./$types";
    import NewButton from "$lib/components/admin/NewButton.svelte";
    import { Report } from "@prisma/client";
    export let data: PageData;

    /*async function remove(person: Report) {
        const res = await fetch(`/api/person/${person.id}`, {
            method: "delete",
        });

        if (res.status === 200) {
            location.reload();
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }*/
</script>

<div class="space-y-4">
    <NewButton href="/admin/people/create" />
</div>

<style lang="sass">
    th
        @apply text-left

    tbody
        @apply bg-white text-sm font-medium

    th, td
        @apply border border-neutral-200 px-3 py-2
</style>
