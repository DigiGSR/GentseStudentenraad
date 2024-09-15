<script lang="ts">
    import { page } from "$app/stores";

    export let icon: string;
    export let value: string;
    export let badgeNeutral: number | null = null;
    export let badgeImportant: number | null = null;
    export let link: string;
</script>

<a href={link} class="btn {$page.url.pathname.includes(link) ? 'active' : ''}">
    <i class="bi bi-{icon}" />
    <p>{value}</p>

    {#if badgeNeutral !== null}
        <div class="grow opacity-50 text-xs">{badgeNeutral}</div>
    {/if}

    {#if badgeImportant !== null}
        <div class="grow">
            <p class="badge">{badgeImportant}</p>
        </div>
    {/if}
</a>

<style lang="sass">
    .btn
        @apply flex rounded-md -ml-4 px-4 py-2 gap-2 font-medium text-sm w-64 items-center opacity-75 cursor-pointer
    .btn.active
        @apply bg-neutral-300 opacity-100
    .badge
        @apply rounded-full bg-red-600 text-white w-6 h-6 flex items-center justify-center text-xs -mr-1
</style>
