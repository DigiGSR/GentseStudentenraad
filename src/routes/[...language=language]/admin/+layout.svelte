<script lang="ts">
    import SideBarIcon from "$lib/components/admin/SideBarIcon.svelte";
    import type { LayoutData } from "./$types";
    export let data: LayoutData;
    import { selectedLanguage } from "$lib/Language";
</script>

<div class="flex gap-12">
    <div class="gap-4 p-8 bg-neutral-50 shadow-md flex flex-col h-full grow">
        <a href="/{$selectedLanguage}/admin">
            <p class="text-3xl font-semibold">Administratie</p>
        </a>
        <div class="space-y-1">
            <p class="category">Algemeen</p>
            <SideBarIcon icon="info-circle" value="Informatie" link="/admin/about" />
            <SideBarIcon icon="segmented-nav" value="Navbar" link="/admin/navbar" />
            <SideBarIcon icon="brush" value="Thema" link="/admin/theme" />
            <SideBarIcon icon="globe" value="Sociale Media" link="/admin/media" />
            <SideBarIcon icon="toggles" value="Optionele Functies" link="/admin/features" />
            <SideBarIcon
                icon="translate"
                value="Vertalingen"
                link="/admin/i18n"
                badgeNeutral={data.i18nCount}
            />
            <SideBarIcon
                icon="person"
                value="Gebruikers"
                link="/admin/users"
                badgeNeutral={data.userCount}
            />
        </div>
        <div class="h-[1px] w-full bg-neutral-300" />
        <div class="space-y-1">
            <p class="category">Interne structuur</p>
            <SideBarIcon
                icon="person"
                value="Personen"
                badgeNeutral={data.personCount}
                link="/admin/people"
            />
            <SideBarIcon
                icon="pencil-square"
                value="Verslagen"
                link="/admin/reports"
                badgeNeutral={data.reportCount}
            />
            <SideBarIcon
                icon="people"
                value="Groepen"
                badgeNeutral={data.groupCount}
                link="/admin/groups"
            />
        </div>
        <div class="h-[1px] w-full bg-neutral-300" />
        <div class="space-y-1">
            <p class="category">Inhoud</p>
            <SideBarIcon
                icon="file-earmark-text"
                value="Reglementen"
                badgeNeutral={data.rulesCount}
                link="/admin/rules"
            />
            <SideBarIcon
                icon="newspaper"
                value="Nieuwsberichten"
                badgeNeutral={data.newsCount}
                link="/admin/nieuws"
            />
            <SideBarIcon
                icon="broadcast"
                value="Projecten"
                link="/admin/projects"
                badgeNeutral={data.projectCount}
            />
            <SideBarIcon
                icon="body-text"
                value="Standpunten"
                link="/admin/opinions"
                badgeNeutral={data.opinionCount}
            />
            <SideBarIcon
                icon="file-earmark-richtext"
                value="Pagina's"
                link="/admin/page"
                badgeNeutral={data.pageCount}
            />
            <SideBarIcon
                icon="person-lines-fill"
                value="Verkiezingen"
                link="/admin/election"
                badgeNeutral={data.electionCount}
            />
        </div>
        <div class="h-[1px] w-full bg-neutral-300" />
        <div class="space-y-1">
            <p class="category">Vakfeedback</p>
            <SideBarIcon icon="chat" value="Feedback" badgeImportant="9" link="/admin/feedback" />
        </div>
    </div>
    <div class="w-full p-12">
        <slot />
    </div>
</div>

<style lang="sass" global>
    .category
        @apply text-xs font-semibold opacity-75

    select
        appearance: none
        @apply w-full bg-white py-2 px-4 border-neutral-200 border-[1px]
</style>
