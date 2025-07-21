<template>
    <div class="p-4 font-bold">
        <p>This page required admin role</p>
        <p v-if="isAtLeastSuperAdmin">
            !this content required super admin role!
        </p>
    </div>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: "check-roles",
        requiredRole: "ROLE_ADMIN"
    })

    const isAtLeastSuperAdmin: boolean =
        await checkRequiredRole("ROLE_SUPER_ADMIN")
</script>

<style></style>
