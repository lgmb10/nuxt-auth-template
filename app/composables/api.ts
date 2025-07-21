import { apiNewsletter } from "../../api/apiNewsletter"

export const useApi = () => {
    const API_NEWSLETTER = useRuntimeConfig().public.envApi

    return {
        apiNewsletter: apiNewsletter(API_NEWSLETTER)
    }
}
