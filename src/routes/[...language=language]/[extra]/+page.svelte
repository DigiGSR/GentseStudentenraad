<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<svelte:head>
    <style>
        .markdown-content {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333; /* Default text color */
            font-size: 16px;
        }

        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3,
        .markdown-content h4,
        .markdown-content h5,
        .markdown-content h6 {
            font-weight: bold;
        }

        .markdown-content h1 {
            font-size: 2.5em;
            margin: 0em 0 1em;
        }

        .markdown-content h2 {
            font-size: 2em;
            margin: 1.25em 0 0.75em;
        }

        .markdown-content h3 {
            font-size: 1.5em;
            margin: 1em 0 0.5em;
        }

        .markdown-content p {
            margin: 1em 0;
        }

        .markdown-content pre {
            background-color: #f4f4f4;
            padding: 1em;
            border-radius: 4px;
            overflow-x: auto;
        }

        .markdown-content ul {
            list-style: disc;
            margin-left: 2rem;
        }

        .markdown-content ol {
            list-style: decimal;
            margin-left: 2rem;
        }

        .markdown-content li {
            margin-bottom: 0.5em;
        }

        .markdown-content a {
            color: #007bff;
            text-decoration: none;
        }

        .markdown-content a:hover {
            text-decoration: underline;
        }

        /*.markdown-content img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1em auto;
        }*/
    </style>
</svelte:head>

<div class="container md py-24 markdown-content">
    <div class="">{@html data.contents}</div>
</div>
