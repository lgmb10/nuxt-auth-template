import { isJWTExpired, sendResponse, getInfoFromJWT } from "~/utils/auth"
import { getUserFromCookie } from "../services/userService"

export default defineEventHandler(async (event) => {
    const userCookie = await getUserFromCookie(event)

    if (userCookie) {
        try {
            const token = JSON.parse(userCookie)
            if (token.token) {
                let tokenParsed = null
                try {
                    tokenParsed = JSON.parse(
                        Buffer.from(
                            token.token.split(".")[1],
                            "base64"
                        ).toString()
                    )
                } catch (e) {
                    return sendResponse(e as string, 401)
                }

                if (isJWTExpired(tokenParsed.exp)) {
                    return sendResponse("Token expired", 401)
                } else {
                    return sendResponse(
                        JSON.stringify(getInfoFromJWT(tokenParsed, true)),
                        200
                    )
                }
            } else sendResponse("Token not found", 401)
        } catch {
            return sendResponse("Cookie not found", 401)
        }
    } else {
        return sendResponse("Cookie not found", 400)
    }
})
