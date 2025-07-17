import { setUserCookie } from "../services/userService"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const baseUrl = useRuntimeConfig().public.envApi

    if (body.email && body.password && body.stayConnected !== undefined) {
        const email = body.email
        const password = body.password
        const stayConnected = body.stayConnected

        try {
            const res = await $fetch<{ token: string }>(`${baseUrl}/auth`, {
                method: "POST",
                headers: {
                    Accept: "application/ld+json",
                    "Content-Type": "application/ld+json"
                },
                body: JSON.stringify({ email, password }),
                onResponseError({ response }) {
                    throw createError({
                        statusCode: response.status,
                        statusMessage: response.statusText
                    })
                }
            })

            if (!res || !res.token || res?.token === "") {
                return createError({
                    statusCode: 502,
                    statusMessage: `No token provided by API`,
                    data: {
                        response: res
                    }
                })
            }

            const user = {
                ...res,
                stayConnected: stayConnected
            }

            return setUserCookie(event, user)
        } catch (error) {
            console.error("Erreur lors de l'appel API:", error)
            return error
        }
    } else {
        return createError({
            statusCode: 400,
            statusMessage: "Certains champs sont manquants"
        })
    }
})
