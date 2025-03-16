<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;

    async function deleteFeedback(id: number) {
        if (confirm("Are you sure you want to delete this feedback?")) {
            try {
                const response = await fetch(`/api/feedback/${id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    // Reload the page to refresh the data
                    window.location.reload();
                } else {
                    alert("Failed to delete feedback");
                }
            } catch (error) {
                console.error("Error deleting feedback:", error);
                alert("An error occurred while deleting feedback");
            }
        }
    }
</script>

<table class="table-auto text-left w-full">
    <thead>
        <tr>
            <th>
                <div class="flex items-center">
                    <p>Student</p>
                    <div class="grow" />
                    <i class="bi bi-chevron-down" />
                </div>
            </th>
            <th>
                <div class="flex items-center">
                    <p>Vak</p>
                    <div class="grow" />
                    <i class="bi bi-chevron-down" />
                </div>
            </th>
            <th>
                <div class="flex items-center">
                    <p>Datum</p>
                    <div class="grow" />
                    <i class="bi bi-chevron-down" />
                </div>
            </th>
            <th>
                <div class="flex items-center">
                    <p>Inhoud</p>
                    <div class="grow" />
                    <i class="bi bi-chevron-down" />
                </div>
            </th>
            <th />
            <th />
        </tr>
    </thead>

    <tbody>
        {#if data.feedback && data.feedback.length > 0}
            {#each data.feedback as item}
                <tr>
                    <td>{item.email || "Anoniem"}</td>
                    <td>{item.subject?.name || item.subject_code}</td>
                    <td>{new Date(item.submitted_at).toLocaleDateString()}</td>
                    <td class="max-w-md truncate">{item.content}</td>
                    <td>
                        <a href="/admin/feedback/{item.id}">
                            <i class="bi bi-eye" />
                        </a>
                    </td>
                    <td>
                        <button
                            on:click={() => deleteFeedback(item.id)}
                            class="text-red-500 hover:text-red-700"
                        >
                            <i class="bi bi-trash3-fill" />
                        </button>
                    </td>
                </tr>
            {/each}
        {:else}
            <tr>
                <td colspan="6" class="text-center py-4">No feedback entries found</td>
            </tr>
        {/if}
    </tbody>
</table>

<style lang="sass">
    th
        @apply text-left

    tbody
        @apply bg-white text-sm font-medium

    th, td
        @apply border border-neutral-200 px-3 py-2
        
    td:nth-child(4)
        @apply max-w-md overflow-hidden text-ellipsis
</style>
