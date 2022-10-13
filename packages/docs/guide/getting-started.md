# Getting started

## Install

```sh
# npm
npm install -D firebase firebase-admin @e-chan1007/nuxt-firebase
# yarn
yarn add -D firebase firebase-admin @e-chan1007/nuxt-firebase
# pnpm
pnpm add -D firebase firebase-admin @e-chan1007/nuxt-firebase
```

Don't forget to install `firebase` and `firebase-admin`.

:::warning
Versions listed below are not supported:

*   Legacy (~ v8)
*   v9.11.0 (isn't compatible with Nuxt)

:::

## Setup

1.  Add this module to the Nuxt config

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

2.  Use in your pages, components or server routes

```vue
<template>
  <p>Hello {{ currentUser?.displayName }}!</p>
</template>

<script lang="ts" setup>
const { currentUser } = useAuth();
</script>
```
