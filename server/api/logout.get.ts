import { deleteUserCookie } from "../services/userService"

import { deletePreviousPageCookie } from "../services/previousPageService"

export default defineEventHandler(async (event) => {
    deletePreviousPageCookie(event)
    return deleteUserCookie(event)
})
