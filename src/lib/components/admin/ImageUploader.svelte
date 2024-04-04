<script lang="ts">
    export let dir: string; //dir where file will end up
    export let org: string; //elke FSR andere map
    export let source: string | undefined = undefined;
    export let description: string | null = null;
    import { enhance } from "$app/forms";

    let imageValue = "";

    function generateRandomFilename(length: number) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let filename = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            filename += charset.charAt(randomIndex);
        }

        return filename;
    }

    function getFileExtension(filename: string): string {
        return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
    }

    let uploadFilename = `${org}/${dir}/${generateRandomFilename(16)}.${getFileExtension(
        imageValue,
    )}`;
    $: console.log(uploadFilename);
</script>

<div class="py-2">
    {#if description !== null}
        <p class="text-[12px] opacity-50 font-semibold uppercase">{description}</p>
    {/if}

    <form
        action={`/api/upload`}
        class="flex items-center gap-4 w-full bg-white rounded-md p-4 shadow-sm"
        method="post"
        use:enhance
        enctype="multipart/form-data"
    >
        {#if source}
            <img class="h-32 rounded-md" src={source} alt="Preview" />
        {/if}
        <div class="group">
            <input type="hidden" name="oldFilename" value={source} />
            <input type="hidden" name="uploadFilename" value={uploadFilename} />
            <input
                bind:value={imageValue}
                type="file"
                id="file"
                name="fileToUpload"
                accept={[".jpg", ".jpeg", ".png", ".webp"].join(",")}
                required
            />
        </div>
        <button
            on:click={() => {
                source = uploadFilename;
            }}
            class="action-button bg-neutral-300 text-black"
            type="submit">Submit</button
        >
    </form>
</div>

<style lang="postcss">
    .action-button {
        @apply flex items-center gap-2 px-4 py-2 text-center rounded-lg text-sm font-semibold;
    }
</style>
