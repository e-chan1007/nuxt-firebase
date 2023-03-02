# useFCMToken

::: tip
このコンポーザブルはクライアントサイドで利用できます。
:::

Firebase Cloud Messaging(FCM) の登録トークンを取得します。[`getToken()`](https://firebase.google.com/docs/reference/js/messaging_?hl=ja#gettoken)と同等の処理を行います。

## Example

```ts
// クライアントサイドで実行するために`onMounted` で処理を囲む
onMounted(() => {
  // 通知を表示する許可を求める
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      const fcmToken = await useFCMToken();

      if (fcmToken) {
        // 登録トークンをサーバーに送信する
        await $fetch('/api/notification/register', { method: 'POST', body: { token: fcmToken } })
      }
    }
  })
})
```
