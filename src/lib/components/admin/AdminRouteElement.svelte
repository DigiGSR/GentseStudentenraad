<script lang="ts">
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import uniqid from "uniqid";

    export let name: string;
    /**
     * @type {{ id: any; name: string; route: string; }[]}
     */
    export let items;

    const flipDurationMs = 300;
    function handleDndConsider(e) {
        items = e.detail.items;
    }
    function handleDndFinalize(e) {
        items = e.detail.items;
    }

    function addItem() {
        items.push({
            id: uniqid(),
            name: "titel",
            route: "nl/slug",
        });
        items = items;
    }

    function removeItem(id: number) {
        const index = items.findIndex((item) => item.id === id);
        if (confirm(`Ben je zeker dat je route "${items[index].route}" wilt verwijderen?`)) {
            items.splice(index, 1);
            items = items;
        }
    }

    let dropTargetStyle = "";
</script>

<div class="w-fit p-2 gap-y-2 flex rounded-xl flex-col border border-gray-400">
    <div class="flex gap-x-1 flex-row justify-between items-center">
        <div class="flex gap-x-1 flex-row items-center">
            <i class="bi bi-folder opacity-50" />
            <input class="bg-transparent rounded-md w-48 p-1 focus:bg-white" bind:value={name.nl} />
            <input class="bg-transparent rounded-md w-48 p-1 focus:bg-white" bind:value={name.en} />
        </div>
        <i
            on:click={addItem}
            class="bi bi-plus-circle opacity-50 hover:opacity-80 hover:cursor-pointer transition duration-150"
        />
    </div>
    <div
        class="w-fit gap-y-2 flex rounded-xl flex-col"
        use:dndzone={{ items, flipDurationMs, dropTargetStyle: dropTargetStyle }}
        on:consider={handleDndConsider}
        on:finalize={handleDndFinalize}
    >
        {#each items as item (item.id)}
            <div
                class="flex p-1.5 border rounded-xl border-gray-400 flex-row w-fit"
                animate:flip={{ duration: flipDurationMs }}
            >
                <button
                    on:click={() => removeItem(item.id)}
                    class="text-[12px] mr-1 bi bi-dash-circle opacity-50 hover:opacity-80 hover:cursor-pointer transition duration-150"
                />
                <input
                    class="bg-transparent rounded-md p-1 w-40 focus:bg-white"
                    bind:value={item.name.nl}
                />
                <input
                    class="bg-transparent rounded-md p-1 w-40 focus:bg-white"
                    bind:value={item.name.en}
                />
                <i class="bi text-3xl mx-12 bi-grip-horizontal opacity-50 hover:opacity-70" />
                <input
                    class="w-32 rounded-md p-1 bg-transparent focus:bg-white"
                    bind:value={item.route}
                />
            </div>
        {/each}
    </div>
</div>
