<script lang="ts">
    export let bgColor: string;

    let isOpen = false;
</script>

<button
    on:mouseenter={() => (isOpen = true)}
    on:mouseleave={() => (isOpen = false)}
    on:click={() => (isOpen = !isOpen)}
>
    <i class="bi bi-diagram-3 {isOpen ? '-fill' : ''} hidden md:block text-lg translate-y-0.25" />

    <div
        class="group flex-col {isOpen
            ? 'flex'
            : 'md:hidden'} relative md:absolute md:top-[40px] md:w-64 pb-2 py-4 space-y-2 md:shadow-lg mx-auto z-50"
        style:background-color={bgColor}
    >
        <div
            class="flex justify-center px-24 md:grid md:grid-cols-2 md:p-3 gap-3 md:border-t-white md:border-t-2"
        >
            <slot />
        </div>
    </div>
</button>
