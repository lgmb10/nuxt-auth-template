import type { H3Event, EventHandlerRequest } from "h3"
import type { UserCookie } from "~/types/user"
import { CompactEncrypt, compactDecrypt } from "jose"

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
