export default defineNuxtRouteMiddleware(async (to) => {
    const requiredRole: string = to.meta.requiredRole as string
    const toast = useToast()

    try {
        const isGranted: boolean = await checkRequiredRole(requiredRole)

        if (!isGranted) {
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
    } catch {
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
