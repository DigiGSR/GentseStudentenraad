<script lang="ts">
    import type { PageData } from "./$types";
    import NewButton from "$lib/components/admin/NewButton.svelte";
    import { Report } from "@prisma/client";
    export let data: PageData;

    async function remove(report: Report) {
        const res = await fetch(`/api/report/${report.id}`, {
            method: "delete",
        });

        if (res.status === 200) {
            location.reload();
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }
</script>

<div class="space-y-4">
    <table class="table-auto text-left w-full">
        <thead>
            <tr>
                <th>
                    <div class="flex items-center">
                        <p>Naam</p>
                        <div class="grow" />
                        <i class="bi bi-chevron-down" />
                        <!--TODO (low priority) sorting with chevrons-->
                    </div>
                </th>
                <th>
                    <div class="flex items-center">
                        <p>Link</p>
                        <div class="grow" />
                        <i class="bi bi-chevron-down" />
                        <!--TODO (low priority) sorting with chevrons-->
                    </div>
                </th>
                <th>
                    <div class="flex items-center">
                        <p>Werkgroep</p>
                        <div class="grow" />
                        <i class="bi bi-chevron-down" />
                        <!--TODO (low priority) sorting with chevrons-->
                    </div>
                </th>
                <th />
                <th />
            </tr>
        </thead>

        <tbody>
            {#each data.reports as report}
                <tr>
                    <td>
                        <p>{report.name}</p>
                    </td>
                    <td class="truncate max-w-[8rem] grow">{report.url}</td>
                    <!--no idea why I need max width here to get desired behavior but I'll take it, 8rem is arbitrary-->
                    <td>
                        <p>{report.workgroup}</p>
                    </td>
                    <td>
                        <a href="/admin/reports/{report.id}">
                            <i class="bi bi-pencil-square" />
                        </a>
                    </td>
                    <td>
                        <button on:click={() => remove(report)}>
                            <i class="bi bi-trash3-fill" />
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
    <NewButton href="/admin/reports/create" />
</div>

<style lang="sass">
    th
        @apply text-left

    tbody
        @apply bg-white text-sm font-medium

    th, td
        @apply border border-neutral-200 px-3 py-2
</style>
