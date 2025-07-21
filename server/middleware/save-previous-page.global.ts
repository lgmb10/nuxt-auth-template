import { defineEventHandler, setCookie } from "h3"

export default defineEventHandler((event) => {
    const expiresIn5Minutes = new Date(Date.now() + 5 * 60 * 1000)
    const url = event.node.req.url || "/"

    // Path to exclude
    const excludedPaths = ["/favicon.ico", "/robots.txt", "/.well-known"]

    if (excludedPaths.some((path) => url.startsWith(path))) {
        return
    }

    if (url !== "/login" && !url.includes("/api")) {
        setCookie(event, "previousPage", JSON.stringify(url), {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: expiresIn5Minutes
        })
    }
})
