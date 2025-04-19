<script lang="ts">
    export let placeholder = "";
    export let value: string | null | undefined;
    export let description: string | null = null;

    import { onMount } from "svelte";
    import Quill from "quill";

    let quilleditor: HTMLElement;

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

    onMount(() => {
        quill = new Quill(quilleditor, {
            modules: {
                toolbar: toolbarOptions,
            },

            theme: "snow",
            placeholder: placeholder,
        });
        quill.on("text-change", () => {
            value = quill.getSemanticHTML();
        });
    });
</script>

<template>
    <div class="flex flex-col gap-y-0.5 justify-center">
        {#if description !== null}
            <p class="text-[12px] opacity-50 font-semibold uppercase">{description}</p>
        {/if}
        <div class="editor-wrapper">
            <!-- I dont know why, but setting height with tailwind doesnt work here -->
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
