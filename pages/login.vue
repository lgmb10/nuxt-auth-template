<template>
    <div class="h-screen mx-auto flex items-center">
        <div class="mx-auto w-96">
            <h1 class="text-4xl font-bold text-center mb-5">
                Nuxt Auth Template
            </h1>
            <UForm
                :schema="schema"
                :state="state"
                class="space-y-4"
                @submit="onSubmit">
                <UFormField label="Email" name="email">
                    <UInput v-model="state.email" class="w-full" />
                </UFormField>
                <UFormField label="Mot de passe" name="password">
                    <UInput
                        v-model="state.password"
                        class="w-full"
                        placeholder="•••••"
                        :type="show ? 'text' : 'password'"
                        :ui="{ trailing: 'pe-1' }">
                        <template #trailing>
                            <UButton
                                color="neutral"
                                variant="link"
                                size="sm"
                                :icon="
                                    show ? 'i-lucide-eye-off' : 'i-lucide-eye'
                                "
                                :aria-label="
                                    show
                                        ? 'Masquer le mot de passe'
                                        : 'Afficher le mot de passe'
                                "
                                :aria-pressed="show"
                                aria-controls="password"
                                @click="show = !show" />
                        </template>
                    </UInput>
                </UFormField>
                <div class="flex justify-center">
                    <UButton
                        type="submit"
                        class="cursor-pointer"
                        :loading="isLoading">
                        Se connecter
                    </UButton>
                </div>
            </UForm>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { object, string } from "yup"

    definePageMeta({
        layout: "empty"
    })

    const router = useRouter()
    const show = ref(false)
    const isLoading = ref(false)

    const schema = object({
        email: string().email("format de l'email incorrecte").required(),
        password: string()
            .min(8, "Doit contenir au moins 8 caractères")
            .required()
    })

    const state = reactive({
        email: "anthony@lunamy.com",
        password: "bT2gSUIr8ifyxo7QyYJZ"
    })

    const toast = useToast()

    async function onSubmit() {
        isLoading.value = true
        try {
            const res: { statusCode: number } = await $fetch("/api/login", {
                method: "POST",
                body: JSON.stringify({
                    email: state.email,
                    password: state.password,
                    stayConnected: true
                })
            })

            if (res.statusCode === 200) {
                let previousPage: string | null = null
                try {
                    previousPage = await $fetch("/api/previousPage")
                } catch {
                    await navigateTo({ name: "index" })
                } finally {
                    if (previousPage !== null) {
                        if (
                            !authorizedPages.includes(previousPage.substring(1))
                        ) {
                            await router.push(JSON.parse(previousPage))
                        } else {
                            await navigateTo({ name: "index" })
                        }
                    } else {
                        await navigateTo({ name: "index" })
                    }
                }
            }
        } catch (error: any) {
            console.log("login error :", error)
            switch (error.statusCode) {
                case 401:
                    toast.add({
                        title: "Erreur",
                        description: "Email ou mot de passe incorrect",
                        color: "error"
                    })
                    break
                case 500:
                    toast.add({
                        title: "Erreur",
                        description: "Une erreur esrt survenue",
                        color: "error"
                    })
                    break
                default:
                    toast.add({
                        title: "Erreur",
                        description: "Une erreur esrt survenue",
                        color: "error"
                    })
                    break
            }
        } finally {
            isLoading.value = false
        }
    }
</script>

<style lang="scss">
    ::-ms-reveal {
        display: none;
    }
</style>
