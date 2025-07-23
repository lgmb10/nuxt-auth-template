# Nuxt Auth Template

## Stack Technique

Nuxt 4
Vue 3.5

Interfaces : NuxtUI

## Setup

Make sure to install dependencies:

```bash
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

# Authentification

## Pourquoi une authentification côté serveur ?

L'authentification est géré côté serveur de Nuxt dans /server car c'est la manière la plus sécurisé de gérer le stockage d'un token d'authentification :

- Cela permet de centraliser les requêtes d’authentification via le serveur Nuxt, évitant ainsi que le client n’interagisse directement avec une API externe et puisse voir les urls.
- Grâce à l'utilisation de la partie serveur, nous avons la possibilité de stocker le token dans un Cookie de type HttpOnly avec ces caractéristiques :

```ts
httpOnly: true,
secure: true,
SameSite: "strict",
```

- Le cookie HttpOnly est automatiquement envoyé par le navigateur lors des requêtes au serveur. Le backend peut ainsi récupérer et valider le token sans exposition côté client.
- Le token n'est donc pas stocké dans un localStorage ou sessionStorage, qui sont accessibles par JavaScript et vulnérables aux attaques XSS.

L'attribut `secure:true` force l’envoi du cookie uniquement en HTTPS, empêchant l’interception sur une connexion non sécurisée.\
L'attribut `SameSite: "strict"` empêche les requêtes cross-site d’inclure le cookie, ce qui réduit les risques d’attaques CSRF (Cross-Site Request Forgery)

Les informations utilisateur ne sont jamais stockées de façon pérenne dans un Store ou autre et ne sont récupérées que si nécessaire.
Le token est chiffré avec la lib jose en A256GCM

## Fonctionnement dans le projet

Un middleware globale `auth.global.ts` va venir vérifier la présence et la validité d'un token à chaque changement de page, si ce n'est pas le cas, l'utilisateur est automatiquement redirigé vers la page de connexion (certaines pages ne sont pas concernés : login, register, reset-password et forgot-password)

Si jamais un appel api nécessitant le token utilisateur reçoit un token expiré ou invalide renvoyant une erreur 401 durant des actions utilisateur sur une page, il est redirigé vers la page de login via une redirection 302 dans le `onResponseError` du `$fetch`

### Comment protéger une page à un rôle spécifique

Le middleware `check-roles.ts` permet de limiter l'accès à une page en spécifiant un rôle, ainsi si l'utilisateur possède le rôle requis ou un rôle avec des droits supérieurs il peut accéder à la page, dans le cas contraire il sera redirigé vers la page de login avec un message d'erreur spécifique.

Exemple d'utilisation :

```ts
<script lang="ts" setup>
      definePageMeta({
        middleware: "check-roles",
        requiredRole: "ROLE_ADMIN"
    })
</script>
```

### Comment obtenir le rôle de l'utilisateur

Il est possible qu'il y ai besoin de connaître le rôle de l'utilisateur pour des accès spécifiques dans une page. Par exemple un administrateur à accès à une page mais seul le super admin peut accéder à certaines fonctionnalités comme un bouton d'édition par exemple.

Pour se faire il y a 2 méthodes :\

- checkUserRole qui vérifie le type strict de l'utilisateur

```ts
const isSuperAdmin: boolean = await checkUserRole("ROLE_SUPER_ADMIN")
```

- checkRequiredRole qui vérifie si l'utilisateur possède le rôle requis ou un rôle avec des droits supérieurs

```ts
const isAtLeastAdmin: boolean = await checkRequiredRole("ROLE_ADMIN")
```
