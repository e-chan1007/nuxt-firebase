---
next: ./configuration.md
---

# はじめる

## インストール

```sh
# npm
npm install -D firebase @e-chan1007/nuxt-firebase
# yarn
yarn add -D firebase @e-chan1007/nuxt-firebase
# pnpm
pnpm add -D firebase @e-chan1007/nuxt-firebase
```

`firebase`を必ずインストールしてください。\
Admin SDKを利用する場合は、`firebase-admin`のインストールも必要です。

:::warning
`firebase`の以下のバージョンはサポートされていません。

*   v8までの古いバージョン
*   v9.11.0 (Nuxtとの互換性なし)

:::

## 設定

1.  モジュールをNuxtの設定に追加する

```ts
export default defineNuxtConfig({
  modules: [
    '@e-chan1007/nuxt-firebase'
  ],
  firebase: {
    // ここでオプションを設定します。
  }
})
```

2.  使用する

```vue
<template>
  <p>Hello {{ currentUser?.displayName }}!</p>
</template>

<script lang="ts" setup>
const { currentUser } = useAuth();
</script>
```
