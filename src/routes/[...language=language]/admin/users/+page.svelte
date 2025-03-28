<script lang="ts">
    import { goto } from "$app/navigation";
    import ActionButton from "$lib/components/admin/ActionButton.svelte";
    import { Organization } from "@prisma/client";
    import type { PageData } from "./$types";
    export let data: PageData;

    let sortColumn: "email" | "student" | "admin" = "email";
    let sortDirection: "asc" | "desc" = "asc";

    let emailSortedToggle = true;
    let studentSortedToggle = true;
    let adminSortedToggle = true;

    $: sortedUsers = [...data.users].sort((a, b) => {
        let valueA, valueB;
        switch (sortColumn) {
            case "email":
                valueA = a.email.toLowerCase();
                valueB = b.email.toLowerCase();
                break;
            case "student":
                valueA = a.student ? 1 : 0;
                valueB = b.student ? 1 : 0;
                break;
            case "admin":
                valueA = a.admin.length > 0 ? 1 : 0;
                valueB = b.admin.length > 0 ? 1 : 0;
                break;
            default:
                valueA = a.email.toLowerCase();
                valueB = b.email.toLowerCase();
        }

        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    function sortTable(column: "email" | "student" | "admin") {
        if (sortColumn === column) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortColumn = column;
            sortDirection = "desc";
        }

        if (column === "email") emailSortedToggle = !emailSortedToggle;
        else if (column === "student") studentSortedToggle = !studentSortedToggle;
        else if (column === "admin") adminSortedToggle = !adminSortedToggle;
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
                <th on:click={() => sortTable("email")} class="cursor-pointer">
                    <div class="flex items-center">
                        <p>Email</p>
                        <div class="grow" />
                        <i
                            class={`bi ${emailSortedToggle ? "bi-chevron-down" : "bi-chevron-up"}`}
                        />
                    </div>
                </th>
                <th on:click={() => sortTable("student")} class="cursor-pointer">
                    <div class="flex items-center">
                        <p>Student</p>
                        <div class="grow" />
                        <i
                            class={`bi ${studentSortedToggle ? "bi-chevron-down" : "bi-chevron-up"}`}
                        />
                    </div>
                </th>
                <th on:click={() => sortTable("admin")} class="cursor-pointer">
                    <div class="flex items-center">
                        <p>Admin</p>
                        <div class="grow" />
                        <i
                            class={`bi ${adminSortedToggle ? "bi-chevron-down" : "bi-chevron-up"}`}
                        />
                    </div>
                </th>
            </tr>
        </thead>

        <tbody>
            {#each sortedUsers as user}
                <tr>
                    <td><p>{user.email}</p></td>
                    <td><p>{user.student ? "True" : "False"}</p></td>
                    <td>
                        <select
                            on:change={(e) => setAdmin(user.id, e.target.value === "True")}
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

    th.cursor-pointer
        @apply hover:bg-gray-100
</style>
