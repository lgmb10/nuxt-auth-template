// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt({
    rules: {
        "@typescript-eslint/no-wrapper-object-types": "off",
        "vue/html-self-closing": "off",
        "@typescript-eslint/no-explicit-any": "off"
    }
})
