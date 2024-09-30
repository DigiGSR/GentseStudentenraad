<script lang="ts">
    export let source: string | null = null;
    export let description: string | null = null;
    export let type: "image" | "file";

    export const submitUploader = async () => {
        if (fileList) {
            buttonge.click();
            loading = true;
            while (loading) {
                await new Promise((resolve) => setTimeout(resolve, 100)); //pretty arbitrary but okay
            }
        }
    };

    const fileTypeDict = {
        image: [".jpg", ".jpeg", ".png", ".webp"],
        file: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"],
    };

    let fileList: FileList;
    $: console.log("fileList", fileList);

    let loading = false;

    function submitge(formData: FormData) {
        fetch("/api/upload", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                console.log("then1 text", response.body);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((response) => {
                console.log("then2 text", JSON.stringify(response));
                loading = false;
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

    function getFileName(filename: string): string {
        return filename.slice(0, filename.lastIndexOf(".") - 1);
    }

    $: uploadFilename = fileList
        ? `api/uploads/${getFileName(fileList[0].name)}-${generateRandomFilename(8)}.${getFileExtension(fileList[0].name)}`
        : "";

    $: console.log("uploadFilename", uploadFilename);

    let buttonge: HTMLButtonElement;
    let fileInput: HTMLInputElement;

    function updatePreview(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                source = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }
</script>

<div class="py-2">
    {#if description !== null}
        <p class="text-[12px] opacity-50 font-semibold uppercase">{description}</p>
    {/if}

    <form
        class="flex items-center gap-4 w-full opa bg-white rounded-md p-4 shadow-sm"
        enctype="multipart/form-data"
        on:formdata={(value) => {
            source = `/${uploadFilename}`;
            submitge(value.formData);
        }}
    >
        {#if loading}
            <div class="flex justify-center items-center flex-col">
                <p class="opacity-50 text-sm w-fit">Uploading</p>
                <p class="opacity-50 text-sm w-fit">... (pls dont refresh)</p>
                <i class="bi bi-hourglass-split animate-spin w-fit text-2xl opacity-40" />
            </div>
        {/if}
        {#if source && type === "image"}
            <img class="h-32 rounded-md" src={source} alt="Preview" />
        {/if}

        {#if type === "file"}
            <i
                class="bi bi-file-earmark-text transition-opacity hover:cursor-pointer opacity-40 hover:opacity-60 text-4xl"
            ></i>
            {#if fileList}
                <p class="opacity-50 text-sm">{fileList[0].name}</p>
            {:else}
                <a href={source} target="_blank" class="opacity-50 hover:underline text-sm"
                    >{source}</a
                >
            {/if}
        {/if}

        <button
            on:click={() => {
                fileInput.click();
            }}
            class="action-button justify-self-end bg-neutral-800 text-white"
        >
            <i class="bi bi-upload" />
            Upload
        </button>

        <div class="group">
            <input type="hidden" name="oldFilename" value={source} />
            <input type="hidden" name="uploadFilename" value={uploadFilename} />
            <input
                class="hidden"
                bind:files={fileList}
                type="file"
                id="file"
                name="fileToUpload"
                accept={fileTypeDict[type].join(",")}
                required
                bind:this={fileInput}
                on:change={updatePreview}
            />
        </div>
        <button bind:this={buttonge} class="hidden" type="submit">Submit</button>
    </form>
</div>

<style lang="postcss">
    .action-button {
        @apply flex items-center gap-2 px-4 py-2 text-center rounded-lg text-sm font-semibold;
    }
</style>
