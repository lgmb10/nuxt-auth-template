import { getUserToken } from "../../services/userService"
import type { User } from "../../../types/user"
import { sendJSONResponse } from "../../utils/auth"

// Get roles infos from token
export default defineEventHandler(async (event) => {
    const response = await getUserToken(event, false, true)

    const user = await response.json()
    const roles = (user as User).roles

    if (response.status === 200) {
        return sendJSONResponse(roles, 200)
    } else {
        return response
    }
})
