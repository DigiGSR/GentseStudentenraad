<script lang="ts">
    import type { PageData } from "./$types";
    import Tag from "./Tag.svelte";

    export let position: PageData;

    let substituteDropdown = true;
</script>

<div class="rounded-lg p-6 space-y-4 bg-white h-fit">
    <div class="flex items-center gap-4 overflow-hidden">
        {#if position.person.image}
            <img
                src={position.person.image}
                alt="Portrait of {position.person.name}"
                class="h-16 w-16 object-cover rounded-full"
            />
        {:else}
            <i class="bi bi-person-circle text-6xl text-center h-16" />
        {/if}
        <div>
            <p class="opacity-90 text-ellipsis">
                {position.name}
            </p>
            <p class="font-semibold text-xl">{position.person.name}</p>
        </div>

        <div class="grow" />
    </div>

    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris.
    </p>

    <div class="flex flex-row gap-x-2">
        {#if position.substitutes.length > 0}
            <div
                on:mousedown={() => (substituteDropdown = !substituteDropdown)}
                class="flex opacity-90 flex-col text-xs bg-neutral-50 border-neutral-200 text-black hover:cursor-pointer border-2 {substituteDropdown
                    ? 'rounded-2xl'
                    : 'rounded-full'} w-fit font-medium"
            >
                <div class="flex select-none h-fit gap-2 items-center w-fit px-3 py-1 transition">
                    <p>Plaatsvervangers</p>
                    <i class="bi mt-0.5 bi-chevron-down" />
                </div>
                {#if substituteDropdown}
                    <div class="flex flex-col pb-0.5">
                        {#each position.substitutes as substitute}
                            <div
                                class="flex pl-2 py-1 rounded-xl hover:bg-neutral-200 flex-row gap-x-2 items-center"
                            >
                                {#if substitute.person.image}
                                    <img
                                        src={substitute.person.image}
                                        alt="Portrait of {substitute.person.name}"
                                        class="h-6 w-6 object-cover rounded-full"
                                    />
                                {/if}
                                <p class="text-base opacity-90 font-normal">
                                    {substitute.person.name}
                                </p>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        {/if}

        {#if position.person.mail !== null}
            <Tag link="mailto:{position.person.mail}" value={position.person.mail} icon="mailbox" />
        {/if}
    </div>
</div>
