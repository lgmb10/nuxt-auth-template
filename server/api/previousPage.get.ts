import { sendResponse } from "~/utils/auth"
import { getPreviousPageFromCookie } from "../services/previousPageService"

export default defineEventHandler((event) => {
    const previousPageCookie = getPreviousPageFromCookie(event)

    if (previousPageCookie) {
        return sendResponse(previousPageCookie, 200)
    } else {
        return sendResponse("Cookie not found or expired", 400)
    }
})
