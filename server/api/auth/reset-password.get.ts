export default defineEventHandler(async (event) => {
    const { token } = getQuery(event)
    const baseUrl = useRuntimeConfig().public.envApi

    if (token) {
        try {
            await $fetch(`${baseUrl}/forgot-password/${token}`, {
                method: "GET",
                onResponseError({ response }) {
                    throw createError({
                        statusCode: response.status,
                        statusMessage: response.statusText
                    })
                }
            })
        } catch (error) {
            return error
        }
        return { statusCode: 200 }
    } else {
        return createError({
            statusCode: 400,
            statusMessage: "Le token est manquant"
        })
    }
})
