# useFirebaseAdmin

::: tip
このコンポーザブルはサーバーサイドのみで利用できます。
:::

Admin SDKのインスタンスを取得します。`initializeApp()`や`getApp()`と同等の処理を行います。

## Example

```ts
import { getFirestore } from 'firebase-admin/firestore'
const app = useFirebaseAdmin()
const firestore = getFirestore(app)
```

サーバールート(`~/server/`)で利用する場合は、`#firebase/server`から明示的にインポートしてください。

```ts
import { useFirebaseAdmin } from '#firebase/server'
const app = useFirebaseAdmin()
```
