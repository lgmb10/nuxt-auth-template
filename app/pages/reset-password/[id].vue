<template>
    <div class="h-screen mx-auto flex items-center">
        <div class="mx-auto w-96">
            <h2 class="text-4xl font-bold text-center mb-5">
                Réinitialisez votre mot de passe
            </h2>
            <UForm
                :schema="schema"
                :state="state"
                class="space-y-4"
                @submit="onSubmit">
                <UFormField label="Nouveau mot de passe" name="password">
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
                <UFormField
                    label="Confirmez le mot de passe"
                    name="confirmPassword">
                    <UInput
                        v-model="state.confirmPassword"
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
                        class="cursor-pointer mt-2"
                        :loading="isLoading"
                        :disabled="invalidToken">
                        Envoyer la demande
                    </UButton>
                </div>
            </UForm>
            <NuxtLink :to="{ name: 'login' }" class="pt-4 block text-center"
                >Revenir à la connexion &rsaquo;</NuxtLink
            >
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { object, string } from "yup"

    definePageMeta({
        layout: "empty"
    })

    const toast = useClientToast()
    const route = useRoute()

    const show = ref(true)
    const isLoading = ref(false)
    const invalidToken = ref(false)

    const schema = object({
        password: string()
            .min(4, "Doit contenir au moins 4 caractères")
            .required(),
        confirmPassword: string()
            .min(4, "Doit contenir au moins 4 caractères")
            .required()
    })

    const state = reactive({
        password: "",
        confirmPassword: ""
    })

    try {
        await $fetch(`/api/auth/reset-password?token=${route.params.id}`)
    } catch (error: any) {
        switch (error.statusCode) {
            case 404:
                toast.add({
                    title: "Erreur",
                    description: "Le lien est invalide ou a expiré",
                    color: "error"
                })
                invalidToken.value = true
                break
            case 500:
                toast.add({
                    title: "Erreur",
                    description: "Une erreur est survenue",
                    color: "error"
                })
                break
        }
        isLoading.value = false
    }

    async function onSubmit() {
        if (state.password.length && state.password !== state.confirmPassword) {
            toast.add({
                title: "Erreur",
                description: "Les mots de passes ne sont pas identiques",
                color: "error"
            })
            return
        }
        isLoading.value = true

        try {
            const res: { statusCode: number } = await $fetch(
                "/api/reset-password",
                {
                    method: "POST",
                    body: JSON.stringify({
                        token: route.params.id,
                        password: state.password
                    })
                }
            )

            if (res.statusCode === 200) {
                toast.add({
                    description: `Votre mot de passe à bien été modifié`,
                    color: "success"
                })
                navigateTo({ name: "login" })
            }
            isLoading.value = false
        } catch (error: any) {
            console.error(error)
            toast.add({
                title: "Erreur",
                description: "Une erreur est survenue",
                color: "error"
            })
            isLoading.value = false
        }
    }
</script>

<style></style>
