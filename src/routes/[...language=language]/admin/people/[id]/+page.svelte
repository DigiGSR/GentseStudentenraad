<script lang="ts">
    import type { PageData } from "./$types";
    import TextField from "$lib/components/admin/TextField.svelte";
    import Divider from "$lib/components/Divider.svelte";
    import LongTextField from "$lib/components/admin/LongTextField.svelte";
    import Uploader from "$lib/components/admin/Uploader.svelte";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import { goto } from "$app/navigation";
    import { Person, Prisma, PersonPosition } from "@prisma/client";
    export let data: PageData;
    export let description =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";
    export let newPosition: Prisma.PersonPositionUncheckedCreateInput = {
        name: "",
        person_id: data.person.id,
        education: "",
        year: 2023,
        organization: data.configuration.organization,
        sort_index: 0,
        person_group_id: data.groups[0].id,
    };

    console.log(data.allPeople);

    async function putPerson() {
        const copy = { ...data.person };
        delete copy.positions;

        const res = await fetch(`/api/person/${data.person.id}`, {
            method: "PUT",
            body: JSON.stringify(copy),
            headers: {
                "content-type": "application/json",
            },
        });

        if (res.status === 200) {
            goto("/admin/people");
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }

    async function putPosition(position: { id: number }) {
        const copy = { ...position };
        delete copy.person_group;

        const res = await fetch(`/api/position/${position.id}`, {
            method: "PUT",
            body: JSON.stringify(copy),
            headers: {
                "content-type": "application/json",
            },
        });

        if (res.status === 200) {
            goto("/admin/people");
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }

    async function postPosition(position: Prisma.PersonPositionUncheckedCreateInput) {
        const res = await fetch(`/api/position/`, {
            method: "POST",
            body: JSON.stringify(position),
            headers: {
                "content-type": "application/json",
            },
        });

        if (res.status === 200) {
            location.reload();
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }

    async function remove(person: Person) {
        const res = await fetch(`/api/person/${person.id}`, {
            method: "delete",
        });

        if (res.status === 200) {
            await goto("/admin/people");
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }

    async function removePosition(position: PersonPosition) {
        const res = await fetch(`/api/position/${position.id}`, {
            method: "DELETE",
        });

        if (res.status === 200) {
            location.reload();
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
    <TextField description="Naam" bind:value={data.person.name} />

    <Uploader
        bind:submitUploader
        description="Portretfoto"
        type="image"
        bind:source={data.person.image}
    />

    <TextField description="E-mailadres" bind:value={data.person.mail} />

    <ActionButton
        action={async () => {
            await submitUploader();
            putPerson();
        }}
        remove={() => remove(data.person)}
    />

    {#each data.person.positions as position}
        <Divider text="Positie" />

        <TextField description="Titel" bind:value={position.name} />

        <TextField description="Richting" bind:value={position.education} />

        <TextField description="Sorteerindex" bind:value={position.sort_index} />

        <TextField description="Academiejaar" bind:value={position.year} />

        {#if position.substitutes.length > 0}
            <div class="flex flex-row">
                <p class="text-[12px] opacity-50 font-semibold uppercase">Plaatsvervangers:</p>
                <div class="flex flex-col gap-y-1">
                    {#each position.substitutes as index}
                        <div class="flex flex-row ml-2 gap-x-2 items-center">
                            <select
                                class="rounded-md"
                                bind:value={position.substitutes[index].person.id}
                            >
                                {#each data.allPeople as person}
                                    <option value={person.id}>{person.name}</option>
                                {/each}
                            </select>
                            <button
                                on:click={() => {
                                    delete position.substitutes[index];
                                }}
                                class="text-[12px] mr-1 bi bi-dash-circle opacity-50 hover:opacity-80 hover:cursor-pointer transition duration-150"
                            />
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <div>
            <p class="text-[12px] opacity-50 font-semibold uppercase">GROEP</p>
            <select class="rounded-md" bind:value={position.person_group_id}>
                {#each data.groups as group}
                    <option value={group.id}>
                        {group.name}
                    </option>
                {/each}
            </select>
        </div>

        <LongTextField description="Functiebeschrijving" bind:value={description} />

        <ActionButton
            action={async () => {
                putPosition(position);
            }}
            remove={() => removePosition(position)}
        />
    {/each}

    <Divider text="Nieuwe positie" />

    <TextField description="Titel" bind:value={newPosition.name} />

    <TextField description="Richting" bind:value={newPosition.education} />

    <TextField description="Sorteerindex" bind:value={newPosition.sort_index} />

    <TextField description="Academiejaar" bind:value={newPosition.year} />

    <div>
        <p class="text-[12px] opacity-50 font-semibold uppercase">GROEP</p>
        <select bind:value={newPosition.person_group_id}>
            {#each data.groups as group}
                <option value={group.id}>
                    {group.name}
                </option>
            {/each}
        </select>
    </div>

    <LongTextField description="Functiebeschrijving" bind:value={description} />

    <ActionButton action={() => postPosition(newPosition)} />
</div>

<style lang="postcss">
    select {
        appearance: none;

        @apply w-full bg-white py-2 px-4 border-neutral-200 border-[1px];
    }
</style>
