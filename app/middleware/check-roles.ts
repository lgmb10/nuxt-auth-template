import { isGranted } from "../utils/auth"

export default defineNuxtRouteMiddleware(async (to) => {
    const requiredRole: string = to.meta.requiredRole as string
    // let user: User | null = null
    let roles: string[] | null = null
    const requestFetch = useRequestFetch()
    const toast = useToast()

    try {
        const res: string[] = await requestFetch("/api/auth/roles")
        roles = res
    } catch (e) {
        console.error(e)
        toast.add({
            title: "Erreur",
            description:
                "Vous n'avez pas les droits requis pour accéder à cette page",
            color: "error"
        })
        return navigateTo({
            name: "login"
        })
    }

    if (
        !requiredRole ||
        !(requiredRole in definedRoles) ||
        !isGranted(roles as [string], requiredRole)
    ) {
        toast.add({
            title: "Erreur",
            description:
                "Vous n'avez pas les droits requis pour accéder à cette page",
            color: "error"
        })
        return navigateTo({
            name: "login"
        })
    }
})
