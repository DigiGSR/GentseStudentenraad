<script lang="ts">
    import type { PageData } from "./$types";
    import TextField from "$lib/components/admin/TextField.svelte";
    import Uploader from "$lib/components/admin/Uploader.svelte";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import { goto } from "$app/navigation";
    import { Prisma } from "@prisma/client";

    export let data: PageData;
    export let description =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";
    export let newPerson: Prisma.PersonUncheckedCreateInput = {
        name: "",
        image: "",
        mail: "",
        organization: data.configuration.organization,
    };
    async function postPerson() {
        const res = await fetch(`/api/person/`, {
            method: "POST",
            body: JSON.stringify(newPerson),
            headers: {
                "content-type": "application/json",
            },
        });

        const user = await res.json();

        if (res.status === 200) {
            await goto(`/admin/people/${user.id}`);
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }

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
    <TextField description="Naam" bind:value={newPerson.name} />

    <Uploader
        bind:submitUploader
        type="image"
        description="Portretfoto"
        bind:source={newPerson.image}
    />

    <TextField description="E-mailadres" bind:value={newPerson.mail} />

    <ActionButton
        action={async () => {
            await submitUploader();
            postPerson();
        }}
    />
</div>

<style lang="postcss">
    select {
        appearance: none;

        @apply w-full bg-white py-2 px-4 border-neutral-200 border-[1px];
    }
</style>
