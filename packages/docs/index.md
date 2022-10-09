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
---

## Setup
1. Install dependencies
```sh
# npm
npm install -D firebase @e-chan1007/nuxt-firebase
# yarn
yarn add -D firebase @e-chan1007/nuxt-firebase
# pnpm
pnpm add -D firebase @e-chan1007/nuxt-firebase
```

2. Add this module to the Nuxt config
```ts
export default defineNuxtConfig({
  modules: [
    '@e-chan1007/nuxt-firebase'
  ]
})
```
```
