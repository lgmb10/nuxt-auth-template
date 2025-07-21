import type { H3Event, EventHandlerRequest } from "h3"
import type { UserCookie, User } from "../../types/user"
import { CompactEncrypt, compactDecrypt, decodeJwt } from "jose"
import { sendResponse, isJWTExpired } from "../utils/auth"
import { getInfoFromJWT } from "../../app/utils/auth"

/**
 *
 * @returns Get JWT secret encryption key
 */
export function getJWESecret(): Uint8Array {
    const secret = useRuntimeConfig().jwtSecret

    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables")
    }

    const keyBuffer = Buffer.from(secret, "base64")

    if (keyBuffer.length !== 32) {
        throw new Error(
            `Invalid JWE key length. Expected 32 bytes (256 bits), got ${keyBuffer.length} bytes.`
        )
    }

    return keyBuffer
}

/**
 *
 * @param event Provide H3event from server api context
 * @param isLoggedIn Set at true if you want to only know if user is logged in with boolean and not provide token
 * @param getParsedToken Set at true if you want user infos from token, by default return token
 * @param JSONResponse Set at true if you want a response formated to JSON
 * @returns Get user JWT token or boolean as true if logged in
 */
export const getUserToken = async (
    event: H3Event<EventHandlerRequest>,
    isLoggedIn: boolean = false,
    getParsedToken: boolean = false,
    JSONReponse: boolean = false
): Promise<Response> => {
    const userCookie = await getUserFromCookie(event)

    if (userCookie) {
        try {
            const token = JSON.parse(userCookie)
            if (token.token) {
                let tokenParsed = null
                try {
                    tokenParsed = decodeJwt(token.token)
                } catch (error) {
                    return sendResponse(error as string, 401, JSONReponse)
                }

                if (isJWTExpired(tokenParsed.exp)) {
                    return sendResponse("Token expired", 401, JSONReponse)
                } else {
                    if (getParsedToken) {
                        return sendResponse(
                            getInfoFromJWT(tokenParsed, true),
                            200,
                            JSONReponse
                        )
                    } else {
                        return sendResponse(
                            isLoggedIn ? true : token.token,
                            200,
                            JSONReponse
                        )
                    }
                }
            } else sendResponse("Token not found", 401, JSONReponse)
        } catch {
            return sendResponse("Cookie not found", 401, JSONReponse)
        }
    }

    return sendResponse("Cookie not found", 400, JSONReponse)
}

/**
 *
 * @param event Provide H3event from server api context
 * @returns Get user roles
 */
export const getUserRoles = async (
    event: H3Event<EventHandlerRequest>
): Promise<string[] | null> => {
    const response = await getUserToken(event, false, true, true)

    const user = await response.json()
    const roles = (user as User).roles

    if (response.status === 200) {
        return roles
    } else {
        return null
    }
}

/**
 *
 * @param event Provide H3event from server api context
 * @returns get decrypted user Cookie
 */
export const getUserFromCookie = async (
    event: H3Event<EventHandlerRequest>
) => {
    try {
        const tokenEncrypted = getCookie(event, "user")

        if (!tokenEncrypted) return null

        const secret = getJWESecret()

        try {
            const { plaintext } = await compactDecrypt(tokenEncrypted, secret)
            const decrypted = new TextDecoder().decode(plaintext)
            return decrypted
        } catch (error) {
            console.error(error)
            return null
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

/**
 *
 * @param event Provide H3event from server api context
 * @param user Provide UserCookie with token and stayConnected
 * @returns Get response if cookie created or reponse error
 */
export const setUserCookie = async (
    event: H3Event<EventHandlerRequest>,
    user: UserCookie
) => {
    try {
        const expiresIn1Day = new Date(Date.now() + 24 * 60 * 60 * 1000)

        const tokenParsed = JSON.parse(
            Buffer.from(user.token.split(".")[1], "base64").toString()
        )

        const expires = new Date(
            Date.now() + (tokenParsed.exp - tokenParsed.iat) * 1000
        )

        const secret = getJWESecret()

        const userEncrypted = await new CompactEncrypt(
            new TextEncoder().encode(JSON.stringify(user))
        )
            .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
            .encrypt(secret)

        setCookie(event, "user", userEncrypted, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: user.stayConnected ? expires : expiresIn1Day
        })
        return { statusCode: 200 }
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: String(error)
        })
    }
}

/**
 *
 * @param event Provide H3event from server api context
 * @returns Delete user cookie
 */
export const deleteUserCookie = (event: H3Event<EventHandlerRequest>) => {
    try {
        deleteCookie(event, "user", {
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
