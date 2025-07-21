export const definedRoles = Object.freeze({
    ROLE_SUPER_ADMIN: 2,
    ROLE_ADMIN: 1,
    ROLE_USER: 0
})

export const roleMapping: Record<string, string> = {
    ROLE_USER: "Utilisateur",
    ROLE_ADMIN: "Administrateur",
    ROLE_SUPER_ADMIN: "Super Admin"
}
