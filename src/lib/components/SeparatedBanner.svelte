<script lang="ts">
    export let title: string;
    export let body: string;
    export let imageUrl: string;
    export let imageAlt = "";
    export let css = "";
    export let imagePosition: "left" | "right";
    export let color = "";
</script>

<div class="container">
    <div
        class="grid md:grid-cols-5 items-center {css} overflow-clip rounded-lg"
        style:background-color={color}
    >
        {#if imagePosition === "left"}
            <img class="md:col-span-3" src={imageUrl} alt={imageAlt} />
        {/if}
        <div class="md:col-span-2 p-12 space-y-2">
            <p class="font-bold text-xl">
                {@html title}
            </p>
            <p class="opacity-90">
                {@html body}
            </p>
        </div>
        {#if imagePosition === "right"}
            <img class="md:col-span-3" src={imageUrl} alt={imageAlt} />
        {/if}
    </div>
</div>
