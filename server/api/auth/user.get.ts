import { getUserToken } from "../../services/userService"

// Get user infos from token
export default defineEventHandler(async (event) => {
    return getUserToken(event, false, true)
})
