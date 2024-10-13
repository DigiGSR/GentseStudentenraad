<script lang="ts">
    import type { PageData } from "./$types";
    import Tag from "./Tag.svelte";

    export let position: PageData;

    let substituteDropdown = false;
</script>

<div class="rounded-lg p-5 shadow-md space-y-4 bg-white">
    <div class="flex items-center gap-4 overflow-hidden">
        {#if position.person.image}
            <img
                src={position.person.image}
                alt="Portrait of {position.person.name}"
                class="h-28 w-28 object-cover rounded-full"
            />
        {:else}
            <i class="bi bi-person-circle text-6xl text-center h-16" />
        {/if}
        <div>
            <p class="opacity-80 text-xl text-ellipsis">
                {position.name}
            </p>
            <p class="font-semibold text-2xl">{position.person.name}</p>
        </div>

        <div class="grow" />
    </div>

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
                    <i
                        class="bi mt-0.5 {substituteDropdown ? 'bi-chevron-up' : 'bi-chevron-down'}"
                    />
                </div>
                {#if substituteDropdown}
                    <div class="flex flex-col pb-0.5">
                        {#each position.substitutes as substitute}
                            <div
                                class="flex pl-2 py-1 rounded-xl hover:bg-neutral-100 flex-row gap-x-2 items-center"
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
        {:else}
            <div class="pb-[1.75rem]"></div>
        {/if}
    </div>
</div>
