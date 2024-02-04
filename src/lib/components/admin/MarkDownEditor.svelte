<script lang="ts">
    export let placeholder = "";
    export let value: string;
    export let description: string | null = null;

    import { Editor, rootCtx, defaultValueCtx, editorViewOptionsCtx } from "@milkdown/core";
    import { commonmark } from "@milkdown/preset-commonmark";
    import { nord } from "@milkdown/theme-nord";
    import { history } from "@milkdown/plugin-history";

    function editor(dom: any) {
        // to obtain the editor instance we need to store a reference of the editor.
        const MakeEditor = Editor.make()
            .config((ctx) => {
                ctx.set(rootCtx, dom);
                ctx.set(defaultValueCtx, value);
                ctx.update(editorViewOptionsCtx, (prev) => ({
                    ...prev,
                    attributes: {
                        class: "milkdown-editor o max-h-96 mx-auto outline-none",
                        spellcheck: "false",
                    },
                }));
            })
            .config(nord)
            .use(commonmark)
            .use(history)
            .create();
        MakeEditor.then((editor) => {
            console.log(editor); //because eslint
        });
    }
</script>

<template>
    <div>
        {#if description !== null}
            <p class="text-[12px] opacity-50 font-semibold uppercase">{description}</p>
        {/if}
        <div
            class="bg-white resize-y overflow-y-auto px-4 py-2 focus-within:border-black focus-within:border-2 rounded-md w-full border-neutral-200 border-[1px]"
            use:editor
        />
    </div>
</template>

<style>
    .milkdown {
        border: none !important;
        resize: both;
    }
</style>
