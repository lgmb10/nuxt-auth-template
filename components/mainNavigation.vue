<template>
    <nav class="flex justify-between">
        <UNavigationMenu
            color="neutral"
            variant="link"
            :items="items"
            class="w-full" />
        <span class="block sticky top-0 left-full px-2 pt-1">v1.0</span>
    </nav>
</template>

<script lang="ts" setup>
    import type { NavigationMenuItem } from "@nuxt/ui"

    const items = ref<NavigationMenuItem[][]>([
        [
            {
                label: "Accueuil",
                icon: "i-lucide-house",
                to: "/"
            },
            {
                label: "Companies",
                icon: "i-lucide-building",
                to: "/companies"
            },
            {
                label: "Déconnexion",
                icon: "i-lucide-log-out",
                to: "/logout"
            }
        ]
    ])
</script>

<style></style>
