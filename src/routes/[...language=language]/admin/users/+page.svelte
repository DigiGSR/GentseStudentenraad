<script lang="ts">
    import { goto } from "$app/navigation";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import { Organization } from "@prisma/client";
    import type { PageData } from "./$types";
    export let data: PageData;

    //data.users.admin will only include your organization

    //on value change of admin to true we need to store the mutation of appending
    //an admin entry to the current admin table and then finally call put to execute the mutations

    for (let user of data.users) {
        if (user.admin.length > 0) {
            console.log(user, user.admin);
        }
    }

    async function put() {
        const res = await fetch(`/api/users`, {
            method: "PUT",
            body: JSON.stringify(mutations),
            headers: {
                "content-type": "application/json",
            },
        });

        if (res.status === 200) {
            goto("/admin");
        } else {
            alert(JSON.stringify(res, null, 2));
        }
    }

    let mutations: { organization: Organization; id: number; isAdmin: boolean }[] = [];

    function setAdmin(id: number, isAdmin: boolean) {
        mutations.push({ organization: data.configuration.organization, id: id, isAdmin: isAdmin });
        mutations = mutations;
    }

    $: console.log("mutations", mutations);
</script>

<div class="flex flex-col gap-y-2">
    <table class="table-auto text-left w-full">
        <thead>
            <tr>
                <th>
                    <div class="flex items-center">
                        <p>Email</p>
                        <div class="grow" />
                        <i class="bi bi-chevron-down" />
                    </div>
                </th>
                <th>
                    <p>Student</p>
                </th>
                <th>
                    <p>Admin</p>
                </th>
            </tr>
        </thead>

        <tbody>
            {#each data.users as user}
                <tr>
                    <td>
                        <p>{user.email}</p>
                    </td>
                    <td>
                        <p>{user.student ? "True" : "False"}</p>
                    </td>
                    <td>
                        <select
                            on:change={(e) => setAdmin(user.id, e.target.value)}
                            value={user.admin.length > 0 ? "True" : "False"}
                            class="px-1 py-0.5 rounded-md"
                        >
                            <option value="True">True</option>
                            <option value="False">False</option>
                        </select>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
    <ActionButton action={put} />
</div>

<style lang="sass">
    th
        @apply text-left

    tbody
        @apply bg-white text-sm font-medium

    th, td
        @apply border border-neutral-200 px-3 py-2
</style>
