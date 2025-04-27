<script lang="ts">
    export let placeholder = "";
    export let value: string | null | undefined;
    export let description: string | null = null;
    export let uploadEndpoint = "/api/upload";

    import { createEventDispatcher, onMount } from "svelte";
    import Quill from "quill";

    let quilleditor: HTMLElement;
    let fileInput: HTMLInputElement;
    const dispatch = createEventDispatcher();

    export let toolbarOptions = [
        [{ header: 1 }, { header: 2 }, "blockquote", "link", "image", "video"],
        ["bold", "italic", "underline", "strike"],

        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }],
        [{ align: [] }],
        ["clean"],
    ];

    let quill: Quill;
    let initialValue = value;

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
        return filename.slice(0, filename.lastIndexOf("."));
    }

    function handleImageUpload() {
        fileInput.click();
    }

    async function handleFileInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];

            dispatch("imageSelected", {
                file: file,
                quill: quill,
            });

            await uploadAndInsertImage(file);

            input.value = "";
        }
    }

    async function uploadAndInsertImage(file: File) {
        try {
            const range = quill.getSelection();
            if (!range) return;

            quill.insertText(range.index, "Uploading image...");
            const placeholderLength = "Uploading image...".length;

            const uploadFilename = `api/uploads/${getFileName(file.name)}-${generateRandomFilename(8)}.${getFileExtension(file.name)}`;

            const formData = new FormData();
            formData.append("fileToUpload", file);
            formData.append("uploadFilename", uploadFilename);
            formData.append("oldFilename", "");

            //assume it works omegalul, I cba
            await fetch(uploadEndpoint, {
                method: "POST",
                body: formData,
            });

            quill.deleteText(range.index, placeholderLength);

            const imageUrl = `/${uploadFilename}`;
            quill.insertEmbed(range.index, "image", imageUrl);

            quill.setSelection(range.index + 1, 0);

            dispatch("uploadSuccess", { url: imageUrl });
        } catch (error) {
            console.error("Error uploading image:", error);
            dispatch("uploadError", { error });

            if (quill.getText().includes("Uploading image...")) {
                const uploadingIndex = quill.getText().indexOf("Uploading image...");
                quill.deleteText(uploadingIndex, "Uploading image...".length);
                quill.insertText(uploadingIndex, "Error uploading image", { color: "red" });
            }
        }
    }

    function handlePaste(e: ClipboardEvent) {
        if (e.clipboardData && e.clipboardData.items) {
            const items = e.clipboardData.items;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    e.preventDefault();

                    const file = items[i].getAsFile();
                    if (file) {
                        uploadAndInsertImage(file);
                        return;
                    }
                }
            }
        }
    }

    onMount(() => {
        quill = new Quill(quilleditor, {
            modules: {
                toolbar: {
                    container: toolbarOptions,
                    handlers: {
                        image: handleImageUpload,
                    },
                },
            },
            theme: "snow",
            placeholder: placeholder,
        });

        quill.on("text-change", () => {
            value = quill.getSemanticHTML();
        });

        // Add paste event listener to the editor container
        quilleditor.addEventListener("paste", handlePaste);

        return () => {
            // Clean up event listener when component is destroyed
            quilleditor.removeEventListener("paste", handlePaste);
        };
    });
</script>

<template>
    <div class="flex flex-col gap-y-0.5 justify-center">
        {#if description !== null}
            <p class="text-[12px] opacity-50 font-semibold uppercase">{description}</p>
        {/if}
        <div class="editor-wrapper">
            <input
                type="file"
                bind:this={fileInput}
                on:change={handleFileInputChange}
                accept="image/*"
                style="display: none;"
            />
            <div style="height: 400px; background-color: white; " bind:this={quilleditor}>
                {@html initialValue}
            </div>
        </div>
    </div>
</template>

<style lang="postcss">
    @import "https://cdn.quilljs.com/1.3.6/quill.snow.css";

    textarea {
        @apply bg-white px-4 py-2 rounded-md w-full border-neutral-200 border-[1px];
    }
</style>
