<script lang="ts">
    export let source: string | undefined = undefined;
    export let description: string | null = null;
    import { enhance } from "$app/forms";

    let form: any;
</script>

<div class="py-2">
    {#if description !== null}
        <p class="text-[12px] opacity-50 font-semibold uppercase">
            {description}
            {#if source}
                <a class="hover:underline opacity-70" href={source}
                    >(Download <i class="bi bi-file-pdf" />)</a
                >
            {/if}
        </p>
    {/if}

    <form
        bind:this={form}
        class="flex flex-row items-center gap-4 w-full rounded-md"
        method="post"
        use:enhance
        enctype="multipart/form-data"
    >
        <div class="flex flex-row gap-x-2 w-full align-middle">
            <input
                class="hidden"
                type="file"
                id="file"
                name="fileToUpload"
                accept={[".pdf"].join(",")}
                required
            />
            <label class="action-button bg-neutral-800 text-white" for="file"
                ><i class="bi bi-save" />Upload Verslag</label
            >
            <button class="action-button bg-neutral-300 text-black" type="submit">Submit</button>
        </div>
    </form>
</div>

<style lang="postcss">
    .action-button {
        @apply flex items-center gap-2 px-4 py-2 text-center rounded-lg text-sm font-semibold;
    }
</style>
