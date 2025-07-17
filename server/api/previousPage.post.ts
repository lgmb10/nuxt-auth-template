import { setPreviousPage } from "../services/previousPageService"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (body.link) {
        const link = body.link
        return setPreviousPage(event, link)
    } else {
        return createError({
            statusCode: 400,
            statusMessage: "Le lien est manquant"
        })
    }
})
