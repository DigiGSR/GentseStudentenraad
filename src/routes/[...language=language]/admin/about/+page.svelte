<script lang="ts">
    import type { PageData } from "./$types";
    import TextField from "$lib/components/admin/TextField.svelte";
    import LongTextField from "$lib/components/admin/LongTextField.svelte";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import { goto } from "$app/navigation";
    import ImageUploader from "$lib/components/admin/ImageUploader.svelte";
    import AdminRouteElement from "$lib/components/admin/AdminRouteElement.svelte";
    import uniqid from "uniqid";
    export let data: PageData;

    async function put() {
        const res = await fetch(`/api/configuration/${data.configuration.id}`, {
            method: "PUT",
            body: JSON.stringify(data.configuration),
            headers: {
                "content-type": "application/json",
            },
        });

        if (res.status === 200) {
            goto("/admin");
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }

    let localDataRoutes = data.routes;
    const setNewChildRoutes = (currName, newRoutes) => {
        for (let i = 0; i < localDataRoutes.length; i++) {
            if (localDataRoutes[i].hierarchyRoute == true && localDataRoutes[i].name === currName) {
                localDataRoutes[i].childRoutes = newRoutes;
            }
        }
    };

    $: console.log(localDataRoutes);
</script>

<svelte:head>
    <style>
        :root {
            @apply bg-neutral-100;
        }
    </style>
</svelte:head>

<div class="space-y-6">
    <TextField
        placeholder="Gentse Studentenraad"
        bind:value={data.configuration.name}
        description="Organisatienaam"
    />

    <LongTextField
        placeholder=""
        bind:value={data.configuration.short_description}
        description="Korte beschrijving"
    />

    <TextField
        placeholder="Straatnaam 1, 9000 Gent"
        bind:value={data.configuration.adres}
        description="Adres"
    />

    <TextField
        placeholder="091234567"
        bind:value={data.configuration.phone}
        description="Telefoonnummer"
    />

    <TextField
        placeholder="hello@example.com"
        bind:value={data.configuration.email_adres}
        description="E-mailadres"
    />

    <ImageUploader bind:source={data.configuration.group_photo} />

    <div class="flex flex-col gap-y-2 items-start">
        <div class="flex flex-row items-start">
            <p class="text-[18px] opacity-50 font-semibold uppercase">Routes</p>
            <button
                on:click={() => {
                    localDataRoutes.push({
                        hierarchyRoute: false,
                        name: "nieuw",
                        route: "nl/nieuw",
                    });
                    localDataRoutes = localDataRoutes;
                }}
                class="text-[18px] ml-1 bi bi-plus-circle opacity-50 hover:opacity-80 hover:cursor-pointer transition duration-150"
            />
            <button
                on:click={() => {
                    localDataRoutes.push({
                        hierarchyRoute: true,
                        name: "nieuw",
                        route: "nl/nieuw",
                        childRoutes: [
                            {
                                id: uniqid(),
                                name: "nieuw",
                                route: "nl/nieuw",
                            },
                        ],
                    });
                    localDataRoutes = localDataRoutes;
                }}
                class="text-[18px] ml-1 bi bi-folder-plus opacity-50 hover:opacity-80 hover:cursor-pointer transition duration-150"
            />
        </div>

        {#each localDataRoutes as route}
            <div class="flex flex-row items-start">
                <button
                    on:click={() => {
                        //todo remove
                    }}
                    class="text-[12px] mr-1 bi bi-dash-circle opacity-50 hover:opacity-80 hover:cursor-pointer transition duration-150"
                />
                {#if route.hierarchyRoute === true}
                    <AdminRouteElement
                        setItems={(arg) => setNewChildRoutes(route.name, arg)}
                        bind:items={route.childRoutes}
                        bind:name={route.name}
                    />
                {:else}
                    <input
                        class="bg-transparent rounded-md w-32 p-1 focus:bg-white"
                        bind:value={route.name}
                    />
                {/if}
            </div>
        {/each}
    </div>

    <ActionButton action={put} />
</div>
