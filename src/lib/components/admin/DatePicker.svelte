<script lang="ts">
    export let value: Date;
    export let description: string | null;

    let valueForHtml = value.toISOString().slice(0, 10);

    $: value = new Date(valueForHtml);
    $: console.log(value);
</script>

<template>
    <div class="py-2">
        {#if description !== null}
            <p class="text-[12px] opacity-50 font-semibold uppercase">{description}</p>
        {/if}
        <input type="date" class="textfield" placeholder="Auteur" bind:value={valueForHtml} />
    </div>
</template>

<style lang="postcss">
    input {
        margin-top: 0 !important;
    }
    .textfield {
        @apply bg-white px-4 py-2 rounded-md w-full border-neutral-200 border-[1px];
    }
</style>
