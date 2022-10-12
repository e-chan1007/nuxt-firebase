# useFirebaseAdmin

::: tip
This composable is available on the server side.
:::

Get firebase Admin SDK app. the same as to do `initializeApp()` or `getApp()`.

## Example

```ts
import { getFirestore } from 'firebase-admin/firestore'
const app = useFirebaseAdmin()
const firestore = getFirestore(app)
```

To use in server routes(`~/server/`), you should explicitly import this composable from `#firebase/server`.

```ts
import { useFirebaseAdmin } from '#firebase/server'
const app = useFirebaseAdmin()
```
