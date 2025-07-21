export function sendResponse(e: string | null, code: number) {
    return new Response(e, { status: code })
}

export function sendJSONResponse(e: object | null, code: number) {
    return new Response(JSON.stringify(e), {
        status: code,
        headers: {
            "Content-Type": "application/json"
        }
    })
}
