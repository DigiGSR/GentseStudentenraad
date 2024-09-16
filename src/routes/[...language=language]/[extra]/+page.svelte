<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<svelte:head></svelte:head>

<div class="container md py-24 markdown-content">
    <div class="">{@html data.contents}</div>
</div>
