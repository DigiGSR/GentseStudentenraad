<script lang="ts">
    export let text: string;
    export let navElemHeight: number;
    export let parentWidth: number;
    export let bgColor: string;

    let isOpen = false;
</script>

<button
    bind:clientHeight={navElemHeight}
    bind:clientWidth={parentWidth}
    class="hover:cursor-pointer min-w-fit"
    on:mouseenter={() => (isOpen = true)}
    on:mouseleave={() => (isOpen = false)}
    on:click={() => (isOpen = !isOpen)}
>
    <div
        class="pb-1 hover:opacity-70 {isOpen
            ? 'opacity-70'
            : ''} w-fit opacity-100 transition duration-150"
    >
        {text} <i class="bi bi-chevron-down translate-y-0.25" />
    </div>

    <div
        bind:clientWidth={parentWidth}
        class="group
            {isOpen ? 'flex' : 'hidden'} 
            relative md:absolute md:shadow-lg z-50"
        style:background-color={bgColor}
    >
        <div
            class="flex flex-col min-w-max
        md:mt-4 p-3
        border-white md:border-t-2
        gap-y-2
        items-start md:items-center
        md:divide-y
        text-left md:text-center"
        >
            <slot />
        </div>
    </div>
</button>
