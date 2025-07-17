<template>
    <div>
        <nav class="font-bold flex gap-2 p-3">
            <NuxtLink :to="{ name: 'index' }">Homepage</NuxtLink>
            <NuxtLink :to="{ name: 'companies' }">Companies</NuxtLink>
            <p :to="undefined" class="cursor-pointer" @click="logout">
                Déconnexion
            </p>
        </nav>
        <slot />
    </div>
</template>

<script lang="ts" setup>
    async function logout(event: MouseEvent) {
        event.preventDefault()
        await $fetch("/api/logout")
        return navigateTo({ name: "login" })
    }
</script>

<style></style>
