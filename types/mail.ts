// BlockTemplate
export interface BlockTemplate {
    "@context": string
    "@id": string
    "@type": string
    name: string
    content: string
    images: string[]
    company: string
    variables: BlockTemplateVariable[]
}

// Block
export interface Block {
    "@context"?: string
    "@id"?: string
    id?: string
    "@type"?: string
    title: string
    name: string
    content: string
    position: number
    baseBlock: string
    row?: string
    variables?: MailVariable[]
    images?: Image[]
    createdAt?: Date
    updatedAt?: Date
}

// RowTemplate
export interface RowTemplate {
    "@context": string
    "@id": string
    id?: string
    "@type": string
    name: string
    content: string
    company?: string
    variables: MailVariable[]
    images: string[]
    blocks?: ([] | Block[])[]
}

// Row
export interface Row {
    "@context"?: string
    "@id"?: string
    id?: string
    "@type"?: string
    name: string
    content: string
    position: number
    blocks: ([] | Block[])[]
    newsletter?: string
    variables: MailVariable[]
    images?: Image[]
    createdAt?: Date
    updatedAt?: Date
}

// NewsletterTemplate
export interface NewsletterTemplate {
    "@context": string
    "@id": string
    id?: string
    "@type": string
    name: string
    subject: string
    content: string
    trackingCode: string
    imagePath: string
    rows: Row[]
}

// Newsletter
export interface Newsletter {
    "@id"?: string
    id?: string
    name: string
    subject: string
    content?: string
    campaign?: Campaign | string
    trackingCode?: string
    imagePath?: string
    rows: Row[]
    images: Image[]
    variables: MailVariable[]
    status: string
    createdAt?: Date
    updatedAt?: Date
}

interface Company {
    "@id"?: string
    id?: string
    "@type": "Company"
    name: string
    createdAt: Date
    updatedAt: Date
}

interface Campaign {
    "@id"?: string
    id?: string
    "@type": string
    name: string
    company: Company
    createdAt: Date
    updatedAt: Date
}

// BlockTemplateVariable
interface BlockTemplateVariable {
    id?: string
    template: string
    block: string
    row: string
    name: string
    identifier: string
    description: string
    type: string
}

// MailVariable
export interface MailVariable {
    "@id"?: string
    id?: string
    newsletter?: string
    row?: string
    block?: string
    name: string
    identifier: string
    description: string
    value: string
    groups?: string
    images?: (File | Image)[]
    type: string
    createdAt?: Date
    updatedAt?: Date
}

// Image
export interface Image {
    "@context"?: string
    "@id": string
    "@type": string
    createdAt?: Date
    updatedAt?: Date
}
