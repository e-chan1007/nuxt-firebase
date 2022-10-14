---
home: true

heroText: Nuxt Firebase
tagline: Nuxt3とFirebaseの連携

actions:
- text: はじめる
  link: /ja/guide/getting-started
      
features:
- title: Nuxt3対応
  details: Vue 3で構築されており、Auto-importやComposablesによって非常に簡単に使用することができます。
- title: Firebase v9 SDK対応
  details: 新しいAPI形式によって、アプリのバンドル後のサイズを小さく保つことができます。
- title: SSRを用いた認証
  details: Service Workerを使用することで、サーバーサイドやAPIルートでも認証情報を利用できます。
---

## 設定

1.  依存関係のインストール

```sh
# npm
npm install -D firebase @e-chan1007/nuxt-firebase
# yarn
yarn add -D firebase @e-chan1007/nuxt-firebase
# pnpm
pnpm add -D firebase @e-chan1007/nuxt-firebase
```

`firebase` のインストールを忘れないでください。

2.  モジュールをNuxtの設定に追加する

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

3.  使用する

```vue
<template>
  <p>Hello {{ currentUser?.displayName }}!</p>
</template>

<script lang="ts" setup>
const { currentUser } = useAuth();
</script>
```
