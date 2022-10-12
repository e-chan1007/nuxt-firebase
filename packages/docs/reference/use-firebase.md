# useFirebase
::: tip
This composable is available on both the client and server sides.
:::

Get firebase Client SDK app. the same as to do `initializeApp()` or `getApp()`.

## Example
```ts
import { getFirestore } from 'firebase/firestore'

const app = useFirebase()
const firestore = getFirestore(app)

// To run only in Client-side: wrap in `onMounted`:
onMounted(() => {
  const firestore = getFirestore(app)  
})
```
