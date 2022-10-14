---
home: true

heroText: Nuxt Firebase
tagline: Integrate Firebase with Nuxt (3)

actions:
- text: Get Started
  link: /guide/getting-started
      
features:
- title: Nuxt3 Ready
  details: Built on Vue 3, can use very easily by Auto-imports and Composables.
- title: Firebase v9 SDK Ready
  details: A new API surface allows to tree-shake so that make apps small.
- title: Auth with SSR
  details: By using Service Worker, identity is also available on the server-side and API-routes.
---

## Setup

1.  Install dependencies

```sh
# npm
npm install -D firebase @e-chan1007/nuxt-firebase
# yarn
yarn add -D firebase @e-chan1007/nuxt-firebase
# pnpm
pnpm add -D firebase @e-chan1007/nuxt-firebase
```

Don't forget to install `firebase`.

2.  Add this module to the Nuxt config

```ts
export default defineNuxtConfig({
  modules: [
    '@e-chan1007/nuxt-firebase'
  ],
  firebase: {
    // set options here...
  }
})
```

3.  Use in your pages, components or server routes

```vue
<template>
  <p>Hello {{ currentUser?.displayName }}!</p>
</template>

<script lang="ts" setup>
const { currentUser } = useAuth();
</script>
```
