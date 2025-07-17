export interface Campaign {
    id?: string
    name: string
    description: string
    newsletters?: Array<Object>
    company?: any
    images?: any
    createdAt?: Date | string
    updatedAt?: Date | string
}
