<template>
    <div class="h-screen mx-auto flex items-center">
        <div class="mx-auto w-96">
            <h2 class="text-4xl font-bold text-center mb-5">
                Mot de passe oublié
            </h2>
            <section class="">
                <UForm
                    :schema="schema"
                    :state="state"
                    class="space-y-4"
                    @submit="onSubmit">
                    <UFormField label="Email" name="email">
                        <UInput v-model="state.email" class="w-full" />
                    </UFormField>
                    <div class="flex justify-center">
                        <UButton
                            type="submit"
                            class="cursor-pointer mt-2"
                            :loading="isLoading">
                            Envoyer la demande
                        </UButton>
                    </div>
                </UForm>
                <div
                    v-if="success"
                    class="text-center text-validation-error mx-4 pt-2">
                    <p class="text-lg">
                        Votre demande à bien été prise en compte. <br />
                        Si l'adresse mail correspond à un compte existant vous
                        allez recevoir un mail contenant un lien pour
                        réinisialiser votre mot de passe
                    </p>
                </div>
                <NuxtLink :to="{ name: 'login' }" class="pt-4 block text-center"
                    >Revenir à la connexion &rsaquo;</NuxtLink
                >
            </section>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { object, string } from "yup"

    definePageMeta({
        layout: "empty"
    })

    const isLoading = ref(false)
    const success = ref(false)
    const toast = useClientToast()

    const state = reactive({
        email: undefined
    })

    const schema = object({
        email: string().email("format de l'email incorrecte").required()
    })

    async function onSubmit() {
        isLoading.value = true

        try {
            const res: { statusCode: number } = await $fetch(
                "/api/auth/forgot-password",
                {
                    method: "POST",
                    body: JSON.stringify({
                        email: state.email
                    })
                }
            )

            if (res.statusCode === 200) {
                toast.add({
                    duration: 15000,
                    title: "Votre demande à bien été prise en compte",
                    description: `Si l'adresse mail correspond à un compte existant vous
                        allez recevoir un mail contenant un lien pour
                        réinisialiser votre mot de passe`,
                    color: "success"
                })
            }
        } catch (error: any) {
            console.error(error)
            toast.add({
                title: "Erreur",
                description: "Une erreur esrt survenue",
                color: "error"
            })
        } finally {
            isLoading.value = false
        }
    }
</script>

<style></style>
