import { getUserToken } from "../../services/userService"

// Get token if user is logged in
export default defineEventHandler(async (event) => {
    return getUserToken(event)
})
