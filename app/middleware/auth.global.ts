export default defineNuxtRouteMiddleware(async (to, from) => {
    let token: boolean | undefined = undefined
    let isLoggedIn: boolean = false
    let link: string | undefined = undefined

    if (to.path === "/login" && from.name) {
        link = from.fullPath
    } else if (to.path !== "/login") {
        link = to.fullPath
    }

    if (!authorizedPages.includes(to.name as string) || to.name === "login") {
        const requestFetch = useRequestFetch()

        try {
            token = await requestFetch("/api/auth")
            isLoggedIn = !!token
        } catch {
            isLoggedIn = false
        }

        //Redirect to login page if user is not logged in
        if (!isLoggedIn && to.name !== "login") {
            return navigateTo({ path: "/login" })
        } else if (to.name !== "login" && link) {
            try {
                await $fetch("/api/previousPage", {
                    method: "POST",
                    body: JSON.stringify({
                        link: link
                    })
                })
            } catch (error) {
                console.error(error as string)
            }
        }
    }

    // Redirect to homepage if user is already logged in
    if (to.name === "login" && isLoggedIn) {
        try {
            await $fetch("/api/auth/logout")
        } catch (error) {
            console.error(error as string)
        }
    }
})
