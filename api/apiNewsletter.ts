export const apiNewsletter = (baseUrl: string) => {
    const requestFetch = useRequestFetch()

    const api = $fetch.create({
        baseURL: baseUrl,
        headers: {
            Accept: "*/*"
        },
        async onRequest({ options }) {
            const token = await requestFetch("/api/auth/token")

            if (token) {
                const headers = new Headers(options.headers)
                headers.set("Authorization", `Bearer ${token}`)
                options.headers = headers
            }
        },
        onRequestError({ error }) {
            console.error("Erreur de requête:", error.message)
            return Promise.reject(error)
        },
        async onResponseError({ response }) {
            console.error("Erreur de réponse:", response.statusText)

            if (response.status === 401) {
                await requestFetch("/api/auth/logout")
                if (!import.meta.server)
                    await navigateTo("/login", { redirectCode: 302 })
            }

            return Promise.reject(response)
        },
        async onResponse({ response }) {
            if (response._data && typeof response._data === "object") {
                response._data = {
                    ...response._data,
                    status: response.status
                }
            } else {
                response._data = {
                    data: response._data,
                    status: response.status
                }
            }
        }
    })

    return {
        async getOneCompany(id: string) {
            return await this.getOne("companies", id)
        },

        async getAllCompanies(filters?: any) {
            return await this.getAll("companies", filters)
        },

        /*****************************************************
         *  Functions
         ****************************************************/
        async getAll(ep: any, filters?: any) {
            let page =
                filters === null ||
                filters === undefined ||
                filters.page === undefined
                    ? 1
                    : filters.page
            const datas = []
            let hasNextPage = true

            do {
                const request = await api(`/${ep}`, {
                    method: "GET",
                    params: {
                        ...filters,
                        page
                    }
                })

                if (request.status === 200) {
                    if (filters && (filters.page || filters.itemsPerPage)) {
                        return request
                    } else {
                        datas.push(...(request["hydra:member"] || []))
                    }
                } else {
                    hasNextPage = false
                }

                const hydraView = request?.["hydra:view"]
                if (!hydraView || !hydraView["hydra:next"]) {
                    hasNextPage = false
                }

                page++
                //hasNextPage = false
            } while (hasNextPage)

            return datas
        },

        async getOne(ep: any, id: string, params: any = null) {
            const xhr: any = await api(`/${ep}/${id}`, {
                method: "GET",
                params: {
                    ...params
                }
            })

            return xhr
        },
        async getSome(ep: any, params: any = null) {
            const xhr: any = await api(`/${ep}`, {
                method: "GET",
                params: {
                    ...params
                }
            })

            return xhr
        },
        async create(ep: any, data: any, params: any = null) {
            const xhr = await api(`/${ep}`, {
                method: "POST",
                body: data,
                params: {
                    ...params
                }
            })
            return xhr
        },
        async update(id: string, data: any, params: any = null) {
            const result: any = await api(`${id}`, {
                method: "PATCH",
                body: data,
                headers: {
                    "Content-Type": "application/merge-patch+json"
                },
                params: {
                    ...params
                }
            })
            return result
        },
        // async updatePut(id: string, data: any, params: any = null) {
        //     const result: any = await api(`${id}`, {
        //         method: "PUT",
        //         body: data,
        //         headers: {
        //             "Content-Type": "application/ld+json"
        //         },
        //         params: {
        //             ...params
        //         }
        //     })
        //     return result
        // },
        async delete(id: string) {
            const request: any = await api(`${id}`, {
                method: "DELETE"
            })
            return request
        }
    }
}
