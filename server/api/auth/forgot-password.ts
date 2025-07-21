export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const baseUrl = useRuntimeConfig().public.envApi

    if (body.email) {
        const email = body.email

        try {
            await $fetch(`${baseUrl}/forgot-password/`, {
                method: "POST",
                headers: {
                    Accept: "application/ld+json",
                    "Content-Type": "application/ld+json"
                },
                body: JSON.stringify({ email }),
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
            statusMessage: "Certains champs sont manquants"
        })
    }
})
