<script lang="ts">
    import type { PageData } from "./$types";
    import Tag from "./Tag.svelte";

    export let position: PageData;
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
            <p class="opacity-90 text-sn text-ellipsis">
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

    {#if position.substitutes.length > 0}
        <div class="flex flex-row">
            <p class="pt-1">Plaatsvervangers:</p>
            <div class="flex flex-col gap-y-1">
                {#each position.substitutes as substituteEntry}
                    <div class="ml-2 flex flex-row gap-x-2 items-center">
                        {#if substituteEntry.substitute.image}
                            <img
                                src={substituteEntry.substitute.image}
                                alt="Portrait of {position.person.name}"
                                class="h-8 w-8 object-cover rounded-full"
                            />
                        {/if}
                        <p>{substituteEntry.substitute.name}</p>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    {#if position.person.mail !== null}
        <Tag link="mailto:{position.person.mail}" value={position.person.mail} icon="mailbox" />
    {/if}
</div>
