# Nuxt Firebase

[![npm version](https://badge.fury.io/js/@e-chan1007%2Fnuxt-firebase.svg)](https://badge.fury.io/js/@e-chan1007%2Fnuxt-firebase)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/0b2cc4e860eb4156ad2d61031b396307)](https://www.codacy.com/gh/e-chan1007/nuxt-firebase/dashboard?utm_source=github.com\&utm_medium=referral\&utm_content=e-chan1007/nuxt-firebase\&utm_campaign=Badge_Grade)

Integrate [Firebase](https://firebase.google.com/) with Nuxt (3)

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
*   v9.11.0 (doesn't have compatible with Nuxt)
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

## Development

*   Run `npm run dev:prepare` to generate type stubs.
*   Use `npm run dev` to start [playground](./packages/playground) in development mode.
