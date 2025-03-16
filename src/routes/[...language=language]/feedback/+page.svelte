<script lang="ts">
    import type { PageData } from "./$types";
    import { selectedLanguage } from "$lib/Language";

    type ArrayType<T> = T extends Array<infer Base> ? Base : never;

    let course: ArrayType<PageData["courses"]> | null;
    let subject: { subject: { name: string; code: string }; subject_code: string } | null = null;
    let text = "";
    let submitting = false;
    let submitSuccess = false;
    let submitError = "";

    export let data: PageData;

    async function submitFeedback() {
        if (!course || !subject || !text) {
            submitError =
                data.i18n[$selectedLanguage].get("feedback-error-missing-fields") ||
                "Please fill in all fields";
            return;
        }

        submitting = true;
        submitError = "";

        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.user?.email,
                    content: text,
                    course_code: course.code,
                    subject_code: subject.subject_code,
                    organization: data.configuration.organization,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to submit feedback");
            }

            // Reset form on success
            text = "";
            submitSuccess = true;
        } catch (error) {
            submitError = error instanceof Error ? error.message : "An unknown error occurred";
        } finally {
            submitting = false;
        }
    }
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
            {#if submitSuccess}
                <div
                    class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                >
                    <span class="block sm:inline"
                        >{data.i18n[$selectedLanguage].get("feedback-success") ||
                            "Thank you for your feedback!"}</span
                    >
                </div>
            {:else}
                {#if submitError}
                    <div
                        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    >
                        <span class="block sm:inline">{submitError}</span>
                    </div>
                {/if}

                <select class="w-full p-2 rounded-md font-bold" bind:value={course}>
                    <option value={null}
                        >{@html data.i18n[$selectedLanguage].get("feedback-major-selector")}</option
                    >
                    {#each data.courses as courseOption}
                        <option value={courseOption}>{courseOption.name}</option>
                    {/each}
                </select>

                <select class="w-full p-2 rounded-md font-bold" bind:value={subject}>
                    <option value={null}
                        >{@html data.i18n[$selectedLanguage].get(
                            "feedback-subject-selector",
                        )}</option
                    >
                    {#if course}
                        {#each course.subjects as subjectOption}
                            <option value={subjectOption}
                                >{subjectOption.subject.name} ({subjectOption.subject_code})</option
                            >
                        {/each}
                    {/if}
                </select>

                <textarea
                    class="order-1 row-span-2"
                    rows="10"
                    bind:value={text}
                    placeholder={data.i18n[$selectedLanguage].get("feedback-placeholder")}
                />

                <button
                    on:click={submitFeedback}
                    class="w-full py-4 font-bold rounded-md text-center text-white hover:cursor-pointer disabled:opacity-50"
                    style:background-color={data.configuration.brand_color_primary}
                    disabled={submitting}
                >
                    {#if submitting}
                        <i class="bi bi-hourglass-split pr-2" />
                        {data.i18n[$selectedLanguage].get("feedback-sending") || "Sending..."}
                    {:else}
                        <i class="bi bi-send-fill pr-2" />
                        {data.i18n[$selectedLanguage].get("vakfeedback-verzenden")}
                    {/if}
                </button>
            {/if}
        </div>
    </div>
</div>

<style>
    textarea {
        @apply w-full rounded-lg overflow-hidden p-4;
    }
</style>
