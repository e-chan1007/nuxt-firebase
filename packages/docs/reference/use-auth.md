# useAuth
::: tip
This composable is available on both the client and server sides.
:::

Get `auth` instance and reactive `currentUser` and `isAuthenticated`. the same as to do `getAuth().currentUser`.

::: warning
Even though you can know who the user is on the server by enabling [`authSSR`](../guide/configuration#authssr), they cannot be currently authenticated there. For example, using Firestore with security rules based on identity could fail. You might have to consider using it on Client-side only or using Admin SDK.
:::

## Example
```ts
const { auth, currentUser, isAuthenticated } = useAuth();

if (isAuthenticated) {
  // `currentUser` is a `ref` and `isAuthenticated` is a `computed`
  console.log(currentUser.value?.displayName)
}
```

To use in server routes(`~/server/`), you should use [`useServerAuth`](./use-server-auth) instead of `useAuth`.
```ts
import { useServerAuth } from '#firebase/server'
const { currentUser, isAuthenticated } = useServerAuth()
```
