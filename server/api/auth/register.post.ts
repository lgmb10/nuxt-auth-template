export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const baseUrl = useRuntimeConfig().public.envApi

    if (body.password && body.token) {
        const password = body.password
        const token = body.token

        try {
            await $fetch(`${baseUrl}/register/${token}`, {
                method: "POST",
                headers: {
                    Accept: "application/ld+json",
                    "Content-Type": "application/ld+json"
                },
                body: JSON.stringify({ password }),
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
