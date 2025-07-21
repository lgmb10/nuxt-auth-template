import { getUserToken } from "../../services/userService"

// Return true if user is logged in or false
export default defineEventHandler(async (event) => {
    return getUserToken(event, true)
})
