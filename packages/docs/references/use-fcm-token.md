# useFCMToken

::: tip
This composable is available on the client side.
:::

Get Firebase Cloud Messaging(FCM) registration token. The same as to do [`getToken()`](https://firebase.google.com/docs/reference/js/messaging_#gettoken).

## Example

```ts
// Wrap in `onMounted` to run on the client side
onMounted(() => {
  // Request notification permissions
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      const fcmToken = await useFCMToken();

      if (fcmToken) {
        // POST token to send notifications from server
        await $fetch('/api/notification/register', { method: 'POST', body: { token: fcmToken } })
      }
    }
  })
})
```
