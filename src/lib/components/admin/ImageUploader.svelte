<script lang="ts">
    export let source: string | undefined = undefined;
    export let description: string | null = null;
    import { enhance } from "$app/forms";

    function reloadAfterDelay() {
        setTimeout(() => {
            location.reload(); //really lazy way to fix but
            //I think its fine, sveltekit literally has no way to recieve form response afaik
        }, 200);
    }
</script>

<div class="py-2">
    {#if description !== null}
        <p class="text-[12px] opacity-50 font-semibold uppercase">{description}</p>
    {/if}

    <form
        class="flex items-center gap-4 w-full bg-white rounded-md p-4 shadow-sm"
        method="post"
        use:enhance
        enctype="multipart/form-data"
    >
        {#if source}
            <img class="h-32 rounded-md" src={source} alt="Preview" />
        {/if}
        <div class="group">
            <input
                type="file"
                id="file"
                name="fileToUpload"
                accept={[".jpg", ".jpeg", ".png", ".webp"].join(",")}
                required
            />
        </div>
        <button class="action-button bg-neutral-300 text-black" type="submit">Submit</button>
    </form>
</div>
