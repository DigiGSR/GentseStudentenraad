<script lang="ts">
    import type { PageData } from "./$types";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import TextField from "$lib/components/admin/TextField.svelte";
    import Uploader from "$lib/components/admin/Uploader.svelte";
    import { goto } from "$app/navigation";
    import { Project } from "@prisma/client";
    import Quill from "$lib/components/admin/Quill.svelte";

    async function post() {
        const res = await fetch(`/api/project/`, {
            method: "POST",
            body: JSON.stringify(newProject),
            headers: {
                "content-type": "application/json",
            },
        });

        if (res.status === 200) {
            goto("/admin/projects");
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }

    export let data: PageData;

    let newProject: Partial<Project> = {
        organization: data.configuration.organization,
        sort_index: 0,
        title: "",
        image: "",
        about: "",
    };

    let submitUploader: () => Promise<void>;
</script>

<svelte:head>
    <style>
        :root {
            @apply bg-neutral-100;
        }
    </style>
</svelte:head>

<div class="space-y-6">
    <TextField bind:value={newProject.title} description="Titel" />

    <Quill bind:value={newProject.about} description="Beschrijving" />

    <Uploader
        bind:submitUploader
        type="image"
        description="Coverfoto"
        bind:source={newProject.image}
    />

    <ActionButton action={post} />
</div>
