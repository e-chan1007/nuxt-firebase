# useFirebase

::: tip
このコンポーザブルはクライアントサイド・サーバーサイドの両方で利用できます。
:::

クライアントSDKのインスタンスを取得します。`initializeApp()`や`getApp()`と同等の処理を行います。

## Example

```ts
import { getFirestore } from 'firebase/firestore'

const app = useFirebase()
const firestore = getFirestore(app)

// // クライアントサイドのみで実行する場合は`onMounted`で囲む
onMounted(() => {
  const firestore = getFirestore(app)  
})
```
