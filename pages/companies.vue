<template>
    <div>{{ response }}</div>
</template>

<script lang="ts" setup>
    const filters = ref({
        page: 1,
        itemsPerPage: 12,
        search: ""
    })

    const params = {
        page: filters.value.page,
        itemsPerPage: filters.value.itemsPerPage,
        name: filters.value.search,
        ["order[updatedAt]"]: "DESC"
    }
    const response = await useApi().apiNewsletter.getAllCompanies(params)
</script>

<style></style>
