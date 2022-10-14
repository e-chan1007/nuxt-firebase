# useServerAuth

::: tip
This composable is available in the server routes.
:::

Get `currentUser` and `isAuthenticated` value by parsing the ID token provided by Service Worker.\
To use in client-side or where Nuxt App is available (such as `~/pages/`), you should use [`useAuth`](./use-auth) instead of `useServerAuth`.

Differing from `useAuth`, both `currentUser` and `isAuthenticated` are just variables so you can access them without `.value`.

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
