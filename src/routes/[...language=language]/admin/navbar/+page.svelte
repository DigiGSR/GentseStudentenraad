<script lang="ts">
    import type { PageData } from "./$types";
    import AdminRouteElement from "$lib/components/admin/AdminRouteElement.svelte";
    import uniqid from "uniqid";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    export let data: PageData;

    let localDataRoutes = data.routes;
    const setNewChildRoutes = (currName, newRoutes) => {
        for (let i = 0; i < localDataRoutes.length; i++) {
            if (localDataRoutes[i].hierarchyRoute == true && localDataRoutes[i].name === currName) {
                localDataRoutes[i].childRoutes = newRoutes;
            }
        }
    };

    function put() {
        console.log("todo");
    }

    $: console.log(localDataRoutes);
</script>

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
                <div class="flex flex-row p-1.5 rounded-xl border border-gray-400">
                    <input
                        class="bg-transparent rounded-md w-40 p-1 focus:bg-white"
                        bind:value={route.name}
                    />
                    <input
                        class="bg-transparent rounded-md w-32 p-1 focus:bg-white"
                        bind:value={route.route}
                    />
                </div>
            {/if}
        </div>
    {/each}

    <ActionButton action={put} />
</div>
