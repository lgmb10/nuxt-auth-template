<template>
    <div class="p-4 font-bold">This page required super admin role</div>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: "check-roles",
        requiredRole: "ROLE_SUPER_ADMIN"
    })
</script>

<style></style>
