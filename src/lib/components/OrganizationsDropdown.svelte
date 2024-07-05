<script lang="ts">
    export let bgColor: string;

    let isOpen = false;
</script>

<button
    on:mouseenter={() => (isOpen = true)}
    on:mouseleave={() => (isOpen = false)}
    on:click={() => (isOpen = !isOpen)}
>
    <i class="bi bi-diagram-3{isOpen ? '-fill' : ''} text-lg translate-y-0.25" />

    <div
        class="group flex-col {isOpen
            ? 'flex'
            : 'hidden'} relative md:absolute md:top-[40px] w-64 pb-2 py-4 space-y-2 shadow-lg mx-auto"
        style:background-color={bgColor}
    >
        <div class="grid grid-cols-2 p-3 gap-3 justify-between border-t-white border-t-2">
            <slot />
        </div>
    </div>
</button>
