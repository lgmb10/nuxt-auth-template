import { setLocale } from "yup"
import { fr } from "yup-locales"

if (fr.mixed) {
    fr.mixed.required = "champ obligatoire"
}

export default defineNuxtPlugin(() => {
    setLocale(fr)
})
