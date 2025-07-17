import type { User } from "~/types/user"

export function isJWTExpired(exp: number) {
    return Date.now() >= exp * 1000
}

// Check if the user has the required role or superior role
export async function checkRequiredRole(requiredRole: string) {
    let user: User | null = null
    const requestFetch = useRequestFetch()

    try {
        const res: string = await requestFetch(`/api/user`)
        user = JSON.parse(res) as User
    } catch {
        return false
    }

    if (isGranted(user?.roles as Array<string>, requiredRole)) return true
    return false
}

// Check if user role corresponds to the required role
export async function checkUserRole(role: string) {
    let user: User | null = null
    const requestFetch = useRequestFetch()

    try {
        const res: string = await requestFetch(`/api/user`)
        user = JSON.parse(res) as User
    } catch {
        return false
    }

    if (user?.roles[0] === role) return true
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
            tokenParsed = parseJwt(jwtToken as string)
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

export function parseJwt(token: string) {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
            })
            .join("")
    )

    return JSON.parse(jsonPayload)
}

export function sendResponse(e: string, code: number) {
    return new Response(e, { status: code })
}
