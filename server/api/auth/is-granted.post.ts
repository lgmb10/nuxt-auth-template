import { definedRoles } from "../../utils/roles"
import { isGranted } from "../../utils/auth"
import { getUserRoles } from "../../services/userService"

// Check if user have at least provided role or superior role
// if you provide isRole: true in body, check only if user role is equal to requiredRole
export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (body.role) {
        const requiredRole = body.role

        try {
            const roles: string[] | null = await getUserRoles(event)

            if (body.isRole && roles) {
                if (roles[0] === requiredRole) return true
                else return false
            }

            if (
                !roles ||
                !requiredRole ||
                !(requiredRole in definedRoles) ||
                !isGranted(roles, requiredRole)
            ) {
                return sendResponse({ isGranted: false }, 200, true)
            } else {
                return sendResponse({ isGranted: true }, 200, true)
            }
        } catch {
            return createError({
                statusCode: 400,
                statusMessage: "Cannot check your role"
            })
        }
    } else {
        return createError({
            statusCode: 400,
            statusMessage: "Role not provided"
        })
    }
})
