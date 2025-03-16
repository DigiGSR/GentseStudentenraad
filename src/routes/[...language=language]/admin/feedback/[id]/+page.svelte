<script lang="ts">
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";

    export let data: PageData;

    async function remove() {
        const res = await fetch(`/api/feedback/${data.feedback.id}`, {
            method: "DELETE",
        });

        if (res.status === 200) {
            await goto("/admin/feedback");
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }
</script>

<svelte:head>
    <style>
        :root {
            @apply bg-neutral-100;
        }
    </style>
</svelte:head>

<div class="space-y-6">
    <div>
        <p class="text-[12px] opacity-50 font-semibold uppercase">Student</p>
        <p class="px-3 py-2 bg-white border border-neutral-200">
            {data.feedback.email || "Anonymous"}
        </p>
    </div>

    <div>
        <p class="text-[12px] opacity-50 font-semibold uppercase">Course</p>
        <p class="px-3 py-2 bg-white border border-neutral-200">
            {data.feedback.course?.name || data.feedback.course_code}
        </p>
    </div>

    <div>
        <p class="text-[12px] opacity-50 font-semibold uppercase">Subject</p>
        <p class="px-3 py-2 bg-white border border-neutral-200">
            {data.feedback.subject?.name || data.feedback.subject_code}
        </p>
    </div>

    <div>
        <p class="text-[12px] opacity-50 font-semibold uppercase">Date</p>
        <p class="px-3 py-2 bg-white border border-neutral-200">
            {new Date(data.feedback.submitted_at).toLocaleString()}
        </p>
    </div>

    <div>
        <p class="text-[12px] opacity-50 font-semibold uppercase">Content</p>
        <div class="px-3 py-2 bg-white border border-neutral-200 whitespace-pre-wrap">
            {data.feedback.content}
        </div>
    </div>

    <ActionButton {remove} />
</div>

<style lang="sass">
    select
        appearance: none
        @apply w-full bg-white py-2 px-4 border-neutral-200 border-[1px]
</style>
