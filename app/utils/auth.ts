import type { User } from "../../types/user"
import { decodeJwt } from "jose"

export function isJWTExpired(exp: number) {
    return Date.now() >= exp * 1000
}

// Check if the user has the required role or superior role
export async function checkRequiredRole(requiredRole: string) {
    let roles: string[] | null = null
    const requestFetch = useRequestFetch()

    try {
        const res: string = await requestFetch(`/api/auth/roles`)
        roles = JSON.parse(res) as string[]
    } catch {
        return false
    }

    if (isGranted(roles as string[], requiredRole)) return true
    return false
}

// Check if user role corresponds to the required role
export async function checkUserRole(role: string) {
    let roles: string[] | null = null
    const requestFetch = useRequestFetch()

    try {
        const res: string = await requestFetch(`/api/auth/roles`)
        roles = JSON.parse(res) as string[]
    } catch {
        return false
    }

    if (roles[0] === role) return true
    return false
}

export function isGranted(userRoles: Array<string>, requiredRole: string) {
    if (userRoles.includes(requiredRole)) return true

    const requiredLevel =
        definedRoles[requiredRole as keyof typeof definedRoles]

    return userRoles.some(
        (role) =>
            definedRoles[role as keyof typeof definedRoles] > requiredLevel
    )
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
