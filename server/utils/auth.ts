import { definedRoles } from "../utils/roles"

export function sendResponse(
    e: string | object | null,
    code: number,
    isJSON: boolean = false
) {
    if (isJSON) {
        let object = e
        if (typeof object === "string") {
            object = { message: e }
        }

        return new Response(JSON.stringify(e), {
            status: code,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    return new Response(e as string, { status: code })
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

export function isJWTExpired(exp: number) {
    return Date.now() >= exp * 1000
}
