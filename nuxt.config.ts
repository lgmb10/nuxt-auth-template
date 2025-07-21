// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-05-15",
    devtools: {
        enabled: true,

        timeline: {
            enabled: true
        }
    },
    runtimeConfig: {
        jwtSecret: process.env.JWT_SECRET,
        public: {
            envApi: process.env.NUXT_PUBLIC_ENV_API || "",
            testEmail: process.env.TEST_EMAIL,
            testPassword: process.env.TEST_PASSWORD
        }
    },
    css: ["~/assets/styles/main.css"],
    modules: [
        "@nuxt/eslint",
        "@nuxt/image",
        "@nuxt/test-utils",
        "@nuxt/ui",
        "@pinia/nuxt"
    ]
})
