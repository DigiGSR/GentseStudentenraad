<script lang="ts">
    export let dir: string; //dir where file will end up
    export let org: string; //elke FSR andere map
    console.log(dir, org);
    export let source: string | undefined = undefined;
    export let description: string | null = null;

    let formData: any;

    let fileList: any;
    $: console.log("fileList", fileList);

    function submitge(formData: any) {
        console.log("formData", formData);

        fetch("/api/upload", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                console.log("then1 text", response);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((response) => {
                console.log("then2 text", response);
            })
            .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
            });
    }

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

    $: uploadFilename = fileList
        ? `${org}/${dir}/${generateRandomFilename(16)}.${getFileExtension(fileList[0].name)}`
        : "";
    $: console.log("uploadFilename", uploadFilename);
</script>

<div class="py-2">
    {#if description !== null}
        <p class="text-[12px] opacity-50 font-semibold uppercase">{description}</p>
    {/if}

    <form
        class="flex items-center gap-4 w-full bg-white rounded-md p-4 shadow-sm"
        enctype="multipart/form-data"
        on:formdata={(value) => {
            console.log("FOOOORM", value.formData);
            submitge(value.formData);
        }}
    >
        {#if source}
            <img class="h-32 rounded-md" src={source} alt="Preview" />
        {/if}
        <div class="group">
            <input type="hidden" name="oldFilename" value={source} />
            <input type="hidden" name="uploadFilename" value={uploadFilename} />
            <input
                bind:files={fileList}
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

<style lang="postcss">
    .action-button {
        @apply flex items-center gap-2 px-4 py-2 text-center rounded-lg text-sm font-semibold;
    }
</style>
