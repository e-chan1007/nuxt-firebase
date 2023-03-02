# useAuth

::: tip
このコンポーザブルはクライアントサイド・サーバーサイドの両方で利用できます。
:::

`auth` インスタンスとリアクティブな `currentUser`と `isAuthenticated`を取得します。`getAuth().currentUser`と同等の処理を行います。

::: warning
[`useAuthSSR`](../guide/configuration#useauthssr)によってサーバーサイドでユーザーの情報を利用できますが、サーバーサイドで認証されてはいません。例えば、セキュリティールールを設定したFirestoreに対するサーバーサイドからのアクセスは失敗することがあります。クライアントサイドだけでデータにアクセスするか、サーバーサイドではAdmin SDKを使うことを検討してください。
:::

## Example

```ts
const { auth, currentUser, isAuthenticated } = useAuth();

if (isAuthenticated) {
  // `currentUser` は `ref`、`isAuthenticated` は `computed`
  console.log(currentUser.value?.displayName)
}
```

サーバールート(`~/server/`)で利用する場合は、`useAuth`ではなく[`useServerAuth`](./use-server-auth)を利用してください。

```ts
import { useServerAuth } from '#firebase/server'
const { currentUser, isAuthenticated } = useServerAuth()
```
