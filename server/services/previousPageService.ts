import type { H3Event, EventHandlerRequest } from "h3"

export const getPreviousPageFromCookie = (
    event: H3Event<EventHandlerRequest>
) => {
    try {
        return getCookie(event, "previousPage")
    } catch {
        return null
    }
}

export const setPreviousPage = (
    event: H3Event<EventHandlerRequest>,
    link: string
) => {
    try {
        const expiresIn5Minutes = new Date(Date.now() + 5 * 60 * 1000)

        setCookie(event, "previousPage", JSON.stringify(link), {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: expiresIn5Minutes
        })

        return { statusCode: 200 }
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: String(error)
        })
    }
}

export const deletePreviousPageCookie = (
    event: H3Event<EventHandlerRequest>
) => {
    try {
        deleteCookie(event, "previousPage", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })
        return { statusCode: 200 }
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: String(error)
        })
    }
}
