import { isJWTExpired, sendResponse } from "~/utils/auth"
import { getUserFromCookie } from "../services/userService"
import { decodeJwt } from "jose"

export default defineEventHandler(async (event) => {
    const userCookie: string | null = await getUserFromCookie(event)

    if (userCookie) {
        try {
            const token = JSON.parse(userCookie)
            if (token.token) {
                let tokenParsed = null
                try {
                    tokenParsed = decodeJwt(token.token)
                } catch (error) {
                    return sendResponse(error as string, 401)
                }

                if (isJWTExpired(tokenParsed.exp)) {
                    return sendResponse("Token expired", 401)
                } else {
                    return sendResponse(token.token, 200)
                }
            } else sendResponse("Token not found", 401)
        } catch {
            return sendResponse("Cookie not found", 401)
        }
    } else {
        return sendResponse("Cookie not found", 400)
    }
})
