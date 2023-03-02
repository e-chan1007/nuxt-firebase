import { getMessaging, getToken } from 'firebase/messaging'
import { useRuntimeConfig } from 'nuxt/app'

export const useFCMToken = async () => {
  if (process.client) {
    const runtimeConfig = useRuntimeConfig()
    const messaging = getMessaging()
    const messagingSW = await navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope')
    return getToken(messaging, { serviceWorkerRegistration: messagingSW, vapidKey: runtimeConfig.__FIREBASE_VAPID_KEY__ })
  }
}
