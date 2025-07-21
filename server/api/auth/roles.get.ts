import { getUserToken } from "../../services/userService"
import type { User } from "../../../types/user"
import { sendResponse } from "~/utils/auth"

// Get roles infos from token
export default defineEventHandler(async (event) => {
    const response = await getUserToken(event, false, true)

    const userString = await response.text()
    const roles = (JSON.parse(userString) as User).roles

    if (response.status === 200) {
        return sendResponse(JSON.stringify(roles), 200)
    } else {
        return response
    }
})
