<template>
    <div></div>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: "check-roles",
        requiredRole: "ROLE_SUPER_ADMIN"
    })
</script>

<style></style>
