<script lang="ts">
    import type { PageData } from "./$types";
    import AdminRouteElement from "$lib/components/admin/AdminRouteElement.svelte";
    import uniqid from "uniqid";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import { goto } from "$app/navigation";
    export let data: PageData;

    //todo i18n for navbar editor

    $: console.log(data.configuration.navbar);

    for (let i = 0; i < data.configuration.navbar.length; i++) {
        if (!("nl" in data.configuration.navbar[i].name)) {
            data.configuration.navbar[i].name = {
                nl: data.configuration.navbar[i].name,
                en: data.configuration.navbar[i].name,
            };
        }

        if (data.configuration.navbar[i].hierarchyRoute === true) {
            for (let j = 0; j < data.configuration.navbar[i].childRoutes.length; j++) {
                if (!("nl" in data.configuration.navbar[i].childRoutes[j])) {
                    data.configuration.navbar[i].childRoutes[j].name = {
                        nl: data.configuration.navbar[i].childRoutes[j].name,
                        en: data.configuration.navbar[i].childRoutes[j].name,
                    };
                }
            }
        }
    }

    const setNewChildRoutes = (currName, newRoutes) => {
        for (let i = 0; i < data.configuration.navbar.length; i++) {
            if (
                data.configuration.navbar[i].hierarchyRoute == true &&
                data.configuration.navbar[i].name === currName
            ) {
                data.configuration.navbar[i].childRoutes = newRoutes;
            }
        }
    };

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

    function removeElem(name: string) {
        const index = data.configuration.navbar.findIndex((item) => item.name === name);
        if (
            confirm(
                `Ben je zeker dat je ${
                    data.configuration.navbar[index].route
                        ? `route "${data.configuration.navbar[index].route}"`
                        : `hiërarchische route "${data.configuration.navbar[index].name}"`
                } wilt verwijderen?`,
            )
        ) {
            data.configuration.navbar.splice(index, 1);
            data.configuration.navbar = data.configuration.navbar;
        }
    }

    function moveUp(test) {
        for (let i = 0; i < data.configuration.navbar.length; i++) {
            if (data.configuration.navbar[i].name === test.name && i > 0) {
                console.log(test);
                data.configuration.navbar[i] = data.configuration.navbar[i - 1];
                data.configuration.navbar[i - 1] = test;
                break;
            }
        }
    }
    function moveDown(test) {
        for (let i = 0; i < data.configuration.navbar.length; i++) {
            if (
                data.configuration.navbar[i].name === test.name &&
                i < data.configuration.navbar.length - 1
            ) {
                console.log(test);
                data.configuration.navbar[i] = data.configuration.navbar[i + 1];
                data.configuration.navbar[i + 1] = test;
                break;
            }
        }
    }
</script>

<div class="sticky top-0 right-0 pt-4 w-full flex justify-end flex-row">
    <ActionButton action={put} />
</div>
<div class="flex flex-col gap-y-2 items-start">
    <div class="flex flex-row items-start">
        <p class="text-[18px] opacity-50 font-semibold uppercase">Routes</p>
        <button
            on:click={() => {
                data.configuration.navbar.push({
                    hierarchyRoute: false,
                    name: { nl: "titel", en: "title" },
                    route: "slug",
                });
                data.configuration.navbar = data.configuration.navbar;
            }}
            class="text-[18px] ml-1 bi bi-plus-circle opacity-50 hover:opacity-80 hover:cursor-pointer transition duration-150"
        />
        <button
            on:click={() => {
                data.configuration.navbar.push({
                    hierarchyRoute: true,
                    name: { nl: "titel", en: "title" },
                    route: "slug",
                    childRoutes: [
                        {
                            id: uniqid(),
                            name: { nl: "titel", en: "title" },
                            route: "slug",
                        },
                    ],
                });
                data.configuration.navbar = data.configuration.navbar;
            }}
            class="text-[18px] ml-1 bi bi-folder-plus opacity-50 hover:opacity-80 hover:cursor-pointer transition duration-150"
        />
    </div>

    {#each data.configuration.navbar as route}
        <div class="flex flex-row items-start">
            <button
                on:click={() => {
                    removeElem(route.name);
                }}
                class="text-[12px] mr-1 bi bi-dash-circle opacity-50 hover:opacity-80 hover:cursor-pointer transition duration-150"
            />
            <i
                on:click={() => {
                    moveUp(route);
                }}
                class="bi bi-caret-up opacity-50 hover:opacity-80 hover:cursor-pointer transition duration-150"
            />
            <i
                on:click={() => {
                    moveDown(route);
                }}
                class="bi bi-caret-down opacity-50 hover:opacity-80 hover:cursor-pointer transition duration-150"
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
                        placeholder="nederlandse naam"
                        bind:value={route.name.nl}
                    />
                    <input
                        class="bg-transparent rounded-md w-40 p-1 focus:bg-white"
                        placeholder="english name"
                        bind:value={route.name.en}
                    />
                    <input
                        class="bg-transparent rounded-md w-32 p-1 focus:bg-white"
                        bind:value={route.route}
                    />
                </div>
            {/if}
        </div>
    {/each}
</div>
