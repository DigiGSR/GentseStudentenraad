<script lang="ts">
    export let placeholder = "";
    export let value: string;
    export let description: string | null = null;
    import { marked } from "marked";
    let markdownValue = marked.parse(value, {});

    console.log(marked.parse(value));

    let editorSelected = true;

    $: renderSelected = !editorSelected;

    function toggleEditorRender() {
        editorSelected = !editorSelected;
    }

    // onMount(() => {
    //     const quill = new Quill("#editor", {
    //         theme: "snow",
    //     });
    // });
</script>

<template>
    <div id="editor" />
    <div>
        <div class="flex flex-row items-center mb-1">
            {#if description !== null}
                <p class="text-[12px] opacity-50 font-semibold uppercase">{description}</p>
            {/if}
            <div class="ml-2 rounded-lg flex flex-row mb-0.5 text-[14px]">
                <button
                    on:click={toggleEditorRender}
                    class={`${
                        editorSelected ? "bg-gray-200 text-gray-600" : "bg-white text-gray-400"
                    } py-1 px-2 rounded-l-lg border-none`}
                >
                    editor
                </button>
                <button
                    on:click={toggleEditorRender}
                    class={`${
                        renderSelected ? "bg-gray-200 text-gray-600" : "bg-white text-gray-400"
                    } py-1 px-2 rounded-r-lg border-none`}
                >
                    render
                </button>
            </div>
        </div>
        <div class="w-full">
            {#if editorSelected}
                <textarea class="w-full h-96" {placeholder} bind:value />
            {/if}
            {#if renderSelected}
                {@html markdownValue}
                <!--TODO dit is misschien niet het beste idee, sanitize-html is applied server side however-->
            {/if}
        </div>
    </div>
</template>

<style lang="postcss">
    textarea {
        @apply bg-white px-4 py-2 rounded-md w-full border-neutral-200 border-[1px];
    }
</style>
