<script lang="ts">
    import type { PageData } from "./$types";
    import { selectedLanguage } from "$lib/Language";

    type ArrayType<T> = T extends Array<infer Base> ? Base : never;

    let course: ArrayType<PageData["courses"]> | null;
    let text = "";

    export let data: PageData;
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css"
    />
    <style>
        :root {
            @apply bg-neutral-100;
        }
    </style>
</svelte:head>

<img
    class="h-[50vh] w-full object-cover max-h-[500px]"
    src="https://unsplash.com/photos/s9CC2SKySJM/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjY5MzkzNDI5&force=true&w=1920"
    alt="Student filling in a form"
/>

<div class="container py-16 space-y-8">
    <div class="grid grid-cols-2 gap-16 items-center">
        <div class="md">
            {@html data.i18n[$selectedLanguage].get("feedback-about")}
        </div>

        <div class="space-y-4">
            <select class="w-full p-2 rounded-md font-bold" bind:value={course}>
                <option value={null}
                    >{@html data.i18n[$selectedLanguage].get("feedback-major-selector")}</option
                >
                {#each data.courses as course}
                    <option value={course}>{course.name}</option>
                {/each}
            </select>
            <select class="w-full p-2 rounded-md font-bold">
                <option
                    >{@html data.i18n[$selectedLanguage].get("feedback-subject-selector")}</option
                >
                {#if course}
                    {#each course.subjects as subject}
                        <option>{subject.subject.name} ({subject.subject_code})</option>
                    {/each}
                {/if}
            </select>
            <textarea
                class="order-1 row-span-2"
                rows="10"
                bind:value={text}
                placeholder={data.i18n[$selectedLanguage].get("feedback-placeholder")}
            />

            <p
                class="w-full py-4 font-bold rounded-md text-center text-white"
                style:background-color={data.configuration.brand_color_primary}
            >
                <i class="bi bi-send-fill pr-2" />
                {data.i18n[$selectedLanguage].get("vakfeedback-verzenden")}
            </p>
        </div>
    </div>
</div>

<style>
    textarea {
        @apply w-full rounded-lg overflow-hidden p-4;
    }
</style>
