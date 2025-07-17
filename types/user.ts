export interface User {
    username?: string
    lastname?: string
    firstname?: string
    email: string
    roles: Array<string>
    exp?: number
    companies?: Array<any>
    id?: string
    manager?: any
}

export interface UserCookie {
    token: string
    stayConnected: Boolean
}
