<template>
    <div v-if="status === 'success'" class="p-4">
        <p class="font-bold">You are authorized to fetch this data !</p>
        <ul>
            <li
                v-for="(compnay, index) in response['hydra:member']"
                :key="index">
                {{ compnay.name }}
            </li>
        </ul>
    </div>
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
    const { data: response, status } = await useAsyncData("companies", () =>
        useApi().apiNewsletter.getAllCompanies(params)
    )
</script>

<style></style>
