import type { User } from "../../types/user"
import { decodeJwt } from "jose"

// Check if the user has the required role or superior role
export async function checkRequiredRole(requiredRole: string) {
    const requestFetch = useRequestFetch()

    try {
        const response: { isGranted: boolean } = await requestFetch(
            "/api/auth/is-granted",
            {
                method: "POST",
                body: JSON.stringify({
                    role: requiredRole
                })
            }
        )

        return response.isGranted
    } catch {
        return false
    }
}

// Check if user role corresponds to the required role
export async function checkUserRole(role: string) {
    const requestFetch = useRequestFetch()

    try {
        const response: { isGranted: boolean } = await requestFetch(
            "/api/auth/is-granted",
            {
                method: "POST",
                body: JSON.stringify({
                    role: role,
                    isRole: true
                })
            }
        )

        return response.isGranted
    } catch {
        return false
    }
}

export function getInfoFromJWT(jwtToken: object | string, isParsed: boolean) {
    let tokenParsed

    if (!isParsed) {
        try {
            tokenParsed = decodeJwt(jwtToken as string)
        } catch {
            return null
        }
    } else {
        tokenParsed = jwtToken
    }

    const user: User = {
        firstname: tokenParsed.firstName,
        lastname: tokenParsed.lastName,
        email: tokenParsed.email,
        roles: tokenParsed.roles,
        exp: tokenParsed.exp,
        companies: tokenParsed.companies,
        id: tokenParsed.id
    }

    return user
}
