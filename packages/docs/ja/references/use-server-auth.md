# useServerAuth

::: tip
このコンポーザブルはサーバールートのみで利用できます。
:::

Service Worker経由で渡されたIDトークンを利用して、`currentUser`と`isAuthenticated`を取得します。 \
クライアントサイドやNuxtのインスタンスが有効な場所(`~/pages/`など)では、`useServerAuth`ではなく[`useAuth`](./use-auth)を利用してください。

`useAuth`とは違って、`currentUser`と`isAuthenticated`はどちらも定数なので`.value`なしで値を利用できます。

## Example

```ts
import { useServerAuth } from '#firebase/server'

export default defineEventHandler((event) => {
  const { currentUser } = useServerAuth(event)
  return {
    message: 'Hello',
    user: currentUser?.displayName
  }
})

```
