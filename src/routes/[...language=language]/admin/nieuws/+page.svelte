<script lang="ts">
    import type { PageData } from "./$types";
    import { News } from "@prisma/client";
    import NewButton from "$lib/components/admin/NewButton.svelte";

    export let data: PageData;

    let sortColumn: "title" | "author" | "published_at" = "published_at";
    let sortDirection: "asc" | "desc" = "desc";

    let titleSortedToggle = true;
    let authorSortedToggle = true;
    let publishedSortedToggle = true;

    $: sortedNews = [...data.news].sort((a, b) => {
        let valueA, valueB;
        switch (sortColumn) {
            case "title":
                valueA = a.title.toLowerCase();
                valueB = b.title.toLowerCase();
                break;
            case "author":
                valueA = (a.author || "").toLowerCase();
                valueB = (b.author || "").toLowerCase();
                break;
            case "published_at":
                valueA = new Date(a.published_at).getTime();
                valueB = new Date(b.published_at).getTime();
                break;
            default:
                valueA = new Date(a.published_at).getTime();
                valueB = new Date(b.published_at).getTime();
        }

        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    function sortTable(column: "title" | "author" | "published_at") {
        if (sortColumn === column) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortColumn = column;
            sortDirection = "desc";
        }

        if (column === "title") titleSortedToggle = !titleSortedToggle;
        else if (column === "author") authorSortedToggle = !authorSortedToggle;
        else if (column === "published_at") publishedSortedToggle = !publishedSortedToggle;
    }

    async function remove(news: News) {
        const res = await fetch(`/api/news/${news.id}`, {
            method: "DELETE",
        });

        if (res.status === 200) {
            location.reload();
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css"
    />
    <style>
        :root {
            @apply bg-neutral-100;
        }
    </style>
</svelte:head>

<div class="overflow-scroll">
    <table class="table-auto mb-6">
        <thead>
            <tr>
                <th on:click={() => sortTable("title")} class="cursor-pointer">
                    <div class="flex items-center">
                        <p>Titel/Synopsis</p>
                        <div class="grow" />
                        <i
                            class={`bi ${titleSortedToggle ? "bi-chevron-down" : "bi-chevron-up"}`}
                        />
                    </div>
                </th>
                <th on:click={() => sortTable("author")} class="cursor-pointer">
                    <div class="flex items-center">
                        <p>Auteur</p>
                        <div class="grow" />
                        <i
                            class={`bi ${authorSortedToggle ? "bi-chevron-down" : "bi-chevron-up"}`}
                        />
                    </div>
                </th>
                <th on:click={() => sortTable("published_at")} class="cursor-pointer">
                    <div class="flex items-center">
                        <p>Publicatiedatum</p>
                        <div class="grow" />
                        <i
                            class={`bi ${publishedSortedToggle ? "bi-chevron-down" : "bi-chevron-up"}`}
                        />
                    </div>
                </th>
                <th />
                <th />
            </tr>
        </thead>
        <tbody>
            {#each sortedNews as news_item}
                <tr>
                    <td class="max-w-[16rem]">
                        <p class="font-medium">{news_item.title}</p>
                        <p class="opacity-75 text-xs truncate max-w-fit">
                            {news_item.synopsis}
                        </p>
                    </td>
                    <td class:opacity-50={news_item.author === null} class="text-sm">
                        {news_item.author ?? "/"}
                    </td>
                    <td class="text-sm font-bold">{news_item.published_at.toLocaleString()}</td>
                    <td>
                        <a href="/admin/nieuws/{news_item.id}">
                            <i class="bi bi-pencil-square" />
                        </a>
                    </td>
                    <td>
                        <button on:click={() => remove(news_item)}>
                            <i class="bi bi-trash3-fill" />
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    <NewButton href="/admin/nieuws/create" />
</div>

<style lang="sass">
    table
        @apply w-full

    th
        @apply text-left

    tbody
        @apply bg-white text-sm font-medium

    th, td
        @apply border border-neutral-200 px-3 py-2
        
    th.cursor-pointer
        @apply hover:bg-gray-100
</style>
