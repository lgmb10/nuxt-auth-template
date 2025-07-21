<template>
    <div></div>
</template>

<script lang="ts" setup>
    await $fetch("/api/auth/logout")
    await navigateTo({ name: "login" })
</script>

<style></style>
